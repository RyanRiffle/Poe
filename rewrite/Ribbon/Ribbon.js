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
		var file = this.createFileMenu();
		var home = this.createHomePane();
		var pageLayout = this.createPageLayoutPane();
		var insert = this.tabBar.createTab('Insert');

		this.append(home.pane);
		this.append(insert.pane);
		this.append(pageLayout.pane);
		this.append(file.pane);
		this.tabBar.setTab(home);
	}

	setupEventHandlers() {
		var self = this;
		Poe.EventManager.addEventListener(Poe.Clipboard, 'changed', function() {
			self.updateCopyPasteButton.call(self);
		});
		Poe.EventManager.addEventListener(app.doc.getCaret(), 'moved', function() {
			self.updateStyleButtons.call(self);
		});
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
		var textStyle = Poe.TextFormat.TextStyle.getStyle();
		var paragraphStyle = Poe.TextFormat.ParagraphStyle.getStyle();

		self.buttons.bold.toggleClass('active', textStyle.isBold());
		self.buttons.italic.toggleClass('active', textStyle.isItalic());
		self.buttons.underline.toggleClass('active', textStyle.isUnderline());
		self.buttons.strike.toggleClass('active', textStyle.isStrike());
		self.buttons.sup.toggleClass('active', textStyle.isSuperscript());
		self.buttons.sub.toggleClass('active', textStyle.isSubscript());

		this.input.font.setText(textStyle.getFont().replace("'", ""));
		this.input.fontSize.setText(Math.floor(textStyle.getFontSize()));
	}

	createFileMenu() {
		var fileMenu = this.tabBar.createTab('File', true);
		var menu = new Poe.Ribbon.UnorderedList();
		menu.addClass('menu');
		var itemNew = menu.addItem('<span class="glyphicons glyphicons-file"></span> New Document');
		var itemOpen = menu.addItem('<span class="glyphicons glyphicons-disk-open"></span> Open');
		var itemSave = menu.addItem('<span class="glyphicons glyphicons-disk-save"></span> Save');
		var itemSaveAs = menu.addItem('<span class="glyphicons glyphicons-disk-import"></span> Save As...');
		var itemAbout = menu.addItem('<span class="glyphicons glyphicons-circle-info"></span> About Poe');
		var itemQuit = menu.addItem('<span class="glyphicons glyphicons-exit"></span> Quit');
		fileMenu.pane.append(menu.elm);

		Poe.EventManager.addEventListener(itemNew, 'click', function() {
			Poe.ShortcutManager.doShortcut({alias: 'new_document'});
		});

		Poe.EventManager.addEventListener(itemOpen, 'click', function() {
			Poe.ShortcutManager.doShortcut({alias: 'open'});
		});

		Poe.EventManager.addEventListener(itemSave, 'click', function() {
			Poe.ShortcutManager.doShortcut({alias: 'save'});
		});

		Poe.EventManager.addEventListener(itemSaveAs, 'click', function() {
			Poe.ShortcutManager.doShortcut({alis: 'save_as'});
		});

		Poe.EventManager.addEventListener(itemAbout, 'click', function() {

		});

		Poe.EventManager.addEventListener(itemQuit, 'click', function() {
			window.close();
		});
		return fileMenu;
	}

	createHomePane() {
		var home = this.tabBar.createTab('Home');
		var homePane = home.pane;
		var fontBtnGroupH = $createElmWithClass('div', 'horizontal-group');
		var inputFont = new Poe.Ribbon.InputText();
		inputFont.setText(Poe.config.defaultFont);
		var inputFontSize = new Poe.Ribbon.InputText();
		inputFontSize.setText(Poe.config.defaultFontSize);
		inputFontSize.elm.style.width = '25px';

		var fontDrop = new Poe.Ribbon.FontDropdown();
		fontDrop.addFont('Arimo');
		fontDrop.addFont('Calligraffitti');
		fontDrop.addFont('Cousine');
		fontDrop.addFont('Droid Sans');
		fontDrop.addFont('Droid Serif');
		fontDrop.addFont('Lobster');
		fontDrop.addFont('Open Sans');
		fontDrop.addFont('Pacifico');
		fontDrop.addFont('Raleway');
		fontDrop.addFont('Syncopate');
		fontDrop.addFont('Tinos');
		fontDrop.addFont('Ubuntu');

		fontDrop.addEventListener('click', function(fontName) {
			inputFont.setText(fontName);
			var textStyle = Poe.TextFormat.TextStyle.getStyle();
			textStyle.setFont(fontName);
			textStyle.applyStyle();
		});

		var fontSizeDrop = new Poe.Ribbon.Dropdown();
		fontSizeDrop.addItem('8');
		fontSizeDrop.addItem('9');
		fontSizeDrop.addItem('10');
		fontSizeDrop.addItem('11');
		fontSizeDrop.addItem('12');
		fontSizeDrop.addItem('14');
		fontSizeDrop.addItem('16');
		fontSizeDrop.addItem('18');
		fontSizeDrop.addItem('20');
		fontSizeDrop.addItem('22');
		fontSizeDrop.addItem('24');
		fontSizeDrop.addItem('26');
		fontSizeDrop.addItem('28');
		fontSizeDrop.addItem('36');
		fontSizeDrop.addItem('48');
		fontSizeDrop.addItem('72');

		Poe.EventManager.addEventListener(fontSizeDrop, 'click', function(size) {
			inputFontSize.setText(size);
			var textStyle = Poe.TextFormat.TextStyle.getStyle();
			textStyle.setFontSize(parseInt(size));
			textStyle.applyStyle();
		});

		Poe.EventManager.addEventListener(inputFont.elm, 'click', function() {
			fontDrop.showFor(inputFont, 'bottom');
		});

		Poe.EventManager.addEventListener(inputFontSize.elm, 'click', function() {
			fontSizeDrop.showFor(inputFontSize, 'bottom');
		});

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
		this.input.fontSize = inputFontSize;

		fontBtnGroupH.appendChild(btnBold.elm);
		fontBtnGroupH.appendChild(btnItalic.elm);
		fontBtnGroupH.appendChild(btnUnderline.elm);
		fontBtnGroupH.appendChild(btnStrike.elm);
		fontBtnGroupH.appendChild(btnSub.elm);
		fontBtnGroupH.appendChild(btnSup.elm);

		var colorBtnGroupH = $createElmWithClass('div', 'horizontal-group');
		var btnFontColor = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-text-color"></span>');
		var btnTextBgColor = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-text-background"></span>');
		colorBtnGroupH.appendChild(btnFontColor.elm);
		colorBtnGroupH.appendChild(btnTextBgColor.elm);

		fontGroup.appendMultiple([fontInputGroupH, fontBtnGroupH, colorBtnGroupH]);

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
		var btnCopyPaste = new Poe.Ribbon.Button('<span class="glyphicons glyphicons-copy" style="font-size: 32px; color: #4C8ED1;"></span><br/><div style="padding-top: 4px;">Copy</div>');
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
			var textStyle = Poe.TextFormat.TextStyle.getStyle(app.doc.getCaret());
			var flip = !textStyle[check]();
			textStyle[set](flip);
			btn.setActive(flip);
			textStyle.applyStyle(app.doc.getCaret());
			app.doc.inputHandler.focus();
		};

		btnBold.addEventListener('click', function() {
			toggleButtonEvent(btnBold, 'isBold', 'setBold');
		});

		btnItalic.addEventListener('click', function() {
			toggleButtonEvent(btnItalic, 'isItalic', 'setItalic');
		});

		btnUnderline.addEventListener('click', function() {
			toggleButtonEvent(btnUnderline, 'isUnderline', 'setUnderline');
		});

		btnStrike.addEventListener('click', function() {
			toggleButtonEvent(btnStrike, 'isStrike', 'setStrike');
		});

		btnSub.addEventListener('click', function() {
			toggleButtonEvent(btnSub, 'isSubscript', 'setSubscript');
		});

		btnSup.addEventListener('click', function() {
			toggleButtonEvent(btnSup, 'isSuperscript', 'setSuperscript');
		});

		btnCopyPaste.addEventListener('click', function() {
			Poe.Clipboard.copySelection();
		});

		var colorPopover = new Poe.Ribbon.ColorPopover();

		btnFontColor.addEventListener('click', function() {
			/* TODO: Create a popover, then populate with colors */
			Poe.EventManager.addEventListener(popover, 'click', function(color) {
				btnFontColor.style.color = color;
				var textStyle = Poe.TextFormat.TextStyle.getStyle();
				textStyle.setFontColor(color);
				textStyle.applyStyle();
				popover.hide();
			});
			colorPopover.showFor(btnFontColor, 'bottom');
		});

		btnTextBgColor.addEventListener('click', function() {
			Poe.EventManager.addEventListener(popover, 'click', function(color) {
				btnTextBgColor.style.color = color;
				var textStyle = Poe.TextFormat.TextStyle.getStyle();
				textStyle.setBackgroundColor(color);
				textStyle.applyStyle();
				popover.hide();
			});
			colorPopover.showFor(btnTextBgColor, 'bottom');
		});

		var alignButtonEvents = function(align) {
			var pstyle = Poe.TextFormat.ParagraphStyle.getStyle(app.doc.getCaret());
			pstyle.setTextAlign(align);
			pstyle.applyStyle(app.doc.getCaret());
			app.doc.inputHandler.focus();
		};

		btnAlignLeft.addEventListener('click', function() {
			alignButtonEvents('left');
		});

		btnAlignRight.addEventListener('click', function() {
			alignButtonEvents('right');
		});

		btnAlignCenter.addEventListener('click', function() {
			alignButtonEvents('center');
		});

		inputFont.addEventListener('change', function() {
			var textStyle = Poe.TextFormat.TextStyle.getStyle();
			textStyle.setFont(inputFont.getText());
			textStyle.applyStyle(app.doc.getCaret());
			app.doc.inputHandler.focus();
		});

		inputFontSize.addEventListener('change', function() {
			var textStyle = Poe.TextFormat.TextStyle.getStyle();
			textStyle.setFontSize(parseInt(inputFontSize.getText()));
			textStyle.applyStyle(app.doc.getCaret());
			app.doc.inputHandler.focus();
		});

		btnFormatPainter.addEventListener('click', function() {
			btnFormatPainter._currentTextStyle = null;
			var connection = app.doc.addEventListener('click', function(node) {
				if (btnFormatPainter._currentTextStyle !== null) {
					if (app.doc.getCaret().hasSelection) {
						app.doc.getCaret().splitStartNode();
						app.doc.getCaret().splitEndNode();
						app.doc.getCaret().forEachSelectedWord(function(word) {
							btnFormatPainter._currentTextStyle.applyStyleToWord(word);
						});
					}
					app.doc.removeEventListener('click', connection);
					btnFormatPainter._currentTextStyle = null;
					app.doc.getCaret().clearSelection();
				} else {
					btnFormatPainter._currentTextStyle = Poe.TextFormat.TextStyle.getStyleOfWord(node.parentNode);
				}
			});
		});
		return home;
	}

	createPageLayoutPane() {
		var pageLayout = this.tabBar.createTab('Page Layout');
		var pageLayoutPane = pageLayout.pane;
		var pageSizeGroup = new Poe.Ribbon.TabPaneGroup('Page Size');
		pageSizeGroup.addClass('vertical-group');
		var selectSize = new Poe.Ribbon.Select();
		selectSize.addItems(['Letter', 'Legal', 'Ledger', 'Tabloid']);
		pageSizeGroup.append(selectSize);
		pageLayoutPane.append(pageSizeGroup);

		selectSize.addEventListener('change', function(val) {
			if (!Poe.Document.PageSize[val]) {
				throw new Error('Invalid page size');
			}

			app.doc.setPageSizeIn(Poe.Document.PageSize[val]);
		});

		return pageLayout;
	}
}

Poe.Ribbon = {
	Ribbon: Ribbon,
	DefaultRibbon: DefaultRibbon
};
})(window.Poe);
