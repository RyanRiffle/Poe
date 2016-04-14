(function(DomElement, Ribbon) {
'use strict';

class Select extends DomElement {
	constructor() {
		super('select', ['change']);
		this.show();
		self = this;
		Poe.EventManager.addEventListener(this.elm, 'change', function() {
			self.emit('change', [self.elm.value]);
		});
	}

	addItemValue(item, value) {
		var opt = $createElm('option');
		opt.setAttribute('value', value);
		opt.innerHTML = item;
		this.elm.appendChild(opt);
		return this;
	}

	addItem(item) {
		return this.addItemValue(item, item);
	}

	addItems(items) {
		if (this.elm.val === '') {
		}

		for (var i = 0; i < items.length; i++) {
			this.addItem(items[i]);
		}
	}
}

Ribbon.Select = Select;
})(window.Poe.DomElement, window.Poe.Ribbon);
