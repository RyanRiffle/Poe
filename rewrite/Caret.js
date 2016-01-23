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
		super.setBuffer(buf);
		this.buffer.on('changed', this._evtBufferChanged);
		window.addEventHandler
		if (this.buffer.length != 0)
			this.moveBeginning();
		else
			this.buffer.append(this);
		this.show();
	}

	moveLeft() {
		this._stopBlink();
		super.moveLeft();
		this._evtBufferChanged();
		this._startBlink();
		this.emit('moved');
	}

	moveRight() {
		this._stopBlink();
		super.moveRight();
		this._evtBufferChanged();
		this._startBlink();
		this.emit('moved');
	}

	moveBeginning() {
		this._stopBlink();
		super.moveBeginning();
		$insertBefore(this.elm, this.buffer.at(0));
		this._evtBufferChanged();
		this._startBlink();
		this.emit('moved');
	}

	moveEnd() {
		super.moveEnd();
		this._evtBufferChanged();
		this.emit('moved');
	}

	show() {
		if (!self.hasSelection) {
			$show(self.visibleElm);
			self._evtBufferChanged();
			if (self._blinkInterval === null)
				self._blinkInterval = setInterval(self._blink, 400);
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
		$css(this.visibleElm, 'height', $pxStr(rect.height));
		$css(this.visibleElm, 'top', $pxStr(rect.top));
		$css(this.visibleElm, 'left', $pxStr(rect.left));
	}

	_updateDomNode() {
		if (this.elm.parentNode && this.elm.parentNode.childNodes.length === 1) {
			return;
		}

		if (this.nextSibling) {
			$insertBefore(this.elm, this.nextSibling);
		} else if (this.previousSibling) {
			$insertAfter(this.elm, this.previousSibling);
		} else {
			$append(this.elm, document.querySelector('.word'));
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
