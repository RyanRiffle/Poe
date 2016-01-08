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
		$css(child, 'height', $pxStr(this._pageSize.h));
		$css(child, 'width', $pxStr(this._pageSize.w));
		super.append(child);
	}

	prepend(child) {
		$css(child, 'height', $pxStr(this._pageSize.h));
		$css(child, 'width', $pxStr(this._pageSize.w));
		super.prepend(child);
	}

	/**************************************************************************
	 * PRIVATE FUNCTIONS                                                      *
	 **************************************************************************/
	 _init() {
		 var page = Poe.ElementGenerator.createPage();
		 var paragraph = Poe.ElementGenerator.createParagraph();
		 var line = Poe.ElementGenerator.createLine();
		 var word = Poe.ElementGenerator.createWord();

		 $append(word, line);
		 $append(line, paragraph);
		 $append(paragraph, page);
		 this.append(page, this.elm);
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
