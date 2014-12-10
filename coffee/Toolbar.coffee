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
      dynamic: $ '#dynamic .text'

    @elements.Paragraph =
      bold: $ '.bold'
      italic: $ '.italic'
      underline: $ '.underline'

      fonts: $ '#font-list'
      font: $ '#font-select .text'
      fontSize: $ '#font-size-select .text'
      color: $ '#color-pick'

      bullet: $ '#list-bullet'
      number: $ '#list-number'

      alignleft: $ '#align-left'
      aligncenter: $ '#align-center'
      alignright: $ '#align-right'
      alignjustify: $ '#align-justify'

    @elements.Page =
      Nothing: $()

    @elements.List =
      bold: @elements.Paragraph.bold
      italic: @elements.Paragraph.italic
      underline: @elements.Paragraph.underline

      color: @elements.Paragraph.color
      fonts: @elements.Paragraph.fonts
      font: @elements.Paragraph.font
      fontSize: @elements.Paragraph.fontSize

      alignleft: @elements.Paragraph.alignleft
      alignright: @elements.Paragraph.alignright
      aligncenter: @elements.Paragraph.aligncenter
      alignjustify: @elements.Paragraph.alignjustify
      removeItem: $ '#list-RemoveItem'

    # Go ahead and update to match first word
    @textStyleChanged @textStyle
    @paragraphStyleChanged @paragraphStyle
    @elements.Paragraph.bold.click @clickToggle
    @elements.Paragraph.italic.click @clickToggle
    @elements.Paragraph.underline.click @clickToggle

    $('body').keydown @handleShortcut
    $('#font-list').on 'click', 'li', @handleFontClick
    $('#font-size-list li').click @handleFontSizeClick
    $('#alignment button').click @handleTextAlignment
    $('#color-list .color-list-item').click @handleFontColor
    $('#lists button').click @handleList
    $('#print-pdf').click @handlePDF
    $('#dynamic-list li a').click @handleDynamicToolBar

    @fontManager = new Poe.FontManager()
    @fontManager.on('newFont', @fontAdded)
    @fontManager.loadDefaults()
    @currentToolBar = ''
    for key, value of Poe.ToolBar.DynamicPart
      for key, elm of @elements[value]
        if elm.parent()[0] == @element[0]
          elm.hide()
        else
          elm.parent().hide()

    @setToolBar Poe.ToolBar.DynamicPart.Paragraph

  @DynamicPart =
    Paragraph: 'Paragraph'
    List: 'List'
    Page: 'Page'

  setToolBar: (dynamicPart) ->
    console.log "Changing ToolBar: #{dynamicPart}"
    oldToolBar = @currentToolBar
    for key, value of Poe.ToolBar.DynamicPart
      if value == dynamicPart
        @elements.dynamic.html(dynamicPart)
        @currentToolBar = dynamicPart
        break

    if oldToolBar == @currentToolBar
      return

    for key, value of @elements[oldToolBar]
      if value.parent()[0] == @element[0]
        value.hide()
      else
        value.parent().hide()

    for key, value of @elements[@currentToolBar]
      if value.parent()[0] == @element[0]
        value.show()
      else
        value.parent().show()

  handleDynamicToolBar: (event) =>
    name = $(event.target).html()
    @setToolBar name

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
    activate @elements.Paragraph.bold, style.bold
    activate @elements.Paragraph.italic, style.italic
    activate @elements.Paragraph.underline, style.underline

    @elements.Paragraph.font.html style.font
    @elements.Paragraph.fontSize.html style.fontSize
    @elements.Paragraph.color.css 'background-color', style.color

  ###
  A event handler for when a button is clicked on the toolbar
  @param event [MouseClickEvent] the event that happend
  @private
  ###
  clickToggle: (event) =>
    if event.target == @elements.Paragraph.bold[0]
      @textStyle.bold = !@textStyle.bold
    else if event.target == @elements.Paragraph.italic[0]
      @textStyle.italic = !@textStyle.italic
    else if event.target == @elements.Paragraph.underline[0]
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
      if button == @elements.Paragraph.bold
        @textStyle.bold = !@textStyle.bold
      else if button == @elements.Paragraph.italic
        @textStyle.italic = !@textStyle.italic
      else if button == @elements.Paragraph.underline
        @textStyle.underline = !@textStyle.underline

      @textStyle.applyChar()
      @textStyleChanged @textStyle

    switch event.keyCode
      when Poe.key.B
        event.preventDefault()
        toggle @elements.Paragraph.bold
      when Poe.key.I
        event.preventDefault()
        toggle @elements.Paragraph.italic
      when Poe.key.U
        event.preventDefault()
        toggle @elements.Paragraph.underline
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
    @elements.Paragraph.font.html(name)
    @textStyle.font = name
    @textStyle.applyChar()

  ###
  Event handler for when a font size is clicked.
  @param event [MouseClickEvent] the event that triggered the callback
  @private
  ###
  handleFontSizeClick: (event) =>
    name = $(event.target).html()
    @elements.Paragraph.fontSize.html(parseInt(name.replace('px', '')))
    @textStyle.fontSize = parseInt(name.replace('px', ''))
    @textStyle.applyChar()

  ###
  Called when the line style changes of the {Poe.TextCursor}
  @param style [Poe.ParagraphStyle] the style that has changed
  @private
  ###
  paragraphStyleChanged: (style) =>
    @elements.Paragraph.alignleft.removeClass('active')
    @elements.Paragraph.aligncenter.removeClass('active')
    @elements.Paragraph.alignright.removeClass('active')
    @elements.Paragraph.alignjustify.removeClass('active')

    switch style.align
      when Poe.ParagraphStyle.Align.Left
        element = @elements.Paragraph.alignleft
      when Poe.ParagraphStyle.Align.Center
        element = @elements.Paragraph.aligncenter
      when Poe.ParagraphStyle.Align.Right
        element = @elements.Paragraph.alignright
      when Poe.ParagraphStyle.Align.Justify
        element = @elements.Paragraph.alignjustify

    element.addClass 'active'

  ###
  Event handler for text align buttons in the toolbar.
  @param event [MouseClickEvent] the event that triggered this callback
  @private
  ###
  handleTextAlignment: (event) =>
    target = event.target
    if target == @elements.Paragraph.alignleft[0]
      @paragraphStyle.align = Poe.ParagraphStyle.Align.Left
    else if target == @elements.Paragraph.aligncenter[0]
      @paragraphStyle.align = Poe.ParagraphStyle.Align.Center
    else if target == @elements.Paragraph.alignright[0]
      @paragraphStyle.align = Poe.ParagraphStyle.Align.Right
    else if target == @elements.Paragraph.alignjustify[0]
      @paragraphStyle.align = Poe.ParagraphStyle.Align.Justify

    @paragraphStyle.apply()

  ###
  Event handler for text color.
  @param
  ###
  handleFontColor: (event) =>
    target = $(event.target)
    color = target.css 'background-color'

    @elements.Paragraph.color.css 'background-color', color
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
    if target == @elements.Paragraph.bullet[0]
      list.setListType Poe.List.ListType.Bullets
    else if target == @elements.Paragraph.number[0]
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
    @elements.Paragraph.fonts.append item
    item.children('a').css('font-family', name)