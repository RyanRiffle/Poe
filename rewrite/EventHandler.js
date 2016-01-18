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
		return cb;
	}

	removeOn(evt, cb) {
		var index = this._evtCallbacks[evt].indexOf(cb);
		this._evtCallbacks[evt].splice(index, 1);
		return this;
	}

	emit(evt, args) {
		this._evtCallbacks[evt].forEach(function(cb) {
			cb.apply(this, args);
		});
	}
}

Poe.EventHandler = EventHandler;
})(window.Poe);
