(function(Ribbon) {
'use strict';

class FontDropdown extends Ribbon.Dropdown {
	constructor() {
		super();
		this.addClass('font');
	}

	addFont(name) {
		this.addItem(name, {fontFamily: name});
	}
}

Ribbon.FontDropdown = FontDropdown;
})(window.Poe.Ribbon);
