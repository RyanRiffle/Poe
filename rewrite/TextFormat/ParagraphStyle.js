(function(TextFormat) {
'use strict';

class ParagraphStyle {
	constructor() {
		this._indent = 0;
	}

	applyStyle(marker) {
		var pgraph = marker.currentWord.parentNode.parentNode;
		var firstLine = pgraph.childNodes[0];
		firstLine.style['padding-left'] = $pxStr(this._indent);
	}

	setIndent(amount) {
		this._indent = amount;
	}
}

ParagraphStyle.getStyle = function(marker) {
	var style = new ParagraphStyle();
	var pgraph = marker.currentWord.parentNode.parentNode;
	var firstLine = pgraph.childNodes[0];
	style._indent = firstLine.style['padding-left'].replace('px', '');
	return style;
};

TextFormat.ParagraphStyle = ParagraphStyle;
})(window.Poe.TextFormat);
