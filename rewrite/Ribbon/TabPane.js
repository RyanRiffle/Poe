(function(DomElement, Ribbon) {
'use strict';

class TabPane extends Poe.DomElement{
	constructor(ribbon) {
		super('div');
		this.addClass('tab-pane');
		ribbon.append(this);

		this._groups = {};
	}

	addGroup(group) {
		this._groups[group.name] = group;
	}

	getGroup(name) {
		return this._groups[name];
	}
}
})(window.Poe.DomElement, window.Poe.Ribbon);
