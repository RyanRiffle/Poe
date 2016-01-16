(function(DomElement, Ribbon) {
'use strict';

class Button extends DomElement {
	constructor() {
		super('button');
		this._evts = {
			'click': []
		};
	}

	on(evt, callback) {
		this._evts[evt] = callback;
	}

	emit(evt) {
		for (var i = 0; i < this._evts[evt].length; i++) {
			this._evts[evt][i]();
		}
	}
}

Ribbon.Button = Button;
})(window.Poe.DomElement, window.Poe.Ribbon);
