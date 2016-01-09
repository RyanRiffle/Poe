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
