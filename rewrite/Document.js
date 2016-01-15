(function(Poe) {
'use strict';

class Document extends Poe.DomElement {
	constructor() {
		super('div');
		$addClass(this.elm, 'document');
		$append(this.elm, document.body);
		this.setPageSizeIn(Poe.Document.PageSize.Letter);
		this.setPageMarginsIn({
			top: 1,
			bottom: 1,
			left: 1,
			right: 1
		});

		this.buffer = null;
		this.inputHandler = new Poe.InputHandler();
		this._init();
	}

	setPageSizeIn(size) {
		var page = null;
		for (var i = 0; i < this.childNodes.length; i++) {
			page = this.childNodes[i];
			$css(page, 'height', size.h.toString());
			$css(page, 'width', size.w.toString());
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

	show() {
		super.show();
		this.caret.show();
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
			let firstWord = firstLine.childNodes[0]
			let firstChar = firstWord.childNodes[0];

			if (firstChar === this.caret.elm) {
				return this.caret.nextSibling;
			}

			return firstChar;
		}

		var lastParagraph = page.childNodes[page.childNodes.length - 1];
		if ($posBelowNode(y, lastParagraph)) {
			let lastLine = lastParagraph.childNodes[lastParagraph.childNodes.length - 1];
			let lastWord = lastLine.childNodes[lastLine.childNodes.length - 1];
			let lastChar = lastWord.childNodes[lastWord.childNodes.length - 1];

			if (lastChar === this.caret.elm) {
				return this.caret.previousSibling;
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
				if (firstChild.childNodes[0] === this.caret.elm) {
					return this.caret.nextSibling;
				}
				return firstChild.childNodes[0];
			}
		}
		rect = lastChild.getBoundingClientRect();
		if (x > rect.right) {
			let wordChildren = lastChild.childNodes;
			let wordLastChild = wordChildren[wordChildren.length - 1];
			if (wordLastChild === this.caret.elm) {
				return this.caret.previousSibling;
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

		var rect = null;
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



	/**************************************************************************
	 * PRIVATE FUNCTIONS                                                      *
	 **************************************************************************/
	 _init() {
		 var page = Poe.ElementGenerator.createPage();
		 var paragraph = Poe.ElementGenerator.createParagraph();
		 var line = Poe.ElementGenerator.createLine();
		 var word = Poe.ElementGenerator.createWord();

		 /*
		 	The text node is so the caret has something
			to base it's positions off of when it gets inserted
			into the DOM.
		 */
		 var textNode = document.createTextNode(String.fromCharCode(8203));
		 $append(textNode, word);
		 $append(word, line);
		 $append(line, paragraph);
		 $append(paragraph, page);
		 this.append(page, this.elm);

		 this.buffer = new Poe.TextBuffer();
		 this.caret = new Poe.Caret();
		 this.caret.setBuffer(this.buffer);
		 this.inputHandler.setCaret(this.caret);
		 this.textLayout = new Poe.TextLayout(this);

		 window.app.elm.addEventListener('scroll', this.caret.show);
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
