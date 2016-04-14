(function(DomElement, Ribbon) {
'use strict';

class Button extends DomElement {
	constructor(text) {
		super('button', ['click']);
		this.elm.innerHTML = text;
		this.show();
		var self = this;
		Poe.EventManager.addEventListener(this.elm, 'click', function() {
			self.emit('click');
		});
	}

	setActive(bool) {
		if (bool) {
			this.addClass('active');
		} else {
			this.removeClass('active');
		}
	}
}

Ribbon.Button = Button;
})(window.Poe.DomElement, window.Poe.Ribbon);
