(function(Poe) {
'use strict';

class TextBufferMarker extends Poe.EventHandler{
	/*
		TODO: TextBufferMarker should have a element in the DOM like a Caret
	*/
	constructor() {
		super(['moved']);
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
		this.emit('moved');
		return myIndex;
	}

	insertAfter(it) {
		var myIndex = this.buffer.indexOf(this);
		this.buffer.splice(myIndex + 1, 0, it);
		this.emit('moved');
		return myIndex + 1;
	}

	moveLeft() {
		var myIndex = this.remove();
		this.buffer.splice(myIndex - 1, 0, this);
		this.emit('moved');
		return myIndex - 1;
	}

	moveRight() {
		var myIndex = this.remove();
		this.buffer.splice(myIndex+1, 0, this);
		this.emit('moved');
		return myIndex + 1;
	}

	moveBeginning() {
		var myIndex = this.remove();
		this.buffer.splice(0, 0, this);
		this.emit('moved');
	}

	moveEnd() {
		var myIndex = this.remove();
		this.buffer.splice(this.buffer.length, 0, this);
		this.emit('moved');
	}

	moveTo(index) {
		this.remove();
		this.buffer.splice(index, 0, this);
		this.emit('moved');
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

	expandSelectLeft() {
		var sindex = this.buffer.indexOf(this._selection.start);
		if (!this.hasSelection) {
			this._selection.end = this.previousSibling;
			this._selection.base = this.buffer.at(sindex);
		}

		if (sindex !== 0) {
			sindex -= 2;
		}

		this._selection.start = this.buffer.at(sindex);
	}

	expandSelectRight() {
		var eindex = this.buffer.indexOf(this._selection.end);
		if (eindex !== this.buffer.length - 1) {
			eindex += 2;
		}

		this._selection.end = this.buffer.at(eindex);
	}

	getStartNode() {
		if (!this.hasSelection) {
			return this.elm;
		}

		return this._selection.start;
	}

	getEndNode() {
		if (!this.hasSelection) {
			return this.elm;
		}
		return this._selection.end;
	}

	getBaseNode() {
		if (!this.hasSelection) {
			return this.elm;
		}
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

	deleteSelection() {
		if (!this.hasSelection) {
			return;
		}

		this.insertBefore(this.getStartNode());
		var i = this.buffer.indexOf(this.getStartNode());
		while (this.buffer[i] !== this.getEndNode()) {
			this.buffer.removeAt(i);
		}
		this.removeAt(i);
		return this;
	}

	splitWordAtMarker(marker) {
		marker = (marker.elm ? marker.elm : marker);
		var word = marker.parentNode;
		var newWord = Poe.ElementGenerator.createWord();

		while (marker.nextSibling) {
			newWord.appendChild(marker.nextSibling);
		}
		newWord.insertBefore(marker, newWord.childNodes[0]);
		$insertAfter(newWord, word);
	}

	splitStartNode() {
		this.splitWordAtMarker(this.getStartNode());
	}

	splitEndNode() {
		this.splitWordAtMarker(this.getEndNode());
	}

	_setNode(node) {
		this.setStartNode(node);
		this.setEndNode(node);
	}
}

Poe.TextBufferMarker = TextBufferMarker;
})(window.Poe);
