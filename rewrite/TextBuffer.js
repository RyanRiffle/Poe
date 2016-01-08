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
}

Poe.TextBuffer = TextBuffer;
})(window.Poe);
