###
Poe.ToolBar handles items on the Writer's toolbar. It uses the {Poe.TextCursor}
provided by Poe.Writer.document to apply styles to the text.

@todo Make Poe.ToolBar create all of the elements itself.
###
class Poe.ToolBar
	###
	Creates a new Poe.ToolBar instance.
	###
	constructor: (@writer) ->
		if not @writer
			throw new Error('new Poe.ToolBar takes exactly one argument of type Poe.Writer')
		@element = $ '.toolbar'
		@textCursor = @writer.document.textCursor
		@textStyle = @textCursor.textStyle

		@paragraphStyle = @textCursor.paragraphStyle
		@paragraphStyle.changed @paragraphStyleChanged

		# Create the Page size dropdown. This uses the enum Poe.Document.PageSize to populate
		# the dropdown items
		@pageSizeDropdown = new Poe.Dropdown(this, 'Letter', 'Page Size')
		for key, value of Poe.Document.PageSize
			@pageSizeDropdown.addItem key
		@pageSizeDropdown.on 'itemClicked', @handlePageSize

		# The fonts for this are added when the Poe.FontManager gets a new font
		@dropFonts = new Poe.Dropdown(this, 'Tinos', 'Change Font')
		# Some formatting. I do this because I would like for the toolbar to be self contained without
		# being in the index.html file
		@dropFonts.button.css 'width', '125px'
		@dropFonts.text.css 'float', 'left'
		@dropFonts.css 'width', '200px'

		@dropFontSize = new Poe.Dropdown(this, '12', 'Font Size')
		@dropFontSize.addCaret()
		@dropFontSize.addItem 8
		@dropFontSize.addItem 9
		@dropFontSize.addItem 10
		@dropFontSize.addItem 11
		@dropFontSize.addItem 12
		@dropFontSize.addItem 14
		@dropFontSize.addItem 18
		@dropFontSize.addItem 24
		@dropFontSize.addItem 30
		@dropFontSize.addItem 36
		@dropFontSize.addItem 48
		@dropFontSize.addItem 60
		@dropFontSize.addItem 72
		@dropFontSize.addItem 96

		colorItems = []
		colors = ['black', '#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f', '#555', '#777']
		@dropColor = new Poe.Dropdown(this, '', '')
		colorItems.push @dropColor.addItem("")
		colorItems.push @dropColor.addItem("")
		colorItems.push @dropColor.addItem("")
		colorItems.push @dropColor.addItem("")
		colorItems.push @dropColor.addItem("")
		colorItems.push @dropColor.addItem("")
		colorItems.push @dropColor.addItem("")
		colorItems.push @dropColor.addItem("")
		colorItems.push @dropColor.addItem("")

		@dropColor.button.remove()
		@dropColor.button = $ '<span style="padding-left: 4px" class="dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">&nbsp;</span>'
		@dropColor.container.prepend @dropColor.button
		@dropColor.button.css 'background-color', 'black'
		@dropColor.button.css 'padding-left', '15px'
		@dropColor.childContainer.css 'width', '200px'
		@dropColor.button.css 'border-radius', '3px'
		@dropColor.button.css 'float', 'right'

		for i in [0..colorItems.length]
			if !colorItems[i]
				continue
			a = colorItems[i].children('a')
			colorItems[i].css 'float', 'left'
			a.addClass 'color-list-item'
			a.css 'background-color', colors[i]
		@dropFonts.button.append @dropColor.element()

		@btnBold = new Poe.Button(this, '<b>B</b>')
		@btnItalic = new Poe.Button(this, '<i>I</i>')
		@btnUnderline = new Poe.Button(this, '<u>U</u>')
		@groupTextFormat = new Poe.ButtonGroup(this, [@btnBold, @btnItalic, @btnUnderline])

		@btnAlignLeft = new Poe.Button(this)
		@btnAlignCenter = new Poe.Button(this)
		@btnAlignRight = new Poe.Button(this)
		@btnAlignJustify = new Poe.Button(this)
		iconAlignLeft = new Poe.Glyphicon('align-left')
		iconAlignCenter = new Poe.Glyphicon('align-center')
		iconAlignRight = new Poe.Glyphicon('align-right')
		iconAlignJustify = new Poe.Glyphicon('align-justify')
		@btnAlignLeft.setIcon iconAlignLeft
		@btnAlignCenter.setIcon iconAlignCenter
		@btnAlignRight.setIcon iconAlignRight
		@btnAlignJustify.setIcon iconAlignJustify
		@groupParagraphAlign = new Poe.ButtonGroup(this, [@btnAlignLeft, @btnAlignCenter, @btnAlignRight, @btnAlignJustify])
		@groupParagraphAlign.setRadio true

		@dropLineSpacing = new Poe.Dropdown(this, 'LS', 'Line Spacing')
		@dropLineSpacing.addItem('1')
		@dropLineSpacing.addItem('1.5')
		@dropLineSpacing.addItem('2')

		@btnListBullet = new Poe.Button(this)
		@btnListNumber = new Poe.Button(this)
		iconListBullet = new Poe.Glyphicon('list')
		iconListNumber = new Poe.Glyphicon('list-alt')
		@btnListBullet.setIcon iconListBullet
		@btnListNumber.setIcon iconListNumber
		@groupList = new Poe.ButtonGroup(this, [@btnListBullet, @btnListNumber])

		@dropFonts.on 'itemClicked', @handleFontClick
		@dropFontSize.on 'itemClicked', @handleFontSizeClick

		@btnBold.on 'click', @writer.toolbarHelper.btnBoldClicked
		@btnItalic.on 'click', @writer.toolbarHelper.btnItalicClicked
		@btnUnderline.on 'click', @writer.toolbarHelper.btnUnderlineClicked

		@btnAlignLeft.on 'click', @writer.toolbarHelper.btnAlignLeftClicked
		@btnAlignCenter.on 'click', @writer.toolbarHelper.btnAlignCenterClicked
		@btnAlignRight.on 'click', @writer.toolbarHelper.btnAlignRightClicked
		@btnAlignJustify.on 'click', @writer.toolbarHelper.btnAlignJustifyClicked

		@btnListBullet.on 'click', @btnListBulletClicked
		@btnListNumber.on 'click', @btnListNumberClicked
		@dropColor.on 'itemClicked', @handleColorClicked

		@dropLineSpacing.on 'itemClicked', @handleLineSpacingClicked


		#@elements is for the dynamic toolbar
		@elements =
			dynamic: $ '#dynamic .text'

		# Items on the Paragraph toolbar
		@elements.Paragraph =
			fonts: @dropFonts
			fontSize: @dropFontSize
			textFormatting: @groupTextFormat
			alignment: @groupParagraphAlign
			lists: @groupList
			lineSpacing: @dropLineSpacing

		# Items on the Page toolbar
		@elements.Page =
			pageSize: @pageSizeDropdown

		# Items on the List toolbar
		@elements.List =
			fonts: @dropFonts
			fontSize: @dropFontSize
			textFormatting: @groupTextFormat
			alignment: @groupParagraphAlign
			removeItem: $ '#list-RemoveItem'

		$('#print-pdf').click @handlePDF
		$('#dynamic-list li a').click @handleDynamicToolBar

		# Add the event handler for fonts being added, and call init which loads the fonts
		@writer.toolbarHelper.addEventHandler('fontAdded', @fontAdded)
		@writer.toolbarHelper.init()

		# Loop through and hide every toolbar item.
		# That way when the toolbar is set below it will only have
		# the correct items.
		@currentToolBar = ''
		for key, value of Poe.ToolBar.DynamicPart
			for key, elm of @elements[value]
				if elm
					elm.hide()

		# Set the current toolbar to show paragraph items
		@setToolBar Poe.ToolBar.DynamicPart.Paragraph

		#Register handlers for when the text/paragraph style changed
		@writer.toolbarHelper.addEventHandler 'textStyleChanged', @textStyleChanged
		@writer.toolbarHelper.addEventHandler 'paragraphStyleChanged', @paragraphStyleChanged

		# Go ahead and update to match first word
		@textStyleChanged @textStyle
		@paragraphStyleChanged @paragraphStyle

	@DynamicPart =
		Paragraph: 'Paragraph'
		List: 'List'
		Page: 'Page'

	###
	Sets the current toolbar to the
	###
	setToolBar: (dynamicPart) ->
		if dynamicPart == @currentToolBar
			return

		oldToolBar = @currentToolBar
		for key, value of Poe.ToolBar.DynamicPart
			if value == dynamicPart
				@elements.dynamic.html(dynamicPart)
				@currentToolBar = dynamicPart
				break

		for key, value of @elements[oldToolBar]
			value.hide()

		for key, value of @elements[@currentToolBar]
			value.show()

	handleDynamicToolBar: (event) =>
		name = $(event.target).html()
		@setToolBar name

	handlePageSize: (event) =>
		text = $(event.target).html()
		size = Poe.Document.PageSize[text]

		if size
			@writer.document.setPageSize(size)
			@pageSizeDropdown.setText text

	###
	A callback given to Poe.TextCursor.textStyle.
	@see Poe.TextStyle#changed
	@param style [Poe.TextStyle] the style to update the toolbar with
	@private
	###
	textStyleChanged: (style) =>
		activate = (toolItem, isTrue) ->
			if isTrue
				toolItem.addClass 'active'
			else
				toolItem.removeClass 'active'

		@textStyle = style
		@btnBold.active style.bold
		@btnItalic.active style.italic
		@btnUnderline.active style.underline

		@dropFonts.setText style.font
		@dropFontSize.setText style.fontSize
		@dropColor.button.css 'background-color', style.color

	###
	Event handler for when a new font is clicked. Updates
	the current style and applies the style
	@param event [MouseClickEvent] the event that happened.
	@private
	###
	handleFontClick: (event) =>
		name = $(event.target).html()
		@dropFonts.setText(name)
		@writer.toolbarHelper.fontClicked name

	###
	Event handler for when a font size is clicked. This uses {Poe.ToolBarHelper}
	@param event [MouseClickEvent] the event that triggered the callback
	@private
	###
	handleFontSizeClick: (event) =>
		name = $(event.target).html()
		@dropFontSize.setText name
		@writer.toolbarHelper.fontSizeClicked name

	###
	Called when the line style changes of the {Poe.TextCursor}
	@param style [Poe.ParagraphStyle] the style that has changed
	@private
	###
	paragraphStyleChanged: (style) =>
		@btnAlignLeft.active false
		@btnAlignCenter.active false
		@btnAlignRight.active false
		@btnAlignJustify.active false

		switch style.align
			when Poe.ParagraphStyle.Align.Left
				@btnAlignLeft.active true
			when Poe.ParagraphStyle.Align.Center
				@btnAlignCenter.active true
			when Poe.ParagraphStyle.Align.Right
				@btnAlignRight.active true
			when Poe.ParagraphStyle.Align.Justify
				@btnAlignJustify.active true

	handleColorClicked: (event) =>
		event.stopPropagation()
		target = $(event.target)
		color = target.css 'background-color'

		@dropColor.button.css 'background-color', color
		@writer.toolbarHelper.colorClicked color
		# HACK: This fixes fonts popping up after a color is clicked
		@element.click()

	btnListBulletClicked: =>
		@writer.toolbarHelper.createList(Poe.List.ListType.Bullets)

	btnListNumberClicked: =>
		@writer.toolbarHelper.createList(Poe.List.ListType.Numbers)

	handlePDF: (event) =>
		@writer.document.pdf.generate()

	fontAdded: (name) =>
		li = @elements.Paragraph.fonts.addItem(name)
		li.css('font-family', "'#{name}'")

	handleLineSpacingClicked: (event) =>
		event.stopPropagation()
		target = $(event.target)
		size = parseFloat(target.html())
		cursor = @writer.document.textCursor
		pstyle = cursor.paragraphStyle
		pstyle.setLineSpacing size
		pstyle.apply()
		@dropLineSpacing.childContainer.blur()
