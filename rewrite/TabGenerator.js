(function(Poe) {
'use strict';

class TabGenerator {
	constructor(buffer) {
		var self = this;
		this._tabs = [];
		buffer.on('change', function() {
			self._update.call(this);
		});
	}

	createTabForStop(stop) {
		var tab = {
			tab: $createElm('div'),
			stop: stop
		};

		this._tabs.push(tab);
		tab.tab.style['padding-left'] = stop.width;
	}

	_update() {

	}
}
})(window.Poe);
