(function(Poe) {
'use strict';

class Ribbon extends Poe.DomElement{
	constructor() {
		super('div');
		this.addClass('ribbon');
	}
}

Poe.Ribbon = {
	Ribbon: Ribbon
}
})(window.Poe);
