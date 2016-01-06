###
Poe.ParagraphStyle handles any kind of style that should
be applied to a Poe.paragraph.
###
class Poe.ParagraphStyle extends Poe.Style
  ###
  Creates a new Poe.ParagraphStyle
  @param textCursor [Poe.TextCursor] the cursor that this style will operate on
  ###
  constructor: (@textCursor) ->
    # This stuff is the default style
    @align = Poe.ParagraphStyle.Align.Left
    @lineSpacing = 1
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
  Apply style to paragraph.
  @throws [Error] if paragraph is not a Poe.Paragraph
  @param paragraph [Poe.paragraph] Optional. Defaults to textCursor.currentparagraph.
  @return [Poe.ParagraphStyle] this
  ###
  apply: (paragraph) ->
    if not paragraph and @textCursor
      paragraph = @textCursor.currentParagraph()

    if not paragraph instanceof Poe.Paragraph
      throw new Error('Argument must be a Poe.paragraph')

    paragraph.element.attr 'x-lineSpacing', @lineSpacing
    for line in paragraph.children
        padding = @lineSpacing - 1
        padding *= line.height()
        console.log padding
        line.element.css 'padding-bottom', padding + 'px'

    paragraph.element.attr 'align', @align
    @hasChanged()
    return this

  ###
  Update this style with the style of paragraph. If paragraph is not
  specified it default to the textCursor's current paragraph if it has
  a textCursor
  @see Poe.Style#setTextCursor
  @see Poe.ParagraphStyle#constructor
  @param paragraph [Poe.Paragraph] the paragraph
  ###
  update: (paragraph) ->
    if not paragraph and @textCursor
      paragraph = @textCursor.currentParagraph()

    if not paragraph instanceof Poe.Paragraph
      throw new Error('Argument must be a Poe.paragraph')

    # Line spacing for that paragraph is stored as attribute x-lineSpacing
    @lineSpacing = paragraph.element.attr('x-lineSpacing')
    if typeof @lineSpacing == 'undefined'
      @lineSpacing = 1

    element = paragraph.element
    if element.attr('align') == Poe.ParagraphStyle.Align.Left
      @align = Poe.ParagraphStyle.Align.Left
    else if element.attr('align') == Poe.ParagraphStyle.Align.Center
      @align = Poe.ParagraphStyle.Align.Center
    else if element.attr('align') == Poe.ParagraphStyle.Align.Right
      @align = Poe.ParagraphStyle.Align.Right
    else if element.attr('align') == Poe.ParagraphStyle.Align.Justify
      @align = Poe.ParagraphStyle.Align.Justify

    @hasChanged()

  setLineSpacing: (spacing) ->
    @lineSpacing = spacing

  ###
  "Enum" of paragraph alignments
  ###
  @Align =
    Left: 'left'
    Center: 'center'
    Right: 'right'
    Justify: 'justify'
