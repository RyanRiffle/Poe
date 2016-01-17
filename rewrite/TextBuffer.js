(function(Poe) {
'use strict';

class TextBuffer extends Poe.EventHandler {
	constructor() {
		super(['changed', 'markerRemoved', 'markerInserted']);
		this.buf = [];
	}

	append(ins) {
		this.buf.push(ins);
	}

	insertAt(ins, at) {
		this.buf.splice(at, 0, ins);
	}

	indexOf(it) {
		return this.buf.indexOf(it);
	}

	splice(i, rmCnt, it) {
		this.buf.splice(i, rmCnt, it);
		if (rmCnt === 1 && it === undefined)
		this.buf.splice(i, rmCnt);
	}

	removeAt(ind) {
		var it = this.at(ind);
		var removed = this.buf.splice(ind, 1);
		for(var i = 0; i < removed.length; i++) {
			if (typeof removed[i] === 'TextBufferMarker') {

			}
		}
		return it;
	}

	at(ind) {
		return this.buf[ind];
	}

	setDirty() {
		this.emit('changed');
	}

	get length() {
		return this.buf.length;
	}
}

Poe.TextBuffer = TextBuffer;
})(window.Poe);
