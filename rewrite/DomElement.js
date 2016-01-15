(function() {
'use strict';

class DomElement {
	constructor(tagName) {
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

	child(index) {
		return childNodes[index];
	}

	append(child) {
		$append(child, this.elm);
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
}

Poe.DomElement = DomElement;
})();
