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
      throw new Error('new Poe.Toolbar takes exactly one argument of type Poe.Writer')
    @textCursor = @writer.document.textCursor
    @textStyle = @textCursor.textStyle
    @textStyle.changed @textStyleChanged

    @paragraphStyle = @textCursor.paragraphStyle
    @paragraphStyle.changed @paragraphStyleChanged

    @element = $ '.toolbar'
    @elements =
      bold: $ '.bold'
      italic: $ '.italic'
      underline: $ '.underline'

      fonts: $ '#font-list'
      font: $ '#font-select .text'
      fontSize: $ '#font-size-select .text'
      color: $ '#color-pick'

      list:
        bullet: $ '#list-bullet'
        number: $ '#list-number'

      align:
        left: $ '#align-left'
        center: $ '#align-center'
        right: $ '#align-right'
        justify: $ '#align-justify'

    # Go ahead and update to match first word
    @textStyleChanged @textStyle
    @paragraphStyleChanged @paragraphStyle
    @elements.bold.click @clickToggle
    @elements.italic.click @clickToggle
    @elements.underline.click @clickToggle

    $('body').keydown @handleShortcut
    $('#font-list').on 'click', 'li', @handleFontClick
    $('#font-size-list li').click @handleFontSizeClick
    $('#alignment button').click @handleTextAlignment
    $('#color-list .color-list-item').click @handleFontColor
    $('#lists button').click @handleList
    $('#print-pdf').click @handlePDF

    @fontManager = new Poe.FontManager()
    @fontManager.on('newFont', @fontAdded)
    @fontManager.loadDefaults()

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
    activate @elements.bold, style.bold
    activate @elements.italic, style.italic
    activate @elements.underline, style.underline

    @elements.font.html style.font
    @elements.fontSize.html style.fontSize
    @elements.color.css 'background-color', style.color

  ###
  A event handler for when a button is clicked on the toolbar
  @param event [MouseClickEvent] the event that happend
  @private
  ###
  clickToggle: (event) =>
    if event.target == @elements.bold[0]
      @textStyle.bold = !@textStyle.bold
    else if event.target == @elements.italic[0]
      @textStyle.italic = !@textStyle.italic
    else if event.target == @elements.underline[0]
      @textStyle.underline = !@textStyle.underline

    @textStyle.applyChar()
    @textStyleChanged @textStyle

  ###
  A even handler for toolbar shortcuts. Returns immediately if
  the control key is not pressed.
  @param event [MouseDownEvent] the event
  @private
  ###
  handleShortcut: (event) =>
    if not event.ctrlKey
      return

    toggle = (button) =>
      button.toggleClass 'active'
      if button == @elements.bold
        @textStyle.bold = !@textStyle.bold
      else if button == @elements.italic
        @textStyle.italic = !@textStyle.italic
      else if button == @elements.underline
        @textStyle.underline = !@textStyle.underline

      @textStyle.applyChar()
      @textStyleChanged @textStyle

    switch event.keyCode
      when Poe.key.B
        event.preventDefault()
        toggle @elements.bold
      when Poe.key.I
        event.preventDefault()
        toggle @elements.italic
      when Poe.key.U
        event.preventDefault()
        toggle @elements.underline
      else
        event.preventDefault()

  ###
  Event handler for when a new font is clicked. Updates
  the current style and applies the style
  @param event [MouseClickEvent] the event that happened.
  @private
  ###
  handleFontClick: (event) =>
    name = $(event.target).html()
    @elements.font.html(name)
    @textStyle.font = name
    @textStyle.applyChar()

  ###
  Event handler for when a font size is clicked.
  @param event [MouseClickEvent] the event that triggered the callback
  @private
  ###
  handleFontSizeClick: (event) =>
    name = $(event.target).html()
    @elements.fontSize.html(parseInt(name.replace('px', '')))
    @textStyle.fontSize = parseInt(name.replace('px', ''))
    @textStyle.applyChar()

  ###
  Called when the line style changes of the {Poe.TextCursor}
  @param style [Poe.ParagraphStyle] the style that has changed
  @private
  ###
  paragraphStyleChanged: (style) =>
    @elements.align.left.removeClass('active')
    @elements.align.center.removeClass('active')
    @elements.align.right.removeClass('active')
    @elements.align.justify.removeClass('active')

    switch style.align
      when Poe.ParagraphStyle.Align.Left
        element = @elements.align.left
      when Poe.ParagraphStyle.Align.Center
        element = @elements.align.center
      when Poe.ParagraphStyle.Align.Right
        element = @elements.align.right
      when Poe.ParagraphStyle.Align.Justify
        element = @elements.align.justify

    element.addClass 'active'

  ###
  Event handler for text align buttons in the toolbar.
  @param event [MouseClickEvent] the event that triggered this callback
  @private
  ###
  handleTextAlignment: (event) =>
    target = event.target
    if target == @elements.align.left[0]
      @paragraphStyle.align = Poe.ParagraphStyle.Align.Left
    else if target == @elements.align.center[0]
      @paragraphStyle.align = Poe.ParagraphStyle.Align.Center
    else if target == @elements.align.right[0]
      @paragraphStyle.align = Poe.ParagraphStyle.Align.Right
    else if target == @elements.align.justify[0]
      @paragraphStyle.align = Poe.ParagraphStyle.Align.Justify

    @paragraphStyle.apply()

  ###
  Event handler for text color.
  @param
  ###
  handleFontColor: (event) =>
    target = $(event.target)
    color = target.css 'background-color'

    @elements.color.css 'background-color', color
    @textStyle.color = color
    @textStyle.applyChar()

  ###
  Event handler for list buttons. Creates a new list when
  the button is clicked.
  @param event [MouseClickEvent] the event that triggered the function
  ###
  handleList: (event) =>
    target = event.target
    list = new Poe.List()
    if target == @elements.list.bullet[0]
      list.setListType Poe.List.ListType.Bullets
    else if target == @elements.list.number[0]
      list.setListType Poe.List.ListType.Numbers

    paragraph = @textCursor.currentParagraph()
    list.insertAfter @textCursor.currentParagraph()
    @textCursor.moveInside list.child(0).child(0)
    @textStyle.applyChar()

    if paragraph.isEmpty()
      paragraph.remove()

  handlePDF: (event) =>
    @writer.document.pdf.generate()

  fontAdded: (name) =>
    item = $("<li role='presentation'><a role='menuitem' tabindex='-1' href='#'>#{name}</a></li>")
    @elements.fonts.append item
    item.children('a').css('font-family', name)