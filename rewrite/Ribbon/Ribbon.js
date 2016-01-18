(function(Poe) {
'use strict';

class Ribbon extends Poe.DomElement {
	constructor() {
		super('div');
		this.addClass('ribbon');
		this.tabBar = new Poe.Ribbon.TabBar(this);
		this.show();
	}
}

var self = null;
class DefaultRibbon extends Ribbon {
	constructor() {
		super();
		self = this;
		this.buttons = {};
		this.input = {};
		this.init();
	}

	init() {
		var homePane = this.tabBar.createTab('Home');
		var insertPane = this.tabBar.createTab('Insert');
		var pageLayoutPane = this.tabBar.createTab('Page Layout');

		var fontBtnGroupH = $createElmWithClass('div', 'horizontal-group');
		var inputFont = new Poe.Ribbon.InputText();
		var fontGroup = new Poe.Ribbon.TabPaneGroup('Font');
		fontGroup.addClass('vertical-group');
		var btnBold = new Poe.Ribbon.Button('<b>B</b>');
		var btnItalic = new Poe.Ribbon.Button('<b><i>I</i></b>');
		var btnUnderline = new Poe.Ribbon.Button('<b><u>U</u></b>');
		this.buttons['bold'] = btnBold;
		this.buttons['italic'] = btnItalic;
		this.buttons['underline'] = btnUnderline;
		this.input['font'] = inputFont;

		fontBtnGroupH.appendChild(btnBold.elm);
		fontBtnGroupH.appendChild(btnItalic.elm);
		fontBtnGroupH.appendChild(btnUnderline.elm);
		fontGroup.appendMultiple([inputFont, fontBtnGroupH]);
		this.append(homePane);
		this.append(insertPane);
		this.append(pageLayoutPane);

		var clipboardGroup = new Poe.Ribbon.TabPaneGroup();
		clipboardGroup.addClass('vertical-group');
		var btnCopyPaste = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-copy" style="font-size: 32px; color: #4283FC;"></span><br/><div style="padding-top: 4px;">Copy</div>');
		var btnFormatPainter = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-brush"></span>');
		btnFormatPainter.elm.style['font-size'] = '16px';
		var clipboardGroupH = $createElmWithClass('div', 'horizontal-group');

		this.buttons['copyPaste'] = btnCopyPaste;
		this.buttons['formatPainter'] = btnFormatPainter;
		clipboardGroupH.appendChild(btnFormatPainter.elm);
		clipboardGroup.append(btnCopyPaste);
		clipboardGroup.append(clipboardGroupH);

		homePane.append(clipboardGroup.elm);
		homePane.append(fontGroup.elm);

		btnBold.on('click', function() {
			var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);
			textStyle.setBold(!textStyle.isBold());
			btnBold.setActive(!textStyle.isBold());

			textStyle.applyStyle(app.doc.caret);
			app.doc.InputHandler.elm.focus();
		});

		btnItalic.on('click', function() {
			var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);
			textStyle.setItalic(!textStyle.isItalic());
			btnItalic.setActive(!textStyle.isItalic());
			textStyle.applyStyle(app.doc.caret);
			app.doc.InputHandler.elm.focus();
		});

		btnUnderline.on('click', function() {
			var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);
			textStyle.setUnderline(!textStyle.isUnderline());
			btnUnderline.setActive(!textStyle.isUnderline());
			textStyle.applyStyle(app.doc.caret);
			app.doc.InputHandler.elm.focus();
		});

		inputFont.on('change', function() {
			var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);
			textStyle.setFont(inputFont.getText());
			textStyle.applyStyle(app.doc.caret);
			inputFont.style['font-family'] = inputFont.getText();
			app.doc.InputHandler.elm.focus();
		});

		btnCopyPaste.on('click', function() {
			Poe.Clipboard.copySelection();
		});

		btnFormatPainter.on('click', function() {
			btnFormatPainter._currentTextStyle = null;
			var connection = app.doc.on('click', function(node) {
				if (btnFormatPainter._currentTextStyle !== null) {
					if (app.doc.caret.hasSelection) {
						app.doc.caret.splitStartNode();
						app.doc.caret.splitEndNode();
						app.doc.caret.forEachSelectedWord(function(word) {
							btnFormatPainter._currentTextStyle.applyStyleToWord(word);
						});
					}
					app.doc.removeOn('click', connection);
					btnFormatPainter._currentTextStyle = null;
					app.doc.caret.clearSelection();
				} else {
					btnFormatPainter._currentTextStyle = Poe.TextFormat.TextStyle.getStyleOfWord(node.parentNode);
				}
			});
		});
	}

	setupEventHandlers() {
		var self = this;
		Poe.Clipboard.on('changed', function() {
			self.updateCopyPasteButton.call(self);
		});

		app.doc.caret.on('moved', function() {
			self.updateStyleButtons.call(self);
		});
		self.updateStyleButtons.call(self);
	}

	updateCopyPasteButton() {
		if (Poe.Clipboard.hasData()) {
			/*
				Make the button's icon paste
			*/
			this.buttons['copyPaste'].elm.innerHTML = '<span class="glyphicons glyphicons-paste" style="font-size: 32px; color: #4283FC;"></span><br/><div style="padding-top: 4px;">Paste</div>';
			return;
		}

		this.buttons['copyPaste'].elm.innerHTML = '<span class="glyphicons glyphicons-copy" style="font-size: 32px; color: #4283FC;"></span><br/><div style="padding-top: 4px;">Copy</div>';
	}

	updateStyleButtons() {
		var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);
		if (textStyle.isBold()) {
			self.buttons['bold'].addClass('active');
		} else {
			self.buttons['bold'].removeClass('active');
		}

		if (textStyle.isItalic()) {
			self.buttons['italic'].addClass('active');
		} else {
			self.buttons['italic'].removeClass('active');
		}

		if (textStyle.isUnderline()) {
			self.buttons['underline'].addClass('active');
		} else {
			self.buttons['underline'].removeClass('active');
		}

		this.input['font'].elm.style['font-family'] = textStyle.getFont();
		this.input['font'].setText(textStyle.getFont().replace("'", ""));
	}
}

Poe.Ribbon = {
	Ribbon: Ribbon,
	DefaultRibbon: DefaultRibbon
};
})(window.Poe);
