###
ToolBar for use with OS.js
###
self = null
Poe.OSjs.ToolBar = (poeWriter, win, name, opts) ->
	self = this
	@poe = poeWriter
	@window = win
	OSjs.GUI.ToolBar.apply(this, [name, opts])

Poe.OSjs.ToolBar.prototype = Object.create(OSjs.GUI.ToolBar.prototype)

Poe.OSjs.ToolBar.prototype.init = () ->
	el = OSjs.GUI.ToolBar.prototype.init.apply(this, ['PoeToolBar'])
	@setup()
	return el
###
Sets up the toolbar by creating the buttons, and registering event handlers.
###
Poe.OSjs.ToolBar.prototype.setup = () ->
	#A little helper for setting up the toolbar icons
	_createIcon = (icon) ->
		return OSjs.API.getThemeResource(icon, 'icon')

	@fontSizeSelect = new OSjs.GUI.Select("FontSizeSelect", {onChange: @fontSizeClicked})
	@fontSelect = new OSjs.GUI.Select("FontSelect", {onChange: @fontSelectClicked})

	@addItem 'FontSelect',
		type: 'custom',
		onCreate: (itemName, itemOpts, outerEl, containerEl) ->
			@window._addGUIElement(@fontSelect, containerEl)
			$(containerEl).width(100)

	@addItem 'FontSizeSelect',
		type: 'custom'
		onCreate: (itemName, itemOpts, outerEl, containerEl) =>
			@window._addGUIElement(@fontSizeSelect, containerEl)
			$(containerEl).width(45)

	@addItem 'ButtonBold',
		toggleable: true
		onClick: @poe.toolbarHelper.btnBoldClicked
		icon: _createIcon 'actions/format-text-bold.png'

	@addItem 'ButtonItalic',
		toggleable: true
		onClick: @poe.toolbarHelper.btnItalicClicked
		icon: _createIcon 'actions/format-text-italic.png'

	@addItem 'ButtonUnderline',
		toggleable: true
		onClick: @poe.toolbarHelper.btnUnderlineClicked
		icon: _createIcon 'actions/format-text-underline.png'

	@addSeparator()

	@addItem 'ButtonAlignLeft',
		toggleable: true
		grouped: true
		onClick: @poe.toolbarHelper.btnAlignLeftClicked
		icon: _createIcon 'actions/format-justify-left.png'

	@addItem 'ButtonAlignCenter',
		toggleable: true
		grouped: true
		onClick: @poe.toolbarHelper.btnAlignCenterClicked
		icon: _createIcon 'actions/format-justify-center.png'

	@addItem 'ButtonAlignRight',
		toggleable: true
		grouped: true
		onClick: @poe.toolbarHelper.btnAlignRightClicked
		icon: _createIcon 'actions/format-justify-right.png'

	@addSeparator()

	@render()

	#Add the font sizes
	for size in @poe.toolbarHelper.fontSizes
		@fontSizeSelect.addItem size, size

	#Add the fonts
	@poe.toolbarHelper.addEventHandler 'fontAdded', (font) =>
		@fontSelect.addItem font, font
		# Set the current font to the first one

	@poe.toolbarHelper.addEventHandler 'textStyleChanged', @handleTextStyleChanged
	@poe.toolbarHelper.addEventHandler 'paragraphStyleChanged', @handleParagraphStyleChanged

	###for font in OSjs.API.getHandlerInstance().getConfig('Fonts').list
		console.log font
		@fontSelect.addItem font, font###

	@fontSizeSelect.setValue '12'

	defaultFont = OSjs.API.getHandlerInstance().getConfig('Fonts')['default']
	@fontSelect.setValue defaultFont
	@poe.toolbarHelper.fontClicked defaultFont
	@poe.toolbarHelper.fontManager.loadDefaults()
	#Set the current font to the first on added

Poe.OSjs.ToolBar.prototype.fontSizeClicked = (selectRef, event, value) ->
	self.poe.toolbarHelper.fontSizeClicked self.fontSizeSelect.getValue()

Poe.OSjs.ToolBar.prototype.fontSelectClicked = (selectRef, event, value) ->
	self.poe.toolbarHelper.fontClicked self.fontSelect.getValue()

Poe.OSjs.ToolBar.prototype.handleTextStyleChanged = (textStyle) ->
	self.fontSelect.setValue textStyle.font
	self.fontSizeSelect.setValue textStyle.fontSize
	if textStyle.bold
		$('.ButtonBold').children('button').addClass('Active')
	else
		$('.ButtonBold').children('button').removeClass('Active')

	if textStyle.italic
		$('.ButtonItalic').children('button').addClass('Active')
	else
		$('.ButtonItalic').children('button').removeClass('Active');

	if textStyle.underline
		$('.ButtonUnderline').children('button').addClass('Active')
	else
		$('.ButtonUnderline').children('button').removeClass('Active')

Poe.OSjs.ToolBar.prototype.handleParagraphStyleChanged = (pstyle) ->
	$('.ButtonAlignLeft').children('button').removeClass('Active')
	$('.ButtonAlignCenter').children('button').removeClass('Active')
	$('.ButtonAlignRight').children('button').removeClass('Active')

	switch (pstyle.align)
		when Poe.ParagraphStyle.Align.Left
			$('.ButtonAlignLeft').children('button').addClass('Active')
		when Poe.ParagraphStyle.Align.Center
			$('.ButtonAlignCenter').children('button').addClass('Active')
		when Poe.ParagraphStyle.AlignRight
			$('.ButtonAlignRight').children('button').addClass('Active')
