(function(Poe) {
'use strict';

class DomElement extends Poe.EventHandler {
	constructor(tagName, events) {
		super(events || []);
		this.elm = $createElm(tagName);
		$hide(this.elm);
	}

	hide() {
		$hide(this.elm);
		return this;
	}

	show() {
		$show(this.elm);
		return this;
	}

	get isVisible() {
		return $hasClass(this.elm, 'hidden');
	}

	get style() {
		return this.elm.style;
	}

	child(index) {
		return childNodes[index];
	}

	append(child) {
		if (child.elm) {
			$append(child.elm, this.elm);
		} else {
			$append(child, this.elm);
		}
		return this;
	}

	prepend(child) {
		$prepend(child, this.elm);
		return this;
	}

	addClass(className) {
		$addClass(this.elm, className);
	}

	removeClass(className) {
		$removeClass(this.elm, className);
	}

	get childNodes() {
		return this.elm.childNodes;
	}

	remove() {
		this.elm.remove();
	}
}

Poe.DomElement = DomElement;
})(window.Poe);
