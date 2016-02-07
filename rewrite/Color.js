(function(Poe) {
'use strict';

class Color {
	constructor() {
		this._r = null;
		this._g = null;
		this._b = null;
	}

	hex(color) {
		if (color[0] !== '#') {
			throw new Error(color + ' is not a valid hex color code.');
		}

		var r, g, b;
		r = color.substring(1, 3);
		g = color.substring(3, 5);
		b = color.substring(5, 7);

		this._r = parseInt(r, 16);
		this._g = parseInt(g, 16);
		this._b = parseInt(b, 16);

		return this;
	}

	darken(flt) {
		var amount = Math.floor(255 * flt);
		this._r += amount;
		this._g += amount;
		this._b += amount;

		if (this._r > 255) {
			this._r = 255;
		}

		if (this._g > 255) {
			this._g = 255;
		}

		if (this._b > 255) {
			this._b = 255;
		}
		return this;
	}

	lighten(flt) {
		var amount = Math.floor(255 * flt);
		this._r -= amount;
		this._g -= amount;
		this._b -= amount;
		return this;
	}

	toHex() {
		var str = '#';
		str += this._r.toString(16);
		str += this._g.toString(16);
		str += this._b.toString(16);
		return str;
	}
}

Poe.Color = new Color();
})(window.Poe);
