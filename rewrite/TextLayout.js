(function(Poe) {
'use strict';

var self;

class TextLayout extends Poe.Object {
	constructor(document) {
		super();
		this.document = document;
		Poe.EventManager.addEventListener(this.document, 'changed', this.relayout);
		self = this;
		this._isDisabled = false;
	}

	remove() {
		this.document.buffer.removeEventListener('changed', this.relayout);
	}

	setDisabled(isDisabled) {
		this._isDisabled = isDisabled;
	}

	relayout() {
		if (self._isDisabled) {
			return false;
		}

		var paragraph = self.document.caret.currentParagraph;
		var wordRect, lineRect, line, word;
		var i;
		for (i = 0; i < paragraph.childNodes.length; i++) {
			if (paragraph.childNodes[i] === self.document.caret.currentLine) {
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
		var pageBottom = pageRect.bottom - parseInt(page.style['padding-bottom']);
		var pgraphRect;
		for (i = page.childNodes.length - 1; i >= indexOfPgraph ; i--) {
			paragraph = page.childNodes[i];
			pgraphRect = paragraph.getBoundingClientRect();

			while (pgraphRect.bottom > pageBottom) {
				if (!page.nextSibling) {
					var np = Poe.ElementGenerator.createPage();
					$insertAfter(np, page);
					app.doc._stylePage(np);
				}

				var tmp = paragraph.previousSibling;
				if (tmp) {
					pgraphRect = tmp.getBoundingClientRect();
				}
				$prepend(paragraph, page.nextSibling);
				paragraph = tmp;
				if (!tmp) {
					break;
				}
			}
		}

		self.document.caret.show();
		return true;
	}
}

Poe.TextLayout = TextLayout;
})(window.Poe);
