(function(Poe) {
'use strict';

class CaretManager extends Poe.Object {
	constructor() {
		super();
		this._carets = [];
		this._document = null;
	}

	setDocument(doc) {
		this._document = doc;
	}

	createCaret() {
		var caret = new Poe.Caret();
		caret.setBuffer(this._document.getBuffer());
		this._carets.push(caret);

	}

	remove() {
		this._forEachCaret(function(c) {
			c.remove();
		});
	}

	moveLeft() {
		this._forEachCaret(function(c) {
			c.moveLeft();
		});
	}

	moveRight() {
		this._forEachCaret(function(c) {
			c.moveRight();
		});
	}

	moveToStartOfLine() {
		this._forEachCaret(function(c) {
			c.moveToStartOfLine();
		});
	}

	moveToEndOfLine() {
		this._forEachCaret(function(c) {
			c.moveToEndOfLine();
		});
	}

	moveBeginning() {
		this._forEachCaret(function(c) {
			c.moveBeginning();
		});
	}

	moveEnd() {
		this._forEachCaret(function(c) {
			c.moveEnd();
		});
	}

	show() {
		this._forEachCaret(function(c) {
			c.show();
		});
	}

	hide() {
		this._forEachCaret(function(c) {
			c.hide();
		});
	}

	insertBefore(it) {
		this._forEachCaret(function(c) {
			c.insertBefore(it);
		});
	}

	insertAfter(it) {
		this._forEachCaret(function(c) {
			c.insertAfter(it);
		});
	}

	insertNode(c) {
		this._forEachCaret(function(c) {
			c.insertNode(c);
		});
	}

	removePreviousSibling() {
		this._forEachCaret(function(c) {
			c.removePreviousSibling();
		});
	}

	removeNextSibling() {
		this._forEachCaret(function(c) {
			c.removeNextSibling();
		});
	}

	moveBefore(node) {
		this._forEachCaret(function(c) {
			c.moveBefore(node);
		});
	}

	moveAfter(node) {
		this._forEachCaret(function(c) {
			c.moveAfter(node);
		});
	}

	/**************************************************************************
	 * PRIVATE FUNCTIONS                                                      *
	 **************************************************************************/
	_forEachCaret(fn) {
		for (var i = 0; i < this._carets.length; i++) {
			fn(this._carets[i]);
		}
	}
}
})(window.Poe);
