(function(Poe, FileFormat, fs, Dialog, zlib) {
'use strict';

/*
	TODO: Create a notification system wrapper.
	Probably use electron's built in notification for
	the desktop version and a home made one for the web.
	The wrapper should use the correct one just like this
	FileFormat stuff does.
*/
class ElectronFile extends FileFormat.FileFormatBase {
	constructor() {
		super();
	}

	openFile() {
		this._doOpen();
	}

	_doSave(opts) {
		var filePath = Dialog.showSaveDialog({
			properties: ['saveFile'],
			filters: [
				{name: 'Poe Documents', extensions: ['pml']}
			]
		});

		fs.writeFile(filePath, opts.data, function(err) {
			if (err) {
				console.log(err);
				return;
			}
			alert('Saved Successfully!');
		});
	}

	_doOpen(opts) {
		var filePath = Dialog.showOpenDialog({
			properties: ['openFile'],
			filters: [
				{name: 'Poe Documents', extensions: ['pml']},
				{name: 'All Files', extensions: ['*']}
			]
		});

		fs.readFile(filePath[0], function(err, data) {
			if (err) {
				console.log(err);
			}

			var p = new Poe.FileFormat.PoeDocumentPrivate(app.doc);
			p.deserialize(data);
		});
	}
}

FileFormat.FileFormat = ElectronFile;
})(window.Poe, window.Poe.FileFormat, require('fs'), require('remote').dialog, require('zlib'));
