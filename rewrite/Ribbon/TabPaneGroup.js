(function(DomElement, Ribbon) {
'use strict';

class TabPaneGroup extends DomElement {
	constructor(name) {
		super('div');
		this.addClass('tab-pane-group');
		this.name = (name ? name : '');
		this.show();
	}

	setName(name) {
		this.name = name;
	}

	appendMultiple(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].elm)
				$append(arr[i].elm, this.elm);
			else
				$append(arr[i], this.elm);
		}
	}
}

Ribbon.TabPaneGroup = TabPaneGroup;
})(window.Poe.DomElement, window.Poe.Ribbon);
