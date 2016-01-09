(function(Poe) {
'use strict';

class TextLayout {
	constructor() {
		this.document = null;
	}

	setDocument(document) {
		this.document = document;
		this.document.buffer.on('changed', this.relayout);
		this.relayout();
	}

	relayout() {
		var paragraph = this.document.caret.currentWord.parentNode.parentNode;
		var line = null;
		var word = null;
		var wordRect = word.getBoundingClientRect();
		var lineRect = line.getBoundingClientRect();

		var indexOfLine = line.parentNode.indexOf(line);

		for(var i = indexOfLine; i < line.parentNode.childNodes.length; i++) {
			line = paragraph.childNodes[i];
			word = line.childNodes[line.childNodes.length - 1];
		}
	}
}

Poe.TextLayout = TextLayout;
})(window.Poe);
