(function(Poe) {
'use strict';

class Clipboard extends Poe.EventHandler {
	constructor() {
		super(['changed']);
		this._data = [];
	}

	setData(d) {
		this._data = d;
		this.emit('changed');
	}

	getData() {
		return this._data;
	}

	copySelection() {
		var self = this;
		app.doc.caret.splitStartNode();
		app.doc.caret.splitEndNode();
		app.doc.caret.forEachSelectedWord(function(word) {
			self._data.push(word.cloneNode(true));
		});
		this.emit('changed');
	}

	hasData() {
		return (this._data.length !== 0);
	}

	pasteSelection() {
		if (app.doc.caret.hasSelection) {
			app.doc.caret.splitStartNode();
			app.doc.caret.splitEndNode();
			app.doc.caret.remove();
		}
	}
}

Poe.Clipboard = new Clipboard();
})(window.Poe);
