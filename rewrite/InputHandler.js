(function(Poe) {
'use strict';

var self = null;

class InputHandler extends Poe.DomElement {
	constructor() {
		super('textarea', ['click', 'mousedown', 'mousemove']);
		$addClass(this.elm, 'user-input');
		$prepend(this.elm, document.body);
		this.show();

		this.caret = null;

		self = this;
		this.elm.addEventListener('input', this.onInput);
		this.elm.addEventListener('keydown', this.onKeyDown);
		app.elm.addEventListener('mousedown', this.onMouseDown);
		app.elm.addEventListener('mouseup', this.onMouseUp);
		app.elm.addEventListener('mousemove', this.onMouseMove);
		this.elm.focus();
		this._selection = document.createRange();
		this._selectBox = document.createElement('div');
		$addClass(this._selectBox, 'select-box');
		$hide(this._selectBox);
		$append(this._selectBox, document.body);
		this._hasSelection = false;
		this._lastKey = null;
	}

	setCaret(caret) {
		this.caret = caret;
		this.textBuffer = caret.buffer;
		this.elm.addEventListener('focus', function() {
			self.caret.show();
		});
		this.elm.addEventListener('blur', function() {
			self.caret.hide();
		});
	}

	onInput(event) {
		var c = self.elm.value;
		self.elm.value = '';

		var tNode = document.createTextNode(c);

		if (!self.caret) {
			console.log('The InputHandler has no caret assigned!');
			return;
		}

		self.caret.insertNode(tNode);
		self._lastKey = null;
	}

	onKeyDown(event) {
		var textStyle;
		if (event.ctrlKey || self._lastKey === 91) {
			switch(event.keyCode) {
				case Poe.Keysym.B:
					textStyle = Poe.TextFormat.TextStyle.getStyle(self.caret);
					textStyle.setBold(!textStyle.isBold());
					textStyle.applyStyle(self.caret);
					self.caret.emit('moved');
					self._lastKey = null;
					event.preventDefault();
					break;

				case Poe.Keysym.I:
					textStyle = Poe.TextFormat.TextStyle.getStyle(self.caret);
					textStyle.setItalic(!textStyle.isItalic());
					textStyle.applyStyle(self.caret);
					self.caret.emit('moved');
					self._lastKey = null;
					event.preventDefault();
					break;

				case Poe.Keysym.U:
					textStyle = Poe.TextFormat.TextStyle.getStyle(self.caret);
					textStyle.setUnderline(!textStyle.isUnderline());
					textStyle.applyStyle(self.caret);
					self.caret.emit('moved');
					self._lastKey = null;
					event.preventDefault();
					break;

				case Poe.Keysym.C:
					Poe.Clipboard.copySelection();
					break;

				case Poe.Keysym.V:
					Poe.Clipboard.pasteSelection(app.doc.caret);
					break;

				case Poe.Keysym.S:
					event.preventDefault();
					break;
			}
			return;
		}

		self._lastKey = event.keyCode;
		switch(event.keyCode) {
			case Poe.Keysym.Backspace:
				if (self.caret.hasSelection) {
					self._deleteSelection();
					break;
				}
				self.caret.removePreviousSibling();
				event.preventDefault();
				break;

			case Poe.Keysym.Delete:
				if (self.hasSelection) {
					self._deleteSelection();
					break;
				}
				self.caret.removeNextSibling();
				event.preventDefault();
				break;

			case Poe.Keysym.Left:
				if (self.hasSelection) {
					self.caret.moveBefore(self.caret.getStartNode());
					self._clearSelection();
					self.caret.show();
					break;
				}

				self.caret.moveLeft();
				event.preventDefault();
				break;

			case Poe.Keysym.Right:
				if (self.hasSelection) {
					self.caret.moveAfter(self.caret.getEndNode());
					self._clearSelection();
					self.caret.show();
					break;
				}

				self.caret.moveRight();
				break;

			case Poe.Keysym.Space:
				event.preventDefault();
				let activeStyle = Poe.TextFormat.TextStyle.getStyle(self.caret);
				self.caret.insertNode(document.createTextNode(String.fromCharCode(160)));
				var word = Poe.ElementGenerator.createWord();
				$insertAfter(word, self.caret.elm.parentNode);

				/*
					If there are letters after the cursor in the
					current word, move them to the new word as well.
				*/
				if (self.caret.nextSibling) {
					let caretParent = self.caret.elm.parentNode;
					let siblingIndex = self.caret.buffer.indexOf(self.caret.nextSibling);
					let node;
					while ((node = self.caret.buffer.at(siblingIndex)) && node.parentNode === caretParent) {
						$append(node, word);
						siblingIndex += 1;
					}
				}

				$append(self.caret.elm, word);
				activeStyle.applyStyleToWord(word);
				break;

			case Poe.Keysym.Enter:
				textStyle = Poe.TextFormat.TextStyle.getStyle(self.caret);
				console.log(self.caret.currentLine.childNodes.length);
				if (self.caret.currentLine.childNodes.length === 1) {
					self.caret.currentLine.style['min-height'] = textStyle.getFontSize();
				}
				var npg = Poe.ElementGenerator.createParagraph();
				var cpg = self.caret.elm.parentNode.parentNode.parentNode;

				var nl = Poe.ElementGenerator.createLine();
				var nw = Poe.ElementGenerator.createWord();
				$insertAfter(npg, cpg);
				$append(nl, npg);
				$append(nw, nl);
				$append(self.caret.elm, nw);
				textStyle.applyStyleToWord(nw);
				break;
		}
	}

	onMouseDown(event) {
		if (self._mouseDownPos) {
			return;
		}

		self.caret.clearSelection();
		self._clearSelection();
		self._mouseDownPos = {
			x: event.clientX,
			y: event.clientY
		};

		self._baseNode = app.doc.getNodeClosestToPoint(event.clientX, event.clientY);
		self.caret.setStartNode(self._baseNode);
		self.emit('mousedown', [self._baseNode]);
	}

	onMouseMove(event) {
		if (!self._mouseDownPos) {
			return;
		}

		if (event.clientX == self._mouseDownPos.x && event.clientY == self._mouseDownPos.y)
			return;

		var node = app.doc.getNodeClosestToPoint(event.clientX, event.clientY);

		if (node === self.caret.getEndNode() || node === self._baseNode) {
			return;
		}

		if (node === null) {
			return;
		}

		self.caret.select(self._baseNode, node);
		self._clearSelection();

		var currentLine = self.caret.getStartNode().parentNode.parentNode;
		var startX = $getBoundingClientRect(self.caret.getStartNode()).left;
		var lineRect = $getBoundingClientRect(currentLine);
		var endX;
		/*
			If the mideNode is on the same line as the startNode
			just create a selection around that line.
		*/
		if (currentLine.contains(self.caret.getEndNode())) {
			endX = $getBoundingClientRect(self.caret.getEndNode()).right - startX;
			self._createSelection(startX, lineRect.top, endX, lineRect.height);
			$addClass(currentLine, 'selected');
			return;
		}

		self._createSelection(startX, lineRect.top, lineRect.right - startX, lineRect.height);
		$addClass(currentLine, 'selected');
		var endIndex = self.textBuffer.indexOf(self.caret.getEndNode());
		var startIndex = self.textBuffer.indexOf(self.caret.getStartNode());
		var n;
		while (currentLine === self.caret.getStartNode().parentNode.parentNode) {
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

			if (!currentLine.contains(self.caret.getEndNode())) {
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
		endX = $getBoundingClientRect(self.caret.getEndNode()).right - lineRect.left;
		self._createSelection(lineRect.left, lineRect.top, endX, lineRect.height);
		$addClass(currentLine, 'selected');
		self.emit('mousemove', [node]);
	}

	onMouseUp(event) {
		self.elm.focus();
		self._mouseDownPos = null;
		var node = app.doc.getNodeClosestToPoint(event.clientX, event.clientY);
		self.emit('click', [node]);
	}

	setHasSelection(value) {
		this._hasSelection = value;
		if (value) {
			this.caret.hide();
		} else {
			this.caret.show();
			this._clearSelection();
		}
	}

	get hasSelection() {
		return this._hasSelection;
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
		if (!this.caret.hasSelection) {
			return false;
		}

		this.caret.moveBefore(this.caret.getStartNode());

		var startI = this.textBuffer.indexOf(this.caret.getStartNode());
		var endI = this.textBuffer.indexOf(this.caret.getEndNode());
		var node;

		while ((node = this.textBuffer.removeAt(startI))) {
			if (node === this.caret.elm) {
				startI += 1;
				continue;
			}

			if (node === this.caret.getEndNode()) {
				node.remove();
				break;
			}

			node.remove();
		}

		this.textBuffer.setDirty();
		this.caret.clearSelection();
		this._clearSelection();
		this.caret._startBlink();
	}
}

Poe.InputHandler = InputHandler;
})(window.Poe);
