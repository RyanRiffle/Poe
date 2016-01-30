(function(TextFormat) {
'use strict';

class ParagraphStyle {
	constructor() {
		this._indent = 0;
		this._textAlign = 'left';
	}

	applyStyle(marker) {
		var pgraph = marker.currentWord.parentNode.parentNode;
		var firstLine = pgraph.childNodes[0];
		firstLine.style['padding-left'] = $pxStr(this._indent);
		pgraph.style['text-align'] = this._textAlign;
	}

	setIndent(amount) {
		this._indent = amount;
	}

	setTextAlign(val) {
		if (val !== 'left' && val !== 'center' && val !== 'right') {
			throw new Error('Can\'t setTextAlign('+val+')');
		}
		this._textAlign = val;
	}
}

ParagraphStyle.getStyle = function(marker) {
	marker = marker || app.doc.caret;
	var style = new ParagraphStyle();
	var pgraph = marker.currentWord.parentNode.parentNode;
	var firstLine = pgraph.childNodes[0];
	style._indent = firstLine.style['padding-left'].replace('px', '');
	return style;
};

TextFormat.ParagraphStyle = ParagraphStyle;
})(window.Poe.TextFormat);
