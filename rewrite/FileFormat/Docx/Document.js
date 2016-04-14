(function(Poe, Docx) {
'use strict';

class Document {
	constructor() {
		this._document = document.implementation.createDocument('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:document', null).childNodes[0];
		this._document.innerHTML = txt.replace(/w:/g, '');
		this._document.body = this._document.childNodes[0];
	}

	parse() {
		var self = this;
		setTimeout(function() {
			var time = Date.now();
			var body = self._document.body;
			for (var i = 0; i < body.childNodes.length; i++) {
				var node = body.childNodes[i];

				if (node.tagName === 'p') {
					self._parsePargraph(node, (i === body.childNodes.length - 1 ? true : false));
				}
			}

			console.log(Date.now() - time);
			app.doc.caret.moveBeginning();
		}, 10);
	}

	_parsePargraph(node, isLast) {
		var child;
		for (var i = 0; i < node.childNodes.length; i++) {
			child = node.childNodes[i];

			if (child.tagName === 'pPr') {
				//Paragraph wide formatting
				let prChild;
				for (var x = 0; x < child.childNodes.length; x++) {
					prChild = child.childNodes[x];
					if (prChild.tagName === 'ind') {
						var indentAmount = Docx.sizeToPxCount(prChild.getAttribute('firstLine'));
						var pstyle = Poe.TextFormat.ParagraphStyle.getStyle(app.doc.caret);
						pstyle.setIndent(indentAmount);
						pstyle.applyStyle(app.doc.caret);
					}
				}
				continue;
			}

			if (child.tagName === 'rPr') {
				//Run paragraph wide formatting
				continue;
			}

			if (child.tagName === 'r') {
				this._parseRun(child);
			}
		}

		if (!isLast) {
			var oldPgraph = app.doc.caret.currentWord.parentNode.parentNode;
			var pgraph = Poe.ElementGenerator.createParagraph();
			var line = Poe.ElementGenerator.createLine();
			var word = Poe.ElementGenerator.createWord();
			pgraph.appendChild(line);
			line.appendChild(word);
			word.appendChild(app.doc.caret.elm);

			$insertAfter(pgraph, oldPgraph);
		}
	}

	_parseRun(node) {
		var child;
		var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);
		for (var i = 0; i < node.childNodes.length; i++) {
			child = node.childNodes[i];

			if (child.tagName === 'rPr') {
				var prChild;
				for (var x = 0; x < child.childNodes.length; x++) {
					prChild = child.childNodes[x];

					if (prChild.tagName === 'rFonts') {
						textStyle.setFont(prChild.getAttribute('ascii'));
						textStyle.applyStyle(app.doc.caret);
						continue;
					}

					if (prChild.tagName === 'b') {
						var isBold = (prChild.getAttribute('val') === 'true' ? true : false);
						textStyle.setBold(isBold);
						continue;
					}

					if (prChild.tagName === 'i') {
						var isItalic = (prChild.getAttribute('val') === 'true' ? true: false);
						textStyle.setItalic(isItalic);
						continue;
					}

					if (prChild.tagName === 'u') {
						var isUnderline = (prChild.getAttribute('val') === 'true' ? true : false);
						textStyle.setUnderline(isUnderline);
						continue;
					}
				}
				continue;
			}

			if (child.tagName === 't') {
				var txtNode = child.childNodes[0];
				for (var si = 0; si < txtNode.textContent.length; si++) {
					var char = txtNode.textContent.charAt(si);
					if (char === ' ') {
						app.doc.caret.insertNode(document.createTextNode(String.fromCharCode(160)));
						var word = Poe.ElementGenerator.createWord();
						$insertAfter(word, app.doc.caret.currentWord);
						$append(app.doc.caret.elm, word);
						textStyle.applyStyleToWord(word);
						continue;
					}
					app.doc.caret.insertNode(document.createTextNode(txtNode.textContent.charAt(si)));
				}
			}
		}
	}
}

Docx.Document = Document;
})(window.Poe, window.Poe.FileFormat.Docx);
