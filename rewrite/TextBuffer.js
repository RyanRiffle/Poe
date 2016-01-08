(function(Poe) {
'use strict';

class TextBuffer extends Poe.EventHandler {
	constructor() {
		super(['changed', 'markerRemoved', 'markerInserted']);
		this.buf = [];
	}

	insertAt(ins, at) {
		this.buf.splice(at, 0, ins);
	}

	indexOf(it) {
		return this.buf.indexOf(it);
	}

	at(ind) {
		return this.buf[ind];
	}

	get length() {
		return this.buf.length;
	}
}

Poe.TextBuffer = TextBuffer;
})(window.Poe);
