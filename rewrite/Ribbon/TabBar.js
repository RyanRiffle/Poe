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

	createTab(text, isFloating) {
		isFloating = isFloating || false;
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

		if (isFloating) {
			tabPane.addClass('floating');
			Poe.EventManager.addEventListener(tabPane, 'mouseleave', function() {
				tabPane.hide();
				$removeClass(tab, 'active');
			});
		}

		var self = this;
		Poe.EventManager.addEventListener(tab, 'click', function(evt) {
			self.setTab.apply(self, [tab, tabPane]);
		});

		this.append(tab);
		tabPane.tab = tab;
		tab.pane = tabPane;
		tab.isFloating = isFloating;
		return tab;
	}

	getTab(index) {
		
	}

	setTab(tab) {
		if ($hasClass(tab, 'active') && tab.isFloating) {
			tab.pane.hide();
			$removeClass(tab, 'active');
			return;
		}

		if (!tab.isFloating) {
			for (let i = 0; i < this.elm.childNodes.length; i++) {
				if ($hasClass(this.elm.childNodes[i], 'active')) {
					$removeClass(this.elm.childNodes[i], 'active');
				}
			}
		}

		$addClass(tab, 'active');
		var pane = null;
		if (!tab.isFloating) {
			for (let i = 0; i < this._tabPanes.length; i++) {
				pane = this._tabPanes[i];
				pane.hide();
			}
		}

		tab.pane.show();
		tab.pane.focus();
	}
}

Ribbon.TabBar = TabBar;

})(window.Poe, window.Poe.Ribbon);
