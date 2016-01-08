(function(Poe) {
'use strict';

class TextBufferMarker {
	constructor() {
		this.buffer = null;
	}

	setBuffer(buf) {
		this.buffer = buf;
	}

	insertBefore(it) {
		var myIndex = this.buffer.indexOf(this);
		this.buffer.insertAt(it, myIndex);
	}

	insertAfter(it) {
		var myIndex = this.buffer.indexOf(this);
		this.buffer.insertAt(it, myIndex + 1);
	}

	moveLeft() {
		var myIndex = this.buffer.indexOf(this);
		this.buffer.splice(myIndex, 1);
		this.buffer.splice(myIndex - 1, 0, this);
	}

	moveRight() {
		var myIndex = this.buffer.indexOf(this);
		this.buffer.splice(myIndex, 1);
		this.buffer.splice(myIndex + 1, 0, this);
	}

	moveBeginning() {
		var myIndex = this.buffer.indexOf(this);
		this.buffer.splice(myIndex, 1);
		this.buffer.splice(0, 0, this);
	}

	moveEnd() {
		var myIndex = this.buffer.indexOf(this);
		this.buffer.splice(myIndex, 1);
		this.buffer.splice(this.buffer.length, 0, this);
	}
}

Poe.TextBufferMarker = TextBufferMarker;
})(window.Poe);
