(function(Poe) {
'use strict';

var Modifiers = {
	None: 0x0,
	Shift: 0x01,
	Meta: 0x02,
	Alt: 0x04,
	Control: 0x08
};

class Shortcut {
	constructor(opts) {
		this._modifiers = opts.modifiers;
		this._keyCode = opts.keyCode;
		this._callback = opts.callback;
		this._alias = opts.alias;
		this._description = opts.description;
	}

	getModifiers() {
		return this._modifiers;
	}

	getKeyCode() {
		return this._keyCode;
	}

	getCallback() {
		return this._callback;
	}

	getAlias() {
		return this._alias;
	}

	getDescription() {
		
	}
}

class ShortcutManager extends Poe.Object {
	constructor() {
		super();
		this._shortcuts = [];
	}

	doShortcut(d) {
		if (d.alias) {
			return this.doShortcutByAlias(d.alias);
		}

		return this.doShortcutForEvent(d.event);
	}

	doShortcutByAlias(alias) {
		let shortcut;
		for (var i = 0; i < this._shortcuts.length; i++) {
			shortcut = this._shortcuts[i];
			if (shortcut.getAlias() === alias) {
				shortcut.getCallback()();
				return true;
			}
		}

		return false;
	}

	doShortcutForEvent(evt) {
		var shortcut = this.getShortcutForEvent(evt);
		if (shortcut) {
			shortcut.getCallback()();
			return true;
		}

		return false;
	}

	getShortcutForEvent(evt) {
		var mod = Modifiers.None;
		if (evt.shiftKey) {
			mod |= Modifiers.Shift;
		}

		if (evt.ctrlKey) {
			mod |= Modifiers.Control;
		}

		if (evt.altKey) {
			mod |= Modifiers.Alt;
		}

		if (evt.metaKey) {
			mod |= Modifiers.Meta;
		}

		for (var i = 0; i < this._shortcuts.length; i++) {
			if (this._shortcuts[i].getModifiers() === mod &&
				this._shortcuts[i].getKeyCode() === evt.keyCode) {
					return this._shortcuts[i];
				}
		}

		return null;
	}

	/*
		Takes an object
		{
			modifiers: 'meta+shift+ctrl+alt' || ['meta', 'shift', 'ctrl', 'alt']
			keyCode: Poe.KeySym.Whatever
			callback: fn
			alias: 'string' || undefined
		}
	*/
	addShortcut(shortcut_opts) {
		if (!shortcut_opts.keyCode || !shortcut_opts.callback) {
			throw new Error('Can not create shortcut without keyCode or callback');
		}

		if (typeof shortcut_opts.modifiers === 'string') {
			shortcut_opts.modifiers = shortcut_opts.modifiers.split('+');
		}

		var shortcut = this._createShortcut(shortcut_opts);
		this._shortcuts.push(shortcut);
		return shortcut;
	}

	removeShortcut(shortcut) {
		var index = this._shortcuts.indexOf(shortcut);
		if (index === -1) {
			return;
		}

		this._shortcuts.splice(index, 1);
	}

	removeShortcutByAlias(alias) {
		for (var i = 0; i < this._shortcuts.length; i++) {
			if (this._shortcuts[i].getAlias() === alias) {
				this._shortcuts.splice(i, 1);
				return;
			}
		}
	}

	_createShortcut(shortcut) {
		shortcut.alias = shortcut.alias || null;
		var mod = Modifiers.None;

		for (var i = 0; i < shortcut.modifiers.length; i++) {
			switch(shortcut.modifiers[i]) {
				case 'meta':
					mod |= Modifiers.Meta;
					break;
				case 'shift':
					mod |= Modifiers.Shift;
					break;
				case 'control':
					mod |= Modifiers.Control;
					break;
				case 'alt':
					mod |= Modifiers.alt;
					break;
				default:
					throw new Error(shortcut.modifiers[i] + ' is not a valid modifier.');
			}
		}

		shortcut.modifiers = mod;
		return new Shortcut(shortcut);
	}
}

Poe.ShortcutManager = new ShortcutManager();
})(window.Poe);
