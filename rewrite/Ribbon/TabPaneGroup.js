(function(DomElement, Ribbon) {
'use strict';

class TabPaneGroup extends DomElement {
	constructor() {
		super('div');
		this.addClass('tab-pane-group');
		this.name = '';
	}

	setName(name) {
		this.name = name;
	}
}

Ribbon.TabPaneGroup = TabPaneGroup;
})(window.Poe.DomElement, window.Poe.Ribbon);
