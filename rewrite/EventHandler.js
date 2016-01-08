(function(Poe) {
'use strict';


class EventHandler {
	constructor(acceptedEvents) {
		this._evtCallbacks = {};

		acceptedCallbacks.forEach(function(evt) {
			this._evtCallbacks[evt] = [];
		});
	}

	on(evt, cb) {
		if (!this._evtCallbacks[evt]) {
			throw new Error('Registered callback for non-existant event.');
		}

		this._evtCallbacks[evt].push(cb);
	}

	emit(evt, args) {
		this._evtCallbacks[evt].forEach(function(cb) {
			cb.apply(arguments.callee, args);
		});
	}
}

Poe.EventHandler = EventHandler;
})(window.Poe);
