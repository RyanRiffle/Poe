(function(Poe) {
'use strict';


class EventHandler extends Poe.Object {
	constructor(acceptedEvents) {
		super();
		this._evtCallbacks = {};

		for (var i = 0; i < acceptedEvents.length; i++) {
			this._evtCallbacks[acceptedEvents[i]] = [];
		}
	}

	free() {
		var keys = Object.keys(this._evtCallbacks);
		var key;
		for (var i = 0; i < keys.length; i++) {
			key = keys[i];
			for (var x = 0; x < this._evtCallbacks[key].length; x++) {
				this.removeEventListener(key, this._evtCallbacks[key][x]);
			}
		}
	}

	addEventListener(evt, cb) {
		if (!this._evtCallbacks[evt]) {
			throw new Error('Registered callback for non-existant event.');
		}

		this._evtCallbacks[evt].push(cb);
		return cb;
	}

	removeEventListener(evt, cb) {
		var index = this._evtCallbacks[evt].indexOf(cb);
		this._evtCallbacks[evt].splice(index, 1);
		return this;
	}

	supportsEvent(evt) {
		if (this._evtCallbacks[evt] === undefined) {
			return false;
		}

		return true;
	}

	emit(evt, args) {
		this._evtCallbacks[evt].forEach(function(cb) {
			cb.apply(this, args);
		});
	}
}

Poe.EventHandler = EventHandler;
})(window.Poe);
