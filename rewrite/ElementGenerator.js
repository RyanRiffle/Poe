(function(Poe) {
'use strict';

class ElementGenerator {
	constructor() {

	}

	createPage() {
		var elm = $createElm('div');
		$addClass(elm, 'page');
		return elm;
	}

	createParagraph() {
		var elm = $createElm('p');
		$addClass(elm, 'paragraph');
		return elm;
	}

	createLine() {
		var elm = $createElm('div');
		$addClass(elm, 'line');
		return elm;
	}

	createWord() {
		var elm = $createElm('span');
		$addClass(elm, 'word');
		return elm;
	}
}

Poe.ElementGenerator = new ElementGenerator();
})(window.Poe);
