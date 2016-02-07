(function(Ribbon) {
'use strict';

class ColorPopover extends Ribbon.Popover {
	constructor() {
		super(['click']);
		this.addClass('color');
		this.addClass('horizontal-group');
		this._init();
		this._registerEvents();
	}

	_init() {
		var colors = Poe.config.defaultColors;
		var colorNames = Object.keys(colors);
		var color;

		for (var i = 0; i < colorNames.length; i++) {
			color = colors[colorNames[i]];
			var col = this._createColumn();
			for (var x = 0; x < 6; x++) {
				color = Poe.Color.hex(color).darken(1 / 12).toHex();
				var block = this._createBlock(color);
				col.appendChild(block);
			}
			this.elm.appendChild(col);
		}
	}

	_registerEvents() {
		var self = this;
		Poe.EventManager.addEventListener(this.elm, 'click', function(event) {
			if ($hasClass(event.target, 'color-block')) {
				self.emit('click', [event.target.style.backgroundColor]);
			}
		});
	}

	_createColumn() {
		return $createElmWithClass('div', 'vertical-group');
	}

	_createBlock(color) {
		var elm = $createElmWithClass('div', 'color-block');
		elm.style.backgroundColor = color;
		elm.appendChild(document.createTextNode(String.fromCharCode(160)));
		elm.appendChild(document.createTextNode(String.fromCharCode(160)));
		elm.appendChild(document.createTextNode(String.fromCharCode(160)));
		return elm;
	}
}

Ribbon.ColorPopover = ColorPopover;
})(window.Poe.Ribbon);
