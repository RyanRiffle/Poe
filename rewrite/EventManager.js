(function(Poe) {
'use strict';

class EventListener extends Poe.Object {
	constructor(element, type, callback) {
		super();
		this._element = element;
		this._type = type;
		this._callback = callback;
		element.addEventListener(type, callback);
	}

	getElement() {
		return this._element;
	}

	getType() {
		return this._type;
	}

	getCallback() {
		return this.type;
	}

	register() {
		this._element.addEventListener(this._type, this._callback);
	}

	unregister() {
		this._element.removeEventListener(this._type, this._callback);
	}

	canContain(eventListener) {
		if (eventListener.getType() !== this.getType()) {
			return false;
		}

		if (this.getElement().contains(eventListener.getElement())) {
			return true;
		}

		return false;
	}
}

class EventManager extends Poe.Object {
	constructor() {
		super();
		this._eventListeners = {};
	}

	free() {

	}

	addEventListener(element, type, callback) {
		if (typeof type === 'Array') {
			var listeners = [];
			for (var i = 0; i < type.length; i++) {
				listeners.push(this.addEventListener(element, type[i], callback));
			}
			return listeners;
		}

		var listener = new Poe.EventListener(element, type, callback);
		if (typeof this._eventListeners[type] === 'undefined') {
			this._eventListeners[type] = [];
		}

		this._eventListeners[type].push(listener);
		listener.register();
		return listener;
	}

	removeEventListener(type, callback) {
		if (!this._eventListeners[type]) {
			return;
		}

		for (var i = 0; i < this._eventListeners[type].length; i++) {
			if (this._eventListeners[type][i].getCallback() === callback) {
				this._eventListeners[type].splice(i, 1);
				return;
			}
		}
	}
}

Poe.EventManager = new EventManager;
Poe.EventListener = EventListener;
})(window.Poe);
