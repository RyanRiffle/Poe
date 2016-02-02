(function(Poe, FileFormatNS) {
'use strict';

class FileFormat {
	constructor() {

	}

	save(doc) {
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

	saveFile(fileName) {

	}

	_doSave(opts) {

	}

	_doOpen(opts) {

	}
}

FileFormatNS.FileFormatBase = FileFormat;
})(window.Poe, window.Poe.FileFormat = {});
