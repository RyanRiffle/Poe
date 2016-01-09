(function(Poe) {
'use strict';

var self = null;

class InputHandler extends Poe.DomElement {
	constructor() {
		super('textarea');
		$addClass(this.elm, 'user-input');
		$prepend(this.elm, document.body);
		this.show();

		this.caret = null;

		self = this;
		this.elm.addEventListener('input', this.onInput);
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('mousedown', this.onMouseDown);
		window.addEventListener('mouseup', this.onMouseUp);
		this.elm.focus();

	}

	setCaret(caret) {
		this.caret = caret;
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
	}

	onKeyDown(event) {
		if (event.ctrlKey) {
			return;
		}

		switch(event.keyCode) {
			case Poe.Keysym.Backspace:
				self.caret.removePreviousSibling();
				break;

			case Poe.Keysym.Delete:
				self.caret.removeNextSibling();
				break;

			case Poe.Keysym.Left:
				self.caret.moveLeft();
				break;

			case Poe.Keysym.Right:
				self.caret.moveRight();
				break;

			case Poe.Keysym.Space:
				event.preventDefault();
				self.caret.insertNode(document.createTextNode(' '));
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
				break;
		}
	}

	onMouseDown(event) {
		self.elm.focus();
	}

	onMouseUp(event) {
		self.elm.focus();
		self.caret._startBlink();
	}
}

Poe.InputHandler = InputHandler;
})(window.Poe);
