(function(DomElement, Ribbon) {
'use strict';

class TabPane extends Poe.DomElement{
	constructor(ribbon) {
		super('div');
		this.addClass('tab-pane');
		ribbon.append(this);
	}
}
})(window.Poe.DomElement, window.Poe.Ribbon);
