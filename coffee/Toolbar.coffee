class Poe.ToolBar
  constructor: (@writer) ->
    if not @writer
      throw new Error('new Poe.Toolbar takes exactly one argument of type Poe.Writer')
    @textStyle = @writer.document.textCursor.textStyle
    @textStyle.changed @styleChanged
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

  styleChanged: (style) =>
    @textStyle = style
    @activate @elements.bold, style.bold
    @activate @elements.italic, style.italic
    @activate @elements.underline, style.underline

    @elements.font.html style.font
    @elements.fontSize.html style.fontSize
    @elements.color.css 'background-color', style.color

  activate: (toolItem, isTrue) ->
    if isTrue
      toolItem.addClass 'active'
    else
      toolItem.removeClass 'active'

  clickToggle: (event) =>
    if event.target == @elements.bold[0]
      @textStyle.bold = !@textStyle.bold
    else if event.target == @elements.italic[0]
      @textStyle.italic = !@textStyle.italic
    else if event.target == @elements.underline[0]
      @textStyle.underline = !@textStyle.underline

    @textStyle.applyChar()
    @styleChanged @textStyle

  handleShortcut: (event) =>
    if (event.ctrlKey)
      event.preventDefault()
    else
      return

    switch event.keyCode
      when Poe.key.B
        @toggle @elements.bold
      when Poe.key.I
        @toggle @elements.italic
      when Poe.key.U
        @toggle @elements.underline

  toggle: (button) ->
    button.toggleClass 'active'
    if button == @elements.bold
      @textStyle.bold = !@textStyle.bold
    else if button == @elements.italic
      @textStyle.italic = !@textStyle.italic
    else if button == @elements.underline
      @textStyle.underline = !@textStyle.underline

    @textStyle.applyChar()
    @styleChanged @textStyle
