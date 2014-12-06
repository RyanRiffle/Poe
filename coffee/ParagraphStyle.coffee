###
Poe.ParagraphStyle handles any kind of style that should
be applied to a Poe.Line.
###
class Poe.ParagraphStyle extends Poe.Style
  constructor: (@textCursor) ->
    # This stuff is the default style
    @align = Poe.ParagraphStyle.Align.Left
    @changedCallbacks = []

  ###
  Makes this style the same as style
  @throw [Error] Error if style is not a Poe.ParagraphStyle
  @param style [Poe.ParagraphStyle] the style to clonse
  @return [Poe.ParagraphStyle] this
  ###
  clone: (style) ->
    if not style instanceof Poe.ParagraphStyle
      throw new Error('Poe.ParagraphStyle cannot clone antyhing but a instance of Poe.ParagraphStyle')
    @align = style.align
    return this

  ###
  Apply style to line.
  @throws [Error] if line is not a Poe.Line
  @param line [Poe.Line] Optional. Defaults to textCursor.currentLine.
  @return [Poe.ParagraphStyle] this
  ###
  apply: (line) ->
    if not line and @textCursor
      line = @textCursor.currentLine()

    if not line instanceof Poe.Line
      throw new Error('Argument must be a Poe.Line')

    line.parent.element.attr 'align', @align
    @hasChanged()
    return this

  update: (line) ->
    if not line and @textCursor
      line = @textCursor.currentLine()

    if not line instanceof Poe.Line
      throw new Error('Argument must be a Poe.Line')

    element = line.parent.element
    if element.attr('align') == Poe.ParagraphStyle.Align.Left
      @align = Poe.ParagraphStyle.Align.Left
    else if element.attr('align') == Poe.ParagraphStyle.Align.Center
      @align = Poe.ParagraphStyle.Align.Center
    else if element.attr('align') == Poe.ParagraphStyle.Align.Right
      @align = Poe.ParagraphStyle.Align.Right
    else if element.attr('align') == Poe.ParagraphStyle.Align.Justify
      @align = Poe.ParagraphStyle.Align.Justify

    @hasChanged()

  ###
  "Enum" of line alignments
  ###
  @Align =
    Left: 'left'
    Center: 'center'
    Right: 'right'
    Justify: 'justify'
