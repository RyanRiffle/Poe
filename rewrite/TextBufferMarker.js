(function(Poe) {
'use strict';

class TextBufferMarker {
	constructor() {
		this.buffer = null;
		this._selection = {
			start: null,
			end: null,
			base: null
		};
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

	setStartNode(node) {
		this._selection.start = node;
	}

	setEndNode(node) {
		this._selection.end = node;
	}

	setBaseNode(node) {
		this._selection.base = node;
	}

	select(startNode, endNode) {
		this.setBaseNode(startNode);
		if($isNodeBeforeNode(endNode, startNode)) {
			this.setStartNode(endNode);
			this.setEndNode(startNode);
		} else {
			this.setStartNode(startNode);
			this.setEndNode(endNode);
		}
	}

	getStartNode() {
		return this._selection.start;
	}

	getEndNode() {
		return this._selection.end;
	}

	getBaseNode() {
		return this._selection.base;
	}

	clearSelection() {
		this.setStartNode(this.elm);
		this.setEndNode(this.elm);
		this.setBaseNode(this.elm);
	}

	forEachSelectedWord(fn) {
		var startI = this.buffer.indexOf(this._selection.start);
		var endI = this.buffer.indexOf(this._selection.end);
		var word = null;

		for (var i = startI; i < endI; i++) {
			if (this.buffer.at(i).parentNode === word) {
				continue;
			}

			word = this.buffer.at(i).parentNode;
			fn(word);
		}
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

	get hasSelection() {
		return (this._selection.base !== this._selection.end);
	}

	_setNode(node) {
		this.setStartNode(node);
		this.setEndNode(node);
	}
}

Poe.TextBufferMarker = TextBufferMarker;
})(window.Poe);
