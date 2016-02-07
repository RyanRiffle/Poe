(function(Ribbon, DomElement) {
'use strict';

class Popover extends DomElement {
	constructor(events) {
		if (events) {
			events.concat(['hide','show']);
		}

		super('div', events);
		this.addClass('popover');
		document.body.appendChild(this.elm);

		var self = this;
		var hideFn = function() {
			self.hide();
		};

		Poe.EventManager.addEventListener(this, 'mouseleave', hideFn);
		Poe.EventManager.addEventListener(this, 'blur', hideFn);
	}

	showFor(elm, where) {
		if (where === 'bottom') {
			this._showBottom(elm);
		} else if (where === 'top') {
			this._showTop(elm);
		} else if (where === 'left') {
			this._showLeft(elm);
		} else if (where === 'right') {
			this._showRight(elm);
		}

		this.focus();
	}

	_showBottom(elm) {
		var elmRect = elm.getBoundingClientRect();
		this._setPosition(elmRect.left, elmRect.bottom);
		this.show();
	}

	_showTop(elm) {
		var elmRect = elm.getBoundingClientRect();
		var popoverRect = this.elm.getBoundingClientRect();
		this._setPosition(elmRect.left, elmRect.top + popoverRect.height);
		this.show();
	}

	_showLeft(elm) {
		var elmRect = elm.getBoundingClientRect();
		var popoverRect = this.elm.getBoundingClientRect();
		this._setPosition(elmRect.left - popoverRect.width, elmRect.top);
		this.show();
	}

	_showRight(elm) {
		var elmRect = elm.getBoundingClientRect();
		this._setPosition(elmRect.right, elmRect.top);
		this.show();
	}

	_setPosition(x, y) {
		this.elm.style.left = $pxStr(x);
		this.elm.style.top = $pxStr(y);
	}


}

Ribbon.Popover = Popover;
})(window.Poe.Ribbon, window.Poe.DomElement);
