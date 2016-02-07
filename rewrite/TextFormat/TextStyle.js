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
		marker = marker || app.doc.getCaret();
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
			while ((tmpChar2 = tmpChar.nextSibling)) {
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
			while ((tmpChar2 = tmpChar.previousSibling)) {
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
		if (start === null) {
			throw new Error('Start is null. It should be the cursor...');
		}
		var startWord = start.parentNode;
		var tmpWord = Poe.ElementGenerator.createWord();
		var tmpChar = start;
		var tmpChar2;
		while((tmpChar2 = tmpChar.nextSibling)) {
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

	setSuperscript(bool) {
		return this.setDecoration(TextStyle.Decoration.SUPERSCRIPT, bool);
	}

	setSubscript(bool) {
		return this.setDecoration(TextStyle.Decoration.SUBSCRIPT, bool);
	}

	setFontSize(pt) {
		this._fontSize = pt;
	}

	getFontSize() {
		return Math.floor(this._fontSize);
	}

	getFont() {
		return this._fontFace;
	}

	setFont(f) {
		this._fontFace = f;
		return this;
	}

	isBold() {
		return this._decoration & TextStyle.Decoration.BOLD;
	}

	isItalic() {
		return this._decoration & TextStyle.Decoration.ITALIC;
	}

	isUnderline() {
		return this._decoration & TextStyle.Decoration.UNDERLINE;
	}

	isStrike() {
		return this._decoration & TextStyle.Decoration.STRIKE;
	}

	isSubscript() {
		return this._decoration & TextStyle.Decoration.SUBSCRIPT;
	}

	isSuperscript() {
		return this._decoration & TextStyle.Decoration.SUPERSCRIPT;
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
			$removeClass(word, 'sub');
			$removeClass(word, 'sup');
		} else {
			if (this._decoration & TextStyle.Decoration.BOLD) {
				$addClass(word, 'b');
			}

			if (this._decoration & TextStyle.Decoration.ITALIC) {
				$addClass(word, 'i');
			}

			if (this._decoration & TextStyle.Decoration.UNDERLINE) {
				$addClass(word, 'u');
			}

			if (this._decoration & TextStyle.Decoration.STRIKE) {
				$addClass(word, 's');
			}

			if (this._decoration & TextStyle.Decoration.SUBSCRIPT) {
				$addClass(word, 'sub');
			}

			if (this._decoration & TextStyle.Decoration.SUPERSCRIPT) {
				$addClass(word, sub);
			}
		}

		word.style['font-family'] = this._fontFace;
		word.style['font-size'] = $ptToPxStr(this._fontSize);
		word.style['min-height'] = $ptToPxStr(this._fontSize);
	}
}

TextStyle.getStyle = function(caret) {
	caret = caret || app.doc.getCaret();
	var node = caret.elm;
	node = node.parentNode;

	return TextStyle.getStyleOfWord(node);
};

TextStyle.getStyleOfWord = function(word) {
		var s = new TextStyle();

		if ($hasClass(word, 'b')) {
			s.setBold(true);
		}

		if ($hasClass(word, 'i')) {
			s.setItalic(true);
		}

		if ($hasClass(word, 'u')) {
			s.setUnderline(true);
		}

		if ($hasClass(word, 's')) {
			s.setStrike(true);
		}

		if ($hasClass(word, 'sub')) {
			s.setSubscript(true);
		}

		if ($hasClass(word, 'sup')) {
			s.setSuperscript(true);
		}

		s.setFont(window.getComputedStyle(word).getPropertyValue('font-family').replace(/\'/g, ''));
		var sizeInPx = parseFloat(window.getComputedStyle(word).getPropertyValue('font-size').replace('px', ''));
		var sizeInPt = (Math.fround(sizeInPx * 0.75));
		s.setFontSize(sizeInPt);

		return s;
};

TextStyle.Decoration = {
	NONE: 0x0,
	BOLD: 0x1,
	ITALIC: 0x2,
	UNDERLINE: 0x4,
	STRIKE: 0x8,
	SUPERSCRIPT: 0x10,
	SUBSCRIPT: 0x20
};

TextFormat.TextStyle = TextStyle;
})(window.Poe.TextFormat);
