(function(Poe) {
'use strict';

var self;

class Caret extends Poe.TextBufferMarker {
	constructor() {
		super();
		self = this;
		this.elm = document.createElement('span');
		this.elm.appendChild(document.createTextNode(String.fromCharCode(8203)));
		$addClass(this.elm, 'caret');

		this._blinkInterval = null;
		this._blinkStartTimer = null;
		this.visibleElm = document.createElement('div');
		$addClass(this.visibleElm, 'visible-caret');
		$append(this.visibleElm, document.body);
		this.clearSelection();
	}

	setBuffer(buf) {
		if (buf === null) {
			this.elm.remove();
			this._stopBlink();
			return;
		}

		super.setBuffer(buf);
		this.buffer.on('changed', this._evtBufferChanged);
		if (this.buffer.length !== 0)
			this.moveBeginning();
		else
			this.buffer.append(this);
		this.show();
		this.emit('moved');
	}

	moveLeft() {
		if (!this.previousSibling) {
			return;
		}
		this._stopBlink();
		$insertBefore(this.elm, this.previousSibling);
		super.moveLeft();
		this._evtBufferChanged();
		this._startBlink();
		this.emit('moved');
	}

	moveRight() {
		if (!this.nextSibling) {
			return;
		}

		this._stopBlink();
		$insertAfter(this.elm, this.nextSibling);
		super.moveRight();
		this._evtBufferChanged();
		this._startBlink();
		this.emit('moved');
	}

	moveBeginning() {
		this._stopBlink();
		super.moveBeginning();
		$insertBefore(this.elm, this.buffer.at(1));
		this._evtBufferChanged();
		this._startBlink();
		this.emit('moved');
	}

	moveEnd() {
		super.moveEnd();
		$insertAfter(this.elm, this.previousSibling);
		this.show();
		this.emit('moved');
	}

	show() {
		if (!self.hasSelection) {
			$show(self.visibleElm);
			if (self._blinkInterval === null)
				self._blinkInterval = setInterval(self._blink, 400);
			self._evtBufferChanged();
		}
	}

	hide() {
		clearInterval(this._blinkInterval);
		this._blinkInterval = null;
		$hide(this.visibleElm);
	}

	insertBefore(it) {
		super.insertBefore(it);
		$insertBefore(this.elm, (it.elm ? it.elm : it));
		this.buffer.setDirty();
	}

	insertAfter(it) {
		super.insertAfter(it);
		$insertAfter(this.elm, (it.elm ? it.elm : it));
		this.buffer.setDirty();
	}

	insertNode(c) {
		this._stopBlink();
		var myIndex = this.buffer.indexOf(this);
		this.buffer.splice(myIndex, 0, c);
		$insertBefore(c, this.elm);
		this.buffer.setDirty();
		this._startBlink();
	}

	removePreviousSibling() {
		this._stopBlink();
		var prev = this.buffer.indexOf(this) - 1;
		if (this.buffer.at(prev)) {
			this.buffer.at(prev).remove();
			this.buffer.splice(prev, 1);
		}
		this.buffer.setDirty();
		this._startBlink();
		this.emit('moved');
		return prev;
	}

	removeNextSibling() {
		this._stopBlink();
		var next = this.buffer.indexOf(this) + 1;
		if (this.buffer.at(next)) {
			this.buffer.at(next).remove();
			this.buffer.splice(next, 1);
		}
		this.buffer.setDirty();
		this._startBlink();
		this.emit('moved');
		return next;
	}

	moveBefore(node) {
		var nodeIndex = this.buffer.indexOf(node);
		$insertBefore(this.elm, node);
		this.moveTo(nodeIndex);
	}

	moveAfter(node) {
		var nodeIndex = this.buffer.indexOf(node);
		$insertAfter(this.elm, node);
		this.moveTo(nodeIndex + 1);
	}

	get currentWord() {
		return this.elm.parentNode;
	}

	get currentLine() {
		return this.currentWord.parentNode;
	}

	get currentParagraph() {
		return this.currentLine.parentNode;
	}

	/**************************************************************************
	 * PRIVATE FUNCTIONS                                                      *
	 **************************************************************************/
	_evtBufferChanged() {
		self._updateDomNode();
		self._updateGeometry();
	}

	_updateGeometry() {
		var rect = $getBoundingClientRect(this.elm);
		if (rect.top < $getBoundingClientRect(app.elm).top) {
			this.hide();
			return;
		}

		$css(this.visibleElm, 'height', $pxStr(rect.height));
		$css(this.visibleElm, 'top', $pxStr(rect.top));
		$css(this.visibleElm, 'left', $pxStr(rect.left));
	}

	_updateDomNode() {
		if (!this.elm.parentNode) {
			$prepend(this.elm, document.querySelector('.word'));
		}
	}

	_blink() {
		if ($hasClass(self.visibleElm, 'hidden')) {
			$show(self.visibleElm);
		} else {
			$hide(self.visibleElm);
		}
	}

	_startBlink() {
		clearTimeout(this._blinkStartTimer);
		setTimeout(function() {
			self.show.apply(self);
		}, 500);
	}

	_stopBlink() {
		clearInterval(self._blinkInterval);
		self._blinkInterval = null;
		$show(self.visibleElm);
	}
}

Poe.Caret = Caret;
})(window.Poe);
