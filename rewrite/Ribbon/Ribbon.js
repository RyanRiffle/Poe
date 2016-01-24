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
		var homePane = this.createHomePane();
		var pageLayoutPane = this.createPageLayoutPane();
		var insertPane = this.tabBar.createTab('Insert');

		this.append(homePane);
		this.append(insertPane);
		this.append(pageLayoutPane);
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
			this.buttons.copyPaste.elm.innerHTML = '<span class="glyphicons glyphicons-paste" style="font-size: 32px; color: #4283FC;"></span><br/><div style="padding-top: 4px;">Paste</div>';
			return;
		}

		this.buttons.copyPaste.elm.innerHTML = '<span class="glyphicons glyphicons-copy" style="font-size: 32px; color: #4283FC;"></span><br/><div style="padding-top: 4px;">Copy</div>';
	}

	updateStyleButtons() {
		var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);

		self.buttons.bold.toggleClass('active', textStyle.isBold());
		self.buttons.italic.toggleClass('active', textStyle.isItalic());
		self.buttons.underline.toggleClass('active', textStyle.isUnderline());
		self.buttons.strike.toggleClass('active', textStyle.isStrike());
		self.buttons.sup.toggleClass('active', textStyle.isSuperscript());
		self.buttons.sub.toggleClass('active', textStyle.isSubscript());

		this.input.font.elm.style['font-family'] = textStyle.getFont();
		this.input.font.setText(textStyle.getFont().replace("'", ""));
	}

	createHomePane() {
		var homePane = this.tabBar.createTab('Home');
		var fontBtnGroupH = $createElmWithClass('div', 'horizontal-group');
		var inputFont = new Poe.Ribbon.InputText();
		inputFont.elm.style['font-size'] = '12px';
		var inputFontSize = new Poe.Ribbon.InputText();
		inputFontSize.elm.style.width = '25px';
		inputFontSize.elm.style['font-size'] = '12px';
		var fontGroup = new Poe.Ribbon.TabPaneGroup('Font');
		fontGroup.addClass('vertical-group');

		var fontInputGroupH = $createElmWithClass('div', 'horizontal-group');
		fontInputGroupH.appendChild(inputFont.elm);
		fontInputGroupH.appendChild(inputFontSize.elm);
		var paragraphGroup = new Poe.Ribbon.TabPaneGroup('Paragraph');
		//paragraphGroup.addClass('vertical-group');
		var btnBold = new Poe.Ribbon.Button('<b>B</b>');
		var btnItalic = new Poe.Ribbon.Button('<b><i>I</i></b>');
		var btnUnderline = new Poe.Ribbon.Button('<b><u>U</u></b>');
		var btnStrike = new Poe.Ribbon.Button('<span class="s">S</b>');
		var btnSub = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-subscript"></span>');
		var btnSup = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-superscript"></span>');
		this.buttons.bold = btnBold;
		this.buttons.italic = btnItalic;
		this.buttons.underline = btnUnderline;
		this.buttons.strike = btnStrike;
		this.buttons.sub = btnSub;
		this.buttons.sup = btnSup;
		this.input.font = inputFont;

		fontBtnGroupH.appendChild(btnBold.elm);
		fontBtnGroupH.appendChild(btnItalic.elm);
		fontBtnGroupH.appendChild(btnUnderline.elm);
		fontBtnGroupH.appendChild(btnStrike.elm);
		fontBtnGroupH.appendChild(btnSub.elm);
		fontBtnGroupH.appendChild(btnSup.elm);
		fontGroup.appendMultiple([fontInputGroupH, fontBtnGroupH]);

		var alignBtnGroupH = $createElmWithClass('div', 'horizontal-group');
		var btnAlignLeft = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-align-left"></span>');
		var btnAlignCenter = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-align-center"></span>');
		var btnAlignRight = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-align-right"></span>');
		alignBtnGroupH.appendChild(btnAlignLeft.elm);
		alignBtnGroupH.appendChild(btnAlignCenter.elm);
		alignBtnGroupH.appendChild(btnAlignRight.elm);
		this.buttons.alignLeft = btnAlignLeft;
		this.buttons.alignCenter = btnAlignCenter;
		this.buttons.alignRight = btnAlignRight;
		paragraphGroup.append(alignBtnGroupH);

		var clipboardGroup = new Poe.Ribbon.TabPaneGroup();
		clipboardGroup.addClass('vertical-group');
		var btnCopyPaste = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-copy" style="font-size: 32px; color: #4283FC;"></span><br/><div style="padding-top: 4px;">Copy</div>');
		var btnFormatPainter = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-brush"></span>');
		btnFormatPainter.elm.style['font-size'] = '16px';
		var clipboardGroupH = $createElmWithClass('div', 'horizontal-group');

		this.buttons.copyPaste = btnCopyPaste;
		this.buttons.formatPainter = btnFormatPainter;
		clipboardGroupH.appendChild(btnFormatPainter.elm);
		clipboardGroup.append(btnCopyPaste);
		clipboardGroup.append(clipboardGroupH);

		homePane.append(clipboardGroup.elm);
		homePane.append(fontGroup.elm);
		homePane.append(paragraphGroup.elm);

		var toggleButtonEvent = function(btn, check, set) {
			var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);
			var flip = !textStyle[check]();
			textStyle[set](flip);
			btn.setActive(flip);
			textStyle.applyStyle(app.doc.caret);
			app.doc.InputHandler.focus();
		};

		btnBold.on('click', function() {
			toggleButtonEvent(btnBold, 'isBold', 'setBold');
		});

		btnItalic.on('click', function() {
			toggleButtonEvent(btnItalic, 'isItalic', 'setItalic');
		});

		btnUnderline.on('click', function() {
			toggleButtonEvent(btnUnderline, 'isUnderline', 'setUnderline');
		});

		btnStrike.on('click', function() {
			toggleButtonEvent(btnStrike, 'isStrike', 'setStrike');
		});

		btnSub.on('click', function() {
			toggleButtonEvent(btnSub, 'isSubscript', 'setSubscript');
		});

		btnSup.on('click', function() {
			toggleButtonEvent(btnSup, 'isSuperscript', 'setSuperscript');
		});

		btnCopyPaste.on('click', function() {
			Poe.Clipboard.copySelection();
		});

		var alignButtonEvents = function(align) {
			var pstyle = Poe.TextFormat.ParagraphStyle.getStyle(app.doc.caret);
			pstyle.setTextAlign(align);
			pstyle.applyStyle(app.doc.caret);
			app.doc.InputHandler.focus();
		};

		btnAlignLeft.on('click', function() {
			alignButtonEvents('left');
		});

		btnAlignRight.on('click', function() {
			alignButtonEvents('right');
		});

		btnAlignCenter.on('click', function() {
			alignButtonEvents('center');
		});

		inputFont.on('change', function() {
			var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.caret);
			textStyle.setFont(inputFont.getText());
			textStyle.applyStyle(app.doc.caret);
			inputFont.style['font-family'] = inputFont.getText();
			app.doc.InputHandler.elm.focus();
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
		return homePane;
	}

	createPageLayoutPane() {
		var pageLayoutPane = this.tabBar.createTab('Page Layout');
		var pageSizeGroup = new Poe.Ribbon.TabPaneGroup('Page Size');
		pageSizeGroup.addClass('vertical-group');
		var selectSize = new Poe.Ribbon.Select();
		selectSize.addItems(['Letter', 'Legal', 'Ledger', 'Tabloid']);
		pageSizeGroup.append(selectSize);
		pageLayoutPane.append(pageSizeGroup);

		selectSize.on('change', function(val) {
			if (!Poe.Document.PageSize[val]) {
				throw new Error('Invalid page size');
			}

			app.doc.setPageSizeIn(Poe.Document.PageSize[val]);
		});

		return pageLayoutPane;
	}
}

Poe.Ribbon = {
	Ribbon: Ribbon,
	DefaultRibbon: DefaultRibbon
};
})(window.Poe);
