(function(DomElement, Ribbon) {
'use strict';

class UnorderedList extends Poe.DomElement{
	constructor() {
		super('ul', ['click']);
		this.addClass('ul');

		this._items = [];
		this.show();
	}

	addItem(html, clickCallback) {
		var li = $createElm('li');
		li.innerHTML = html;
		this.append(li);
		li.addEventListener('click', clickCallback);
		return li;
	}

	removeItem(item) {
		var index = this._items.indexOf(item);
		if (index !== -1) {
			this._items.splice(index, 1);
			item.remove();
		}
	}
}

Ribbon.UnorderedList = UnorderedList;
})(window.Poe.DomElement, window.Poe.Ribbon);
