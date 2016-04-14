(function(DomElement, Ribbon) {
'use strict';

class TabPane extends Poe.DomElement{
	constructor() {
		super('div');
		this.addClass('tab-pane');

		this._groups = {};
		this.show();
	}

	addGroup(group) {
		this._groups[group.name] = group;
	}

	getGroup(name) {
		return this._groups[name];
	}
}

Ribbon.TabPane = TabPane;
})(window.Poe.DomElement, window.Poe.Ribbon);
