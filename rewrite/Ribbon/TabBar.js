(function(Poe, Ribbon) {
'use strict';

class TabBar extends Poe.DomElement {
	constructor(ribbon) {
		super('div');
		this._ribbon = ribbon;
		this.addClass('tab-bar');
		this._tabPanes = [];
	}

	createTab(text) {
		var tab = $createElm('div');
		tab.addClass('tab');
		tab.innerHTML = text;

		this._tabPanes.push(new Ribbon.TabPane(this._ribbon));

		this.append(tab);
	}

	getTab(index) {

	}
}

})(window.Poe, window.Poe.Ribbon);
