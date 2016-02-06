(function(DomElement, Ribbon) {
'use strict';

class InputText extends DomElement {
	constructor() {
		super('input', ['change']);
		this.elm.setAttribute('type', 'text');
		Object.assign(this, Poe.EventHandler);
		this.show();

		var self = this;
		Poe.EventManager.addEventListener(this.elm, 'change', function() {
			self.emit('change');
		});
	}

	getText() {
		return this.elm.value;
	}

	setText(val) {
		this.elm.value = val;
		return this;
	}
}

Ribbon.InputText = InputText;
})(window.Poe.DomElement, window.Poe.Ribbon);
