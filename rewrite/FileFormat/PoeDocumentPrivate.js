(function(Poe, FileFormat) {
'use strict';

var self;
class PoeDocumentPrivate {
	constructor(doc) {
		this._doc = doc;
		this._data = null;
		self = this;
	}

	serialize() {
		return this._doc.elm.innerHTML;
	}

	deserialize(data) {
		this._doc.remove();
		this._data = data;
		this._doc = new Poe.Document({
			createElements: false,
			bufferInit: this._initBuffer
		});
	}

	_initBuffer(doc, buffer) {
		doc.elm.innerHTML = self._data;
		var caret = document.querySelector('.caret');
		if (caret) {
			caret.remove();
		}
		var i, n, node, tmp;
		var words = document.querySelectorAll('.word');
		for (i = 0; i < words.length; i++) {
			for (n = 0; n < words[i].childNodes.length; n++) {
				node = words[i].childNodes[n];
				while(node.textContent.length > 1) {
					tmp = document.createTextNode(node.textContent[0]);
					$insertBefore(tmp, node);
					node.textContent = node.textContent.slice(1, node.textContent.length);
				}
			}
		}

		for (i = 0; i < words.length; i++) {
			for(n = 0; n < words[i].childNodes.length; n++) {
				if (words[i].childNodes[n].nodeType === 3) {
					buffer.append(words[i].childNodes[n]);
				}
			}
		}

		app.setDocument(doc);
	}
}

FileFormat.PoeDocumentPrivate = PoeDocumentPrivate;
})(window.Poe, window.Poe.FileFormat);
