(function(Ribbon) {
'use strict';

class Dropdown extends Ribbon.Popover {
	constructor() {
		super(['click']);
		this.addClass('dropdown');
		this._list = new Ribbon.UnorderedList();
		this.append(this._list);

	}

	addItem(item, style) {
		var li = this._list.addItem(item);
		if (style) {
			var keys = Object.keys(style);
			for (var i = 0; i < keys.length; i++) {
				li.style[keys[i]] = style[keys[i]];
			}
		}
		var self = this;
		li.addEventListener('click', function(evt) {
			self._onItemClicked.apply(self, [evt]);
		});
		return li;
	}

	removeItem(item) {
		return this._list.removeItem(item);
	}

	_onItemClicked(evt) {
		this.hide();
		this.emit('click', [evt.target.textContent]);
	}
}

Ribbon.Dropdown = Dropdown;
})(window.Poe.Ribbon);
