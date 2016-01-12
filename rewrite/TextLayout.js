(function(Poe) {
'use strict';

var self;

class TextLayout {
	constructor(document) {
		this.document = document;
		this.document.buffer.on('changed', this.relayout);
		self = this;
	}

	relayout() {
		var paragraph = self.document.caret.currentWord.parentNode.parentNode;
		var wordRect, lineRect, line, word;
		var i;
		for (i = 0; i < paragraph.childNodes.length; i++) {
			if (paragraph.childNodes[i] === self.document.caret.elm.parentNode.parentNode) {
				break;
			}
		}

		var indexOfLine = i;

		for(i = indexOfLine; i < paragraph.childNodes.length; i++) {
			line = paragraph.childNodes[i];
			if (line.childNodes.length === 0) {
				line.remove();
			}

			word = line.childNodes[line.childNodes.length - 1];
			wordRect = word.getBoundingClientRect();
			lineRect = line.getBoundingClientRect();

			while(wordRect.right > lineRect.right) {
				if (!line.nextSibling) {
					var nl = Poe.ElementGenerator.createLine();
					$insertAfter(nl, line);
				}

				$prepend(word, line.nextSibling);
				word = word.previousSibling;
				if (!word) {
					break;
				}
			}
		}

		/*
			Check for the inverse. If the line above has room to fit words
			from the line below, move them up a line.
		*/
		if (paragraph.childNodes.length > 1)
		{
			let prevLineWord = null;
			let prevLineWordRect = null;
			for (i = paragraph.childNodes.length - 1; i >= 0; i--) {
				line = paragraph.childNodes[i];

				if (!line.previousSibling) {
					break;
				}

				word = line.childNodes[0];
				prevLineWord = line.previousSibling.childNodes[line.previousSibling.childNodes.length - 1];
				wordRect = word.getBoundingClientRect();
				prevLineWordRect = prevLineWord.getBoundingClientRect();
				lineRect = line.previousSibling.getBoundingClientRect();
				console.log((wordRect.width + prevLineWordRect.right) + ' < ' + lineRect.right);
				while (wordRect.width + prevLineWordRect.right < lineRect.right) {
					$append(word, line.previousSibling);

					if (line.childNodes.length > 0) {
						prevLineWord = word;
						word = line.childNodes[0];
						wordRect = word.getBoundingClientRect();
						prevLineWordRect = prevLineWord.getBoundingClientRect();
					} else {
						break;
					}
				}
			}
		}

		var page = paragraph.parentNode;
		for(i = 0; i < page.childNodes.length; i++) {
			if (page.childNodes[i] === paragraph) {
				break;
			}
		}
		var indexOfPgraph = i;
		var pageRect = page.getBoundingClientRect();
		var pgraphRect;
		for (i = page.childNodes.length - 1; i >= indexOfPgraph ; i--) {
			paragraph = page.childNodes[i];
			pgraphRect = paragraph.getBoundingClientRect();

			while (pgraphRect.bottom > page.bottom) {
				if (!page.nextSibling) {
					var np = Poe.ElementGenerator.createPage();
					$insertAfter(np, page);
				}

				$prepend(paragraph, page.nextSibling);
			}
		}

		self.document.caret.show();
	}
}

Poe.TextLayout = TextLayout;
})(window.Poe);
