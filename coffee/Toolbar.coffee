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
    @textStyle = @writer.document.textCursor.textStyle
    @textStyle.changed @styleChanged
    @element = $ '.toolbar'
    @elements =
      bold: $ '.bold'
      italic: $ '.italic'
      underline: $ '.underline'

      font: $ '#font-select .text'
      fontSize: $ '#font-size-select .text'
      color: $ '#color-pick'

    # Go ahead and update to match first word
    @styleChanged @textStyle
    @elements.bold.click @clickToggle
    @elements.italic.click @clickToggle
    @elements.underline.click @clickToggle

    $('body').keydown @handleShortcut

  ###
  A callback given to Poe.TextCursor.textStyle.
  @see Poe.TextStyle#changed
  @param style [Poe.TextStyle] the style to update the toolbar with
  ###
  styleChanged: (style) =>
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
    @styleChanged @textStyle

  ###
  A even handler for toolbar shortcuts. Returns immediately if
  the control key is not pressed.
  @param event [MouseDownEvent] the event
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
      @styleChanged @textStyle

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
