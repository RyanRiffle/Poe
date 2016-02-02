(function(Poe, Ribbon) {
'use strict';

class TabBar extends Poe.DomElement {
	constructor(ribbon) {
		super('div');
		this._ribbon = ribbon;
		this._ribbon.append(this.elm);
		this.addClass('tab-bar');
		this._tabPanes = [];
		this.show();
	}

	createTab(text) {
		var tab = $createElm('div');
		$addClass(tab, 'tab');
		tab.innerHTML = text;

		var tabPane = new Ribbon.TabPane(this._ribbon);
		if (this._tabPanes.length !== 0) {
			tabPane.hide();
		} else {
			$addClass(tab, 'active');
		}
		this._tabPanes.push(tabPane);

		var self = this;
		tab.addEventListener('click', function(evt) {
			self.setTab.apply(self, [tab, tabPane]);
		});

		this.append(tab);
		tabPane.tab = tab;
		return tabPane;
	}

	getTab(index) {

	}

	setTab(tab, tabPane) {
		for (var i = 0; i < this.elm.childNodes.length; i++) {
			if ($hasClass(this.elm.childNodes[i], 'active')) {
				$removeClass(this.elm.childNodes[i], 'active');
			}
		}

		$addClass(tab, 'active');
		var pane = null;
		for (i = 0; i < this._tabPanes.length; i++) {
			pane = this._tabPanes[i];
			pane.hide();
		}

		tabPane.show();
	}
}

Ribbon.TabBar = TabBar;

})(window.Poe, window.Poe.Ribbon);
