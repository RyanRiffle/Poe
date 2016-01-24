(function(FileFormat, Poe) {
'use strict';

class Pml extends FileFormat.FileFormat {
	constructor() {
		super();
	}

	save(doc) {
		super.save(doc);
		var d = new Poe.FileFormat.PoeDocumentPrivate(doc);
		var data = d.serialize();
		this._doSave({
			name: 'Untitled',
			data: data
		});
	}

	open(data) {
		super.open(data);
		if (!data) {
			this.openFile();
		}
	}

	openUrl(dataUrl) {
		super.open(dataUrl);
	}

	saveFile(fileName) {
		var d = new Poe.FileFormat.PoeDocumentPrivate(app.doc);
		var data = d.serialize();
		super.saveFile({
			file: fileName,
			name: 'Untitled',
			data: data
		});
	}
}
FileFormat.Pml = Pml;
})(window.Poe.FileFormat, window.Poe);
