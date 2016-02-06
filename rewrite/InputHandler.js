(function(Poe) {
'use strict';

var self = null;

class InputHandler extends Poe.DomElement {
	constructor() {
		super('textarea', ['click', 'mousedown', 'mousemove']);
		this.addClass('user-input');
		$prepend(this.elm, document.body);
		this.show();
		this._hasSelection = false;
		this._caret = null;

		//Div to put selection elements in for housekeeping
		this._selectBox = document.createElement('div');
		$addClass(this._selectBox, 'select-box');
		$hide(this._selectBox);
		$append(this._selectBox, document.body);

		self = this;
		Poe.EventManager.addEventListener(this, 'input', this.onInput);
		Poe.EventManager.addEventListener(this, 'keydown', this.onKeyDown);
		Poe.EventManager.addEventListener(app, 'mousedown', this.onMouseDown);
		Poe.EventManager.addEventListener(app, 'mouseup', this.onMouseUp);
		Poe.EventManager.addEventListener(window, 'mouseleave', this.onMouseUp);
		this.focus();
	}

	/*
		@param {Poe.Caret} caret The caret that this InputHandler will use for managing input.
	*/
	setCaret(caret) {
		this._caret = caret;
		this.textBuffer = caret.buffer;
		this.elm.addEventListener('focus', function() {
			if (self._caret)
				self._caret.show();
		});

		this.elm.addEventListener('blur', function() {
			if(self._caret)
				self._caret.hide();
		});

		self._caret.emit('moved');
	}

	remove() {
		super.remove();
	}

	onInput(event) {
		var c = self.elm.value;
		self.elm.value = '';

		var tNode = document.createTextNode(c);

		if (!self._caret) {
			console.log('The InputHandler has no caret assigned!');
			return;
		}

		self._caret.insertNode(tNode);
	}

	onKeyDown(event) {
		var textStyle;
		if (Poe.ShortcutManager.doShortcut({event: event})) {
			return;
		}

		if (event.ctrlKey || event.metaKey) {
			switch(event.keyCode) {
				case Poe.Keysym.Down:
					event.preventDefault();
					self._caret.moveEnd();
					break;

				case Poe.Keysym.Up:
					event.preventDefault();
					self._caret.moveBeginning();
					break;

				case Poe.Keysym.Right:
					event.preventDefault();
					self._caret.moveToEndOfLine();
					break;

				case Poe.Keysym.Left:
					event.preventDefault();
					self._caret.moveToStartOfLine();
					break;
			}
			return;
		}

		var caretRect;
		var caretPos;
		switch(event.keyCode) {
			case Poe.Keysym.Backspace:
				if (self._caret.hasSelection) {
					self._deleteSelection();
					break;
				}
				self._caret.removePreviousSibling();
				event.preventDefault();
				break;

			case Poe.Keysym.Delete:
				if (self.hasSelection) {
					self._deleteSelection();
					break;
				}
				self._caret.removeNextSibling();
				event.preventDefault();
				break;

			case Poe.Keysym.Left:
				/*
					FIXME: Shift + Left and Shift + Right does not work.
				*/
				if (event.shiftKey) {
					self._caret.expandSelectLeft();
					self._makeSelection();
					self._caret.moveBefore(self._caret.getStartNode());
					break;
				}

				if (self.hasSelection) {
					self._caret.moveBefore(self._caret.getStartNode());
					self._clearSelection();
					self._caret.show();
					break;
				}

				self._caret.moveLeft();
				event.preventDefault();
				break;

			case Poe.Keysym.Right:
				if (event.shiftKey) {
					self._caret.expandSelectRight();
					self._makeSelection();
					self._caret.moveAfter(self._caret.getEndNode());
					break;
				}

				if (self.hasSelection) {
					self._caret.moveAfter(self._caret.getEndNode());
					self._clearSelection();
					self._caret.show();
					break;
				}

				self._caret.moveRight();
				break;

			case Poe.Keysym.Up:
				caretRect = $getBoundingClientRect(self._caret.elm);
				caretPos = {
					x: caretRect.left,
					y: caretRect.top - 5
				};
				self._caret.moveAfter(app.doc.getNodeClosestToPoint(caretPos.x, caretPos.y));
				break;

			case Poe.Keysym.Down:
				caretRect = $getBoundingClientRect(self._caret.elm);
				caretPos = {
					x: caretRect.left,
					y: caretRect.bottom + 5
				};
				self._caret.moveBefore(app.doc.getNodeClosestToPoint(caretPos.x, caretPos.y));
				break;

			case Poe.Keysym.Space:
				event.preventDefault();
				let activeStyle = Poe.TextFormat.TextStyle.getStyle();
				self._caret.insertNode(document.createTextNode(String.fromCharCode(160)));
				var word = Poe.ElementGenerator.createWord();
				$insertAfter(word, self._caret.elm.parentNode);
				/*
					If there are letters after the cursor in the
					current word, move them to the new word as well.
				*/
				if (self._caret.nextSibling) {
					let caretParent = self._caret.elm.parentNode;
					let siblingIndex = self._caret.buffer.indexOf(self._caret.nextSibling);
					let node;
					while ((node = self._caret.buffer.at(siblingIndex)) && node.parentNode === caretParent) {
						$append(node, word);
						siblingIndex += 1;
					}
				}

				$prepend(self._caret.elm, word);
				self._caret.show();
				activeStyle.applyStyleToWord(word);
				break;

			case Poe.Keysym.Enter:
				textStyle = Poe.TextFormat.TextStyle.getStyle(self._caret);
				console.log(self._caret.currentLine.childNodes.length);
				if (self._caret.currentLine.childNodes.length === 1) {
					let tNode = document.createTextNode(String.fromCharCode(8203));
					self._caret.insertBefore(tNode);
					self._caret.currentLine.style['min-height'] = '12px';
				}
				var npg = Poe.ElementGenerator.createParagraph();
				var cpg = self._caret.elm.parentNode.parentNode.parentNode;

				var nl = Poe.ElementGenerator.createLine();
				var nw = Poe.ElementGenerator.createWord();
				$insertAfter(npg, cpg);
				$append(nl, npg);
				$append(nw, nl);
				$append(self._caret.elm, nw);
				textStyle.applyStyleToWord(nw);
				break;
		}
		self._caret.show();
	}

	onMouseDown(event) {
		if (self._mouseDownPos) {
			return;
		}

		self._caret.clearSelection();
		self._clearSelection();
		self._mouseDownPos = {
			x: event.clientX,
			y: event.clientY
		};

		self._baseNode = app.doc.getNodeClosestToPoint(event.clientX, event.clientY);
		self._caret.setStartNode(self._baseNode);
		self.emit('mousedown', [self._baseNode]);
		self._registerMouseMoveEvent(true);
	}

	onMouseMove(event) {
		if (event.clientX == self._mouseDownPos.x && event.clientY == self._mouseDownPos.y)
			return;

		var node = app.doc.getNodeClosestToPoint(event.clientX, event.clientY);

		if (node === self._caret.getEndNode() || node === self._baseNode) {
			return;
		}

		if (node === null) {
			return;
		}

		self._caret.select(self._baseNode, node);
		self._makeSelection();
		self.emit('mousemove', [node]);
	}

	onMouseUp(event) {
		self.elm.focus();
		var node = app.doc.getNodeClosestToPoint(event.clientX, event.clientY);
		if (event.clientX === self._mouseDownPos.x && event.clientY === self._mouseDownPos.y && node) {
			if (self.hasSelection) {
				self.setHasSelection(false);
				return;
			}

			if (app.doc.buffer.indexOf(node) === app.doc.buffer.length - 1) {
				self._caret.moveAfter(node);
			} else {
				self._caret.moveBefore(node);
			}
			self._caret.show();
			self._mouseDownPos = null;
			self.emit('click', [node]);
		}
		self._registerMouseMoveEvent(false);
	}

	setHasSelection(value) {
		if (value) {
			this._caret.hide();
		} else {
			this._caret.show();
			this._clearSelection();
		}
	}

	get hasSelection() {
		return this._caret._hasSelection;
	}

	/**************************************************************************
 	* PRIVATE FUNCTIONS                                                      *
 	**************************************************************************/
	_selectElement(elm) {
		var rect = elm.getBoundingClientRect();
		this._createSelection(rect.left, rect.top, rect.width, rect.height);
		$addClass(elm, 'selected');
	}

	_createSelection(x, y, w, h) {
		var sb = document.createElement('div');
		$addClass(sb, 'select-box');
		sb.style.left = $pxStr(x);
		sb.style.top = $pxStr(y);
		sb.style.width = $pxStr(w);
		sb.style.height = $pxStr(h);
		$append(sb, document.body);
		$show(sb);
	}

	_clearSelection() {
		var selects = document.querySelectorAll('.select-box');
		for (var i = 0; i < selects.length; i++) {
			selects[i].remove();
		}

		var selectedElms = document.querySelectorAll('.selected');
		for (i = 0; i < selectedElms.length; i++) {
			$removeClass(selectedElms[i], 'selected');
		}
	}

	 _deleteSelection() {
		if (!this._caret.hasSelection) {
			return false;
		}

		this._caret.moveBefore(this._caret.getStartNode());

		var startI = this.textBuffer.indexOf(this._caret.getStartNode());
		var endI = this.textBuffer.indexOf(this._caret.getEndNode());
		var node;

		while ((node = this.textBuffer.removeAt(startI))) {
			if (node === this._caret.elm) {
				startI += 1;
				continue;
			}

			if (node === this._caret.getEndNode()) {
				node.remove();
				break;
			}

			node.remove();
		}

		this.textBuffer.setDirty();
		this._caret.clearSelection();
		this._clearSelection();
		this._caret._startBlink();
	}

	_makeSelection() {
		self._clearSelection();
		self._caret.hide();
		var currentLine = self._caret.getStartNode().parentNode.parentNode;
		var startX = $getBoundingClientRect(self._caret.getStartNode()).left;
		var lineRect = $getBoundingClientRect(currentLine);
		var endX;
		/*
			If the mideNode is on the same line as the startNode
			just create a selection around that line.
		*/
		if (currentLine.contains(self._caret.getEndNode())) {
			endX = $getBoundingClientRect(self._caret.getEndNode()).right - startX;
			self._createSelection(startX, lineRect.top, endX, lineRect.height);
			$addClass(currentLine, 'selected');
			return;
		}

		self._createSelection(startX, lineRect.top, lineRect.right - startX, lineRect.height);
		$addClass(currentLine, 'selected');
		var endIndex = self.textBuffer.indexOf(self._caret.getEndNode());
		var startIndex = self.textBuffer.indexOf(self._caret.getStartNode());
		var n;
		while (currentLine === self._caret.getStartNode().parentNode.parentNode) {
			n = self.textBuffer.at(startIndex);
			if (n.parentNode.parentNode !== currentLine) {
				currentLine = n.parentNode.parentNode;
				break;
			}
			startIndex += 1;
		}

		for (var i = startIndex; i <= endIndex; i++) {
			if ((n = self.textBuffer.at(i).parentNode.parentNode) !== currentLine) {
				currentLine = n;
			}

			if (!currentLine.contains(self._caret.getEndNode())) {
				if (!$hasClass(currentLine, 'selected')) {
					let lastWord = currentLine.childNodes[currentLine.childNodes.length - 1];
					lineRect = $getBoundingClientRect(currentLine);
					endX = $getBoundingClientRect(lastWord).right - lineRect.left;
					self._createSelection(lineRect.left, lineRect.top, endX, lineRect.height);
					$addClass(currentLine, 'selected');
				}
			} else {
				break;
			}
		}

		lineRect = $getBoundingClientRect(currentLine);
		endX = $getBoundingClientRect(self._caret.getEndNode()).right - lineRect.left;
		self._createSelection(lineRect.left, lineRect.top, endX, lineRect.height);
		$addClass(currentLine, 'selected');
	}

	_registerMouseMoveEvent(bool) {
		if (bool){
			Poe.EventManager.addEventListener(app, 'mousemove', self.onMouseMove);
		} else {
			self._mouseDownPos = null;
			Poe.EventManager.removeEventListener('mousemove', self.onMouseMove);
		}
	}
}

Poe.InputHandler = InputHandler;
})(window.Poe);
