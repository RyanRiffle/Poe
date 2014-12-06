###
Poe.LineStyle handles any kind of style that should
be applied to a Poe.Line.
###
class Poe.LineStyle extends Poe.Style
  constructor: (@textCursor) ->
    # This stuff is the default style
    @align = Poe.LineStyle.Align.Left
    @changedCallbacks = []

  ###
  Makes this style the same as style
  @throw [Error] Error if style is not a Poe.LineStyle
  @param style [Poe.LineStyle] the style to clonse
  @return [Poe.LineStyle] this
  ###
  clone: (style) ->
    if not style instanceof Poe.LineStyle
      throw new Error('Poe.LineStyle cannot clone antyhing but a instance of Poe.LineStyle')
    @align = style.align
    return this

  ###
  Apply style to line.
  @throws [Error] if line is not a Poe.Line
  @param line [Poe.Line] Optional. Defaults to textCursor.currentLine.
  @return [Poe.LineStyle] this
  ###
  apply: (line) ->
    if not line and @textCursor
      line = @textCursor.currentLine()

    if not line instanceof Poe.Line
      throw new Error('Argument must be a Poe.Line')

    line.element.removeClass(Poe.LineStyle.Align.Left)
    line.element.removeClass(Poe.LineStyle.Align.Center)
    line.element.removeClass(Poe.LineStyle.Align.Right)
    line.element.removeClass(Poe.LineStyle.Align.Justify)

    line.element.addClass @align
    @hasChanged()
    return this

  update: (line) ->
    if not line and @textCursor
      line = @textCursor.currentLine()

    if not line instanceof Poe.Line
      throw new Error('Argument must be a Poe.Line')

    element = line.element
    if element.hasClass Poe.LineStyle.Align.Left
      @align = Poe.LineStyle.Align.Left
    else if element.hasClass Poe.LineStyle.Align.Center
      @align = Poe.LineStyle.Align.Center
    else if element.hasClass Poe.LineStyle.Align.Right
      @align = Poe.LineStyle.Align.Right
    else if element.hasClass Poe.LineStyle.Align.Justify
      @align = Poe.LineStyle.Align.Justify

    @hasChanged()

  ###
  "Enum" of line alignments
  ###
  @Align =
    Left: 'align-left'
    Center: 'align-center'
    Right: 'align-right'
    Justify: 'align-justify'
