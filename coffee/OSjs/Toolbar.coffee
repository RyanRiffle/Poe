###
Toolbar for use with OS.js
###
self = null
Poe.OSjs.Toolbar = (poeWriter, win, name, opts) ->
	self = this
	@poe = poeWriter
	@window = win
	OSjs.GUI.ToolBar.apply(this, [name, opts])

Poe.OSjs.Toolbar.prototype = Object.create(OSjs.GUI.ToolBar.prototype)

Poe.OSjs.Toolbar.prototype.init = () ->
	el = OSjs.GUI.ToolBar.prototype.init.apply(this, ['PoeToolbar'])
	@setup()
	return el
###
Sets up the toolbar by creating the buttons, and registering event handlers.
###
Poe.OSjs.Toolbar.prototype.setup = () ->
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

	@addItem 'bold',
		toggleable: true
		onClick: @poe.toolbarHelper.btnBoldClicked
		icon: _createIcon 'actions/format-text-bold.png'

	@addItem 'italic',
		toggleable: true
		onClick: @poe.toolbarHelper.btnItalicClicked
		icon: _createIcon 'actions/format-text-italic.png'

	@addItem 'underline',
		toggleable: true
		onClick: @poe.toolbarHelper.btnUnderlineClicked
		icon: _createIcon 'actions/format-text-underline.png'

	@addSeparator()

	@addItem 'alignLeft',
		toggleable: true
		onClick: @poe.toolbarHelper.btnAlignLeftClicked
		icon: _createIcon 'actions/format-justify-left.png'

	@addItem 'alignCenter',
		toggleable: true
		onClick: @poe.toolbarHelper.btnAlignCenterClicked
		icon: _createIcon 'actions/format-justify-center.png'

	@addItem 'alignRight',
		toggleable: true
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

	###for font in OSjs.API.getHandlerInstance().getConfig('Fonts').list
		console.log font
		@fontSelect.addItem font, font###

	@fontSizeSelect.setValue '12'

	@fontSelect.setValue OSjs.API.getHandlerInstance().getConfig('Fonts')['default']
	@poe.toolbarHelper.fontManager.loadDefaults()

Poe.OSjs.Toolbar.prototype.fontSizeClicked = (selectRef, event, value) ->
	self.poe.toolbarHelper.fontSizeClicked self.fontSizeSelect.getValue()

Poe.OSjs.Toolbar.prototype.fontSelectClicked = (selectRef, event, value) ->
	self.poe.toolbarHelper.fontClicked self.fontSelect.getValue()
