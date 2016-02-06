(function(Poe) {
'use strict';

var self;
class TabGenerator extends Poe.Object {
	constructor(buffer) {
		this._tabs = [];
		self = this;
		Poe.EventManager.addEventListener(buffer, 'change', this._onBufferChange);
	}

	createTabForStop(stop) {
		var tab = {
			tab: $createElm('div'),
			stop: stop
		};

		this._tabs.push(tab);
		tab.tab.style['padding-left'] = stop.width;
	}

	_onBufferChange() {
		self._update.call(this);
	}

	_update() {

	}
}
})(window.Poe);
