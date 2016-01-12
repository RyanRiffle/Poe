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
		this.buffer.splice(myIndex, 0, it);
		return myIndex;
	}

	insertAfter(it) {
		var myIndex = this.buffer.indexOf(this);
		this.buffer.splice(myIndex + 1, 0, it);
		return myIndex + 1;
	}

	moveLeft() {
		var myIndex = this.remove();
		this.buffer.splice(myIndex - 1, 0, this);
		return myIndex - 1;
	}

	moveRight() {
		var myIndex = this.remove();
		this.buffer.splice(myIndex + 1, 0, this);

		return myIndex + 1;
	}

	moveBeginning() {
		var myIndex = this.remove();
		this.buffer.splice(1, 0, this);
	}

	moveEnd() {
		var myIndex = this.remove();
		this.buffer.splice(this.buffer.length, 0, this);
	}

	moveTo(index) {
		this.remove();
		this.buffer.splice(index, 0, this);
	}

	remove() {
		var myIndex = this.buffer.indexOf(this);
		if (myIndex != -1)
			this.buffer.splice(myIndex, 1);
		return myIndex;
	}

	get nextSibling() {
		var myIndex = this.buffer.indexOf(this);
		if (myIndex != this.buffer.length - 1) {
			return this.buffer.at(myIndex + 1);
		}

		return null;
	}

	get previousSibling() {
		var myIndex = this.buffer.indexOf(this);
		if (myIndex > 0) {
			return this.buffer.at(myIndex - 1);
		}

		return null;
	}
}

Poe.TextBufferMarker = TextBufferMarker;
})(window.Poe);
