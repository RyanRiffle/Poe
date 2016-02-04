(function(Poe, FileFormat) {
'use strict';

if (true) {
	return;
}

class WebFile extends FileFormat.FileFormatBase {
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
		var socket = io(Poe.config.backend);
		socket.on('connect', function() {
			socket.emit('mkDownload', {data: opts.data, name: 'Untitled.pml'});

			socket.on('mkDownload', function(data) {
				window.open(data.url, '_blank');
			});
		});
	}

	_doOpen(opts) {
		var filePath = opts.file || null;

		fs.readFile(filePath, function(err, data) {
			if (err) {
				console.log(err);
			}

			var p = new Poe.FileFormat.PoeDocumentPrivate(app.doc);
			p.deserialize(data);
		});
	}
}

FileFormat.FileFormat = WebFile;
})(window.Poe, window.Poe.FileFormat);
