(function(Poe, FileFormat) {
'use strict';

class PoeDocument {
	constructor(doc) {
		this._doc = doc;
	}

	serialize() {
		return this._doc.elm.innerHTML;
	}

	deserialize(data) {
		this._doc.remove();
		this._doc = new Poe.Document({
			init: false
		});
		this._doc.elm.innerHTML = data;
		this._initBuffer();
		this._doc._init({
			createElements: false
		});
	}

	_initBuffer() {
		var words = document.querySelectorAll('.word');
		for (let i = 0; i < words.length; i++) {
			for(let n = 0; n < words[i].childNodes.length; n++) {
				if (words[i].childNodes[n].nodeType === 3)
					this._doc.buffer.insertAt(0, words[i].childNodes[n]);
			}
		}
	}
}

FileFormat.PoeDocument = PoeDocument;
})(window.Poe, window.Poe.FileFormat);
