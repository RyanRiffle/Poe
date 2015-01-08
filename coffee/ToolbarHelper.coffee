class Poe.ToolbarHelper
	constructor: (@writer) ->
		if not @writer
			throw new Error('Poe.ToolbarHelper takes exactly one argument of type Poe.Writer')
		@textCursor = @writer.document.textCursor
		@textStyle = @textCursor.textStyle
		@paragraphStyle = @textCursor.paragraphStyle

		@fontSizes = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96]
		@colors = ['black', '#428bca', '#5cb85c', '#5bc0de', '#f0ad4e', '#d9534f', '#555', '#777']

		@fontManager = new Poe.FontManager()
		$('body').keydown @handleShortcut

	init: () ->
		@fontManager.loadDefaults()

	###
	Add an event handler. This is just a helper function that sets up events for
	the Poe.TextCursor and Poe.FontManager

	Valid events are:
	textStyleChanged - Called when the text formatting has changed. fn(Poe.TextStyle)
	paragraphStyleChanged - Called when the paragraph style changed. fn(Poe.ParagraphStyle)
	fontAdded - Called when a font has been added. fn(FontName)
	###
	addEventHandler: (event, callback) ->
		switch (event)
			when 'textStyleChanged'
				@textStyle.changed callback
			when 'paragraphStyleChanged'
				@paragraphStyle.changed callback
			when 'fontAdded'
				@fontManager.on 'newFont', callback

	handlePageSize: (sizeName) =>
		size = Poe.Document.PageSize[sizeName]

		if !sizeName
			console.log "[POE ERROR]: Invalid page size `#{sizeName}`"
			return

		@writer.document.setPageSize(size)

	btnBoldClicked: () =>
		@textStyle.bold = !@textStyle.bold
		@textStyle.applyChar()

	btnItalicClicked: () =>
		@textStyle.italic = !@textStyle.italic
		@textStyle.applyChar()

	btnUnderlineClicked: =>
		@textStyle.underline = !@textStyle.underline
		@textStyle.applyChar()

	handleShortcut: (event) =>
		if not event.ctrlKey
			return

		toggle = (button) =>
			if button == 'bold'
				@textStyle.bold = !@textStyle.bold
			else if button == 'italic'
				@textStyle.italic = !@textStyle.italic
			else if button == 'underline'
				@textStyle.underline = !@textStyle.underline

			@textStyle.applyChar()

		switch event.keyCode
			when Poe.key.B
				event.preventDefault()
				toggle 'bold'
			when Poe.key.I
				event.preventDefault()
				toggle 'italic'
			when Poe.key.U
				event.preventDefault()
				toggle 'underline'
			else
				event.preventDefault()

	fontClicked: (fontName) =>
		@textStyle.font = fontName
		@textStyle.applyChar()

	###
	Paragraph alignment button helpers
	###
	fontSizeClicked: (size) =>
		@textStyle.fontSize = parseInt(size.replace('px', ''))
		@textStyle.applyChar()

	btnAlignLeftClicked: =>
		@paragraphStyle.align = Poe.ParagraphStyle.Align.Left
		@paragraphStyle.apply()

	btnAlignCenterClicked: =>
		@paragraphStyle.align = Poe.ParagraphStyle.Align.Center
		@paragraphStyle.apply()

	btnAlignRightClicked: =>
		@paragraphStyle.align = Poe.ParagraphStyle.Align.Right
		@paragraphStyle.apply()

	btnAlignJustifyClicked: =>
		@paragraphStyle.align = Poe.ParagraphStyle.Align.Justify
		@paragraphStyle.apply()

	colorClicked: (color) =>
		@textStyle.color = color
		@textStyle.applyChar()

	btnListBulleftClicked: () =>
		@createList Poe.List.ListType.Bullets

	btnListNumberClicked: () =>
		@createList Poe.List.ListType.Numbers

	createList: (type) ->
		list = new Poe.List()
		list.setListType type

		paragraph = @textCursor.currentParagraph()
		if (paragraph instanceof Poe.List)
			paragraph.append list
		else
			list.insertAfter paragraph
		@textCursor.moveInside list.child(0).child(0)
		@textStyle.applyChar()
