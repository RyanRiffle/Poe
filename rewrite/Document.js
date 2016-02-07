(function(Poe) {
'use strict';

var self;
class Document extends Poe.DomElement {
	constructor(opts) {
		opts = opts || {};
		super('div', ['click', 'mousedown', 'mousemove', 'changed']);
		self = this;
		$addClass(this.elm, 'document');
		$append(this.elm, document.body);
		this._filePath = null;
		this._savedHash = null;
		this._buffer = null;
		this.inputHandler = new Poe.InputHandler();
		this.setPageSizeIn(Poe.Document.PageSize.Letter);
		this.setPageMarginsIn(Poe.config.defaultPageMargins || {
			top: 1,
			bottom: 1,
			left: 1,
			right: 1
		});

		this.elm.style['font-family'] = Poe.config.defaultFont;
		this.elm.style['font-size'] = $ptToPxStr(Poe.config.defaultFontSize);
		if (opts.init !== false)
			this._init(opts);
	}

	/***************************************************************************
	/* API Functions
	**************************************************************************/

	setPageSizeIn(size) {
		var page = null;
		for (var i = 0; i < this.childNodes.length; i++) {
			page = this.childNodes[i];
			$css(page, 'height', $pxStr(size.h));
			$css(page, 'width', $pxStr(size.w));
		}

		this._pageSize = size;
		if (this._textCursor) {
			this._textCursor.show();
		}
		return this;
	}

	setPageMarginsIn(margins) {
		var page = null;
		for (var i = 0; i < this.childNodes.length; i++) {
			page = this.childNodes[i];
			$css(page, 'padding-left', $inchToPx(margins.left));
			$css(page, 'padding-right', $inchToPx(margins.right));
			$css(page, 'padding-top', $inchToPx(margins.top));
			$css(page, 'padding-bottom', $inchToPx(margins.bottom));
		}
		this._margins = margins;
		if (this._textCursor) {
			this._textCursor.show();
		}
		return this;
	}

	append(child) {
		this._stylePage(child);
		super.append(child);
	}

	prepend(child) {
		this._stylePage(child);
		super.prepend(child);
	}

	setFilePath(path) {
		this._filePath = path;
	}

	getFilePath() {
		return this._filePath;
	}

	getCaret() {
		return this._caret;
	}

	getBuffer() {
		return this._buffer;
	}

	setSavedHash(hash) {
		this._savedHash = hash;
	}

	getSavedHash(hash) {
		return this._savedHash;
	}

	hasChanged() {
		if (this.getSavedHash() === null) {
			return true;
		}

		var p = new Poe.FileFormat.PoeDocumentPrivate(this);
		var hash = new Poe.FileFormat.Hash();
		hash.setData(p.serialize());
		if (this.getSavedHash() !== hash.getHash()) {
			return true;
		}

		return false;
	}

	show() {
		super.show();
		if (this._caret)
			this._caret.show();
	}

	getNodeAtPoint(x, y) {

	}

	getNodeClosestToPoint(x, y) {
		var page, paragraph, line, word, char, range;
		var bContains;
		var i;
		var found = false;
		for (i = 0; i < this.elm.childNodes.length; i++) {
			page = this.elm.childNodes[i];
			bContains = $posInsideNode(x, y, page);
			if (bContains & Poe.Contains.VERTICAL) {
				found = true;
				break;
			}
		}

		if (!found) {
			return null;
		}
		found = false;

		var firstParagraph = page.childNodes[0];
		if ($posAboveNode(y, firstParagraph)) {
			let firstLine = firstParagraph.childNodes[0];
			let firstWord = firstLine.childNodes[0];
			let firstChar = firstWord.childNodes[0];

			if (firstChar === this._caret.elm) {
				return this._caret.nextSibling;
			}

			return firstChar;
		}

		var lastParagraph = page.childNodes[page.childNodes.length - 1];
		if ($posBelowNode(y, lastParagraph)) {
			let lastLine = lastParagraph.childNodes[lastParagraph.childNodes.length - 1];
			let lastWord = lastLine.childNodes[lastLine.childNodes.length - 1];
			let lastChar = lastWord.childNodes[lastWord.childNodes.length - 1];

			if (lastChar === this._caret.elm) {
				return this._caret.previousSibling;
			}

			return lastChar;
		}

		for (i = 0; i < page.childNodes.length; i++) {
			paragraph = page.childNodes[i];
			bContains = $posInsideNode(x, y, paragraph);
			if (bContains & Poe.Contains.VERTICAL) {
				found = true;
				break;
			}
		}

		if (!found) {
			return null;
		}
		found = false;

		for (i = 0; i < paragraph.childNodes.length; i++) {
			line = paragraph.childNodes[i];
			bContains = $posInsideNode(x, y, line);
			if (bContains & Poe.Contains.VERTICAL) {
				found = true;
				break;
			}
		}

		if (!found) {
			return null;
		}
		found = false;

		/*
			Here we check to see if the click was before the first word
			on the line or after the last word of the line. If so select
			the first or last character in the line respectively.
		*/
		var firstChild = line.childNodes[0];
		var lastChild = line.childNodes[line.childNodes.length - 1];
		var rect = firstChild.getBoundingClientRect();
		if (x < rect.left) {
			if (firstChild.childNodes[0]) {
				if (firstChild.childNodes[0] === this._caret.elm) {
					return this._caret.nextSibling;
				}
				return firstChild.childNodes[0];
			}
		}
		rect = lastChild.getBoundingClientRect();
		if (x > rect.right) {
			let wordChildren = lastChild.childNodes;
			let wordLastChild = wordChildren[wordChildren.length - 1];
			if (wordLastChild === this._caret.elm) {
				return this._caret.previousSibling;
			}
			return wordLastChild;
		}

		/*
			If it made it this far the click was actually within the
			complete bounds of the line (including words available in line).
			Keep searching down the tree in words and characters.
		*/
		for (i = 0; i < line.childNodes.length; i++) {
			word = line.childNodes[i];
			bContains = $posInsideNode(x, y, word);
			if (bContains === Poe.Contains.BOTH) {
				found = true;
				break;
			}
		}

		if (!found) {
			return null;
		}
		found = false;

		rect = null;
		for (i = 0; i < word.childNodes.length; i++) {
			char = word.childNodes[i];
			rect = $getBoundingClientRect(char);
			if (rect.left <= x && rect.right >= x) {
				if (rect.top <= y && rect.bottom >= y) {
					found = true;
					break;
				}
			}
		}

		if (!found) {
			return null;
		}

		return char;
	}

	findNodeContainingPointInTree(node, x, y, deep, acceptedContains) {
		var currentNode = node;
		var bContains = null;
		var bAcceptedContains = false;
		var tmpChildNode = null;
		for (var d = 0; d < deep; d++) {
			for(var i = 0; i < currentNode.childNodes.length; i++) {
				tmpChildNode = currentNode.childNodes[i];
				bContains = $posInsideNode(x, y, tmpChildNode);
				for (var e = 0; e < acceptedContains.length; e++) {
					if (bContains === acceptedContains[e]) {
						bAcceptedContains = true;
						break;
					}
				}

				if (!bAcceptedContains) {
					return currentNode;
				}
				bAcceptedContains = true;
				currentNode = tmpChildNode;
			}
		}

		return (currentNode === node ? null : currentNode);
	}

	remove() {
		super.remove();
		this._caret.remove();
		this.inputHandler.remove();
		this._buffer.remove();
		this.inputHandler.remove();
		this.textLayout = null;
		app.doc = null;
		window.app.elm.removeEventListener(this._scrollEventListener);
	}

	reset() {
		this.elm.innerHTML = "";
		this._init();
	}

	focus() {
		app.doc.inputHandler.focus();
		app.doc.getCaret().show();
	}


	/**************************************************************************
	 * PRIVATE FUNCTIONS                                                      *
	 **************************************************************************/
	 _init(opts) {
		opts = opts || {};
		if (opts.createElements !== false)
		{
			var page = Poe.ElementGenerator.createPage();
			var paragraph = Poe.ElementGenerator.createParagraph();
			var line = Poe.ElementGenerator.createLine();
			var word = Poe.ElementGenerator.createWord();

			/*
				The text node is so the caret has something
			to base it's positions off of when it gets inserted
			into the DOM.
			*/
			$append(word, line);
			$append(line, paragraph);
			$append(paragraph, page);
			this.append(page, this.elm);
		}

		 this._buffer = new Poe.TextBuffer();
		 if (opts.bufferInit) {
			opts.bufferInit(this, this._buffer);
		 }
		 Poe.EventManager.addEventListener(this._buffer, 'changed', function() {
			self.emit('changed');
		 });

		 this._caret = new Poe.Caret();
		 this._caret.setBuffer(this._buffer);
		 this.inputHandler.setCaret(this._caret);
		 this.textLayout = new Poe.TextLayout(this);

		 Poe.EventManager.addEventListener(window, 'scroll', this.focus);

		 /*
		 	Compute initial hash
		 */
		 var hash = new Poe.FileFormat.Hash();
		 var pdp = new Poe.FileFormat.PoeDocumentPrivate(this);
		 hash.setData(pdp.serialize());
		 this.setSavedHash(hash.getHash());
	 }

	 _stylePage(page) {
		 $css(page, 'height', $pxStr(this._pageSize.h));
		 $css(page, 'width', $pxStr(this._pageSize.w));
		 $css(page, 'padding-left', $pxStr($inchToPx(this._margins.left)));
		 $css(page, 'padding-right', $pxStr($inchToPx(this._margins.right)));
		 $css(page, 'padding-top', $pxStr($inchToPx(this._margins.top)));
		 $css(page, 'padding-bottom', $pxStr($inchToPx(this._margins.bottom)));
	 }
}

Document.PageSize = {
	Letter: {
		w: $inchToPx(8.5),
		h: $inchToPx(11)
	},

	Legal: {
		w: $inchToPx(8.5),
		h: $inchToPx(14)
	},

	Ledger: {
		w: $inchToPx(17),
		h: $inchToPx(11)
	},

	Tabloid: {
		w: $inchToPx(11),
		h: $inchToPx(17)
	}
};

Poe.Document = Document;
})(window.Poe);
