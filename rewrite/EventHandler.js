(function(Poe) {
'use strict';


class EventHandler {
	constructor(acceptedEvents) {
		this._evtCallbacks = {};

		for (var i = 0; i < acceptedEvents.length; i++) {
			this._evtCallbacks[acceptedEvents[i]] = [];
		}
	}

	on(evt, cb) {
		if (!this._evtCallbacks[evt]) {
			throw new Error('Registered callback for non-existant event.');
		}

		this._evtCallbacks[evt].push(cb);
	}

	emit(evt, args) {
		this._evtCallbacks[evt].forEach(function(cb) {
			cb();
		});
	}
}

Poe.EventHandler = EventHandler;
})(window.Poe);
