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

	openFile(fileName) {
		this._doOpen({
			file: fileName
		});
	}

	saveFile(opts) {
		this._doSave(opts);
	}

	_doSave(opts) {
		var filePath = opts.file || null;
		if (!filePath) {
			filePath = Dialog.showSaveDialog({
				properties: ['saveFile'],
				filters: [
					{name: 'Poe Documents', extensions: ['pml']}
				]
			});
		}
		var self = this;
		fs.writeFile(filePath, opts.data, function(err) {
			if (err) {
				console.log(err);
				return;
			}

			self._saveComplete(filePath, opts.data);
			new Notification('Poe', {
				body: 'Save complete!'
			});
		});
	}

	_doOpen(opts) {
		var filePath = opts.file || null;
		if (!filePath) {
			filePath = Dialog.showOpenDialog({
				properties: ['openFile'],
				filters: [
					{name: 'Poe Documents', extensions: ['pml']},
					{name: 'All Files', extensions: ['*']}
				]
			});
			filePath = filePath[0];
		}

		var self = this;
		fs.readFile(filePath, function(err, data) {
			if (err) {
				console.log(err);
			}

			var p = new Poe.FileFormat.PoeDocumentPrivate(app.doc);
			p.deserialize(data);
			self._saveComplete(filePath, data);
		});
	}
}

FileFormat.FileFormat = ElectronFile;
})(window.Poe, window.Poe.FileFormat, require('fs'), require('remote').dialog, require('zlib'));
