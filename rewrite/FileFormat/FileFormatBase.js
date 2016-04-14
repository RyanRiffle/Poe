(function(Poe, FileFormatNS) {
'use strict';

class FileFormat {
	constructor() {
		this._doc = null;
	}

	save(doc) {
		this._doc = doc;
		console.log('Saving document');
	}

	open(data) {
		console.log('Opening document');
	}

	openUrl(url) {
		console.log('Opening document: ' + url);
	}

	openFile(fileName) {

	}

	saveFile(fileName, doc) {
		this._doc = doc;
	}

	_doSave(opts) {

	}

	_doOpen(opts) {

	}

	_saveComplete(filePath, data) {
		this._doc.setFilePath(filePath);
		var hash = new Poe.FileFormat.Hash();
		hash.setData(data);
		this._doc.setSavedHash(hash.getHash());
	}
}

FileFormatNS.FileFormatBase = FileFormat;
})(window.Poe, window.Poe.FileFormat = {});
