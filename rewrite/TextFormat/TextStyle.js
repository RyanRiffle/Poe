(function(TextFormat) {
'use strict';

class TextStyle {
	constructor() {
		this._fontSize = 12;
		this._fontColor = 'black';
		this._fontFace = 'Open Sans';
		this._decoration = TextStyle.Decoration.NONE;
	}

	/*
		Apply the style to a marker.

		This works by moving the caret.getStartNode() and all remaining
		textNodes within the same word into a new word. This word will
		be put after the origional containing word. Then moving all text
		nodes from the word containing caret.getEndNode() up to that end
		node into a new word. That word will be placed before the initail
		containing word. Then styling each word (span) with the correct
		inline styles.

		This does not change the order of the Poe.TextBuffer in any way
		so it does not need access to the buffer.
	*/
	applyStyle(marker) {
		if (marker.hasSelection) {
			this.applyStyleToSelection(marker);
		} else {
			this.applyStyleImmediate(marker);
		}
	}

	applyStyleToSelection(marker) {
		var start = marker.getStartNode();
		var end = marker.getEndNode();
		var startWord = start.parentNode;
		var endWord = end.parentNode;
		var tmpWord = null;
		var tmpChar = null;
		var tmpChar2 = null;
		var i;

		/*
			If the starting textNode is not the first
			node of that word, a new word must be
			created.
		*/
		if (start !== startWord.childNodes[0]) {
			tmpWord = Poe.ElementGenerator.createWord();
			tmpChar = start;
			while (tmpChar2 = tmpChar.nextSibling) {
				$append(tmpChar, tmpWord);
				tmpChar = tmpChar2;
			}
			$append(tmpChar, tmpWord);
			$insertAfter(tmpWord, startWord);
			startWord = tmpWord;
		}

		if (end !== endWord.childNodes[endWord.childNodes.length - 1]) {
			tmpWord = Poe.ElementGenerator.createWord();
			tmpChar = end;
			while (tmpChar2 = tmpChar.previousSibling) {
				$prepend(tmpChar, tmpWord);
				tmpChar = tmpChar2;
			}
			$prepend(tmpChar, tmpWord); // Get that first character of last word
			$insertBefore(tmpWord, endWord);
			endWord = tmpWord;
		}

		var self = this;
		marker.forEachSelectedWord(function(word) {
			self.applyStyleToWord(word);
		});
		marker.show();
	}

	applyStyleImmediate(marker) {
		var start = marker.getStartNode();
		var startWord = start.parentNode;
		var tmpWord = Poe.ElementGenerator.createWord();
		var tmpChar = start;
		var tmpChar2;
		while(tmpChar2 = tmpChar.nextSibling) {
			$append(tmpChar, tmpWord);
			tmpChar = tmpChar2;
		}
		$append(tmpChar, tmpWord);
		$insertAfter(tmpWord, startWord);
		this.applyStyleToWord(tmpWord);
	}

	addDecoration(decoration) {
		this.setDecoration(decoration, true);
	}

	removeDecoration(decoration) {
		this.setDecoration(decoration, false);
	}

	setBold(bool) {
		return this.setDecoration(TextStyle.Decoration.BOLD, bool);
	}

	setItalic(bool) {
		return this.setDecoration(TextStyle.Decoration.ITALIC, bool);
	}

	setUnderline(bool) {
		return this.setDecoration(TextStyle.Decoration.UNDERLINE, bool);
	}

	setStrike(bool) {
		return this.setDecoration(TextStyle.Decoration.STRIKE, bool);
	}

	setDecoration(dec, on) {
		if (on) {
			this._decoration |= dec;
		} else {
			this._decoration &= ~(dec);
		}

		return this;
	}

	clearStyle() {
		this._decoration = TextStyle.Decoration.NONE;
	}

	applyStyleToWord(word) {
		if (this._decoration === TextStyle.Decoration.NONE) {
			$removeClass(word, 'b');
			$removeClass(word, 'i');
			$removeClass(word, 'u');
			$removeClass(word, 's');
			return;
		}

		if (this._decoration & TextStyle.Decoration.BOLD) {
			$addClass(word, 'b');
		}

		if (this._decoration & TextStyle.Decoration.ITALIC) {
			$addClass(word, 'i');
		}

		if (this._decoration & TextStyle.Decoration.UNDERLINE) {``
			$addClass(word, 'u');
		}

		if (this._decoration & TextStyle.Decoration.STRIKE) {
			$addClass(word, 's');
		}
	}
}

TextStyle.getStyle = function(caret) {
	var s = new TextStyle();
	var node = caret.getBaseNode();
	node = node.parentNode;

	if ($hasClass(node, 'b')) {
		s.setBold(true);
	}

	if ($hasClass(node, 'i')) {
		s.setItalic(true);
	}

	if ($hasClass(node, 'u')) {
		s.setUnderline(true);
	}

	if ($hasClass(node, 's')) {
		s.setStrike(true);
	}

	return s;
}

TextStyle.Decoration = {
	NONE: 0x0,
	BOLD: 0x1,
	ITALIC: 0x2,
	UNDERLINE: 0x4,
	STRIKE: 0x8
};

TextFormat.TextStyle = TextStyle;
})(window.Poe.TextFormat);
