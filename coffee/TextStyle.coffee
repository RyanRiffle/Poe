###
Poe.TextStyle is the used to apply font and text styles
to Poe.Word. You can apply a style to a word by using
applyWord. In order to change the style without affecting the
the whole word, e.g. for new text, the style needs to know
what Poe.TextCursor to use. In that case you can pass it in
the constructor or use setTextCursor().
###
class Poe.TextStyle extends Poe.Style
  ###
  Construct new TextStyle.
  TextStyle is used to apply formatting to a Poe.Word.

  @param [Poe.TextCursor] textCursor text cursor for use with applyChar
  @note It only uses the text cursor when applyChar is called. If you do not need
  to apply change the style that cursor is typing text in, it is not neccessary
  ###
  constructor: (@textCursor) ->
    @bold = false
    @italic = false
    @underline = false
    @font = 'Tinos'
    @fontSize = 12 #Points
    @color = 'black' #css
    @backround = 'white'
    @currentWord = null
    @changedCallbacks = []

  ###
  Copies style to this style
  @param [Poe.TextStyle] style the style to copy
  @return [Poe.TextStyle] this
  ###
  clone: (style) ->
    @bold = style.bold
    @italic = style.italic
    @underline = style.underline
    @font = style.font
    @fontSize = style.fontSize
    @color = style.color
    @background = style.background
    return this

  ###
  A helper that both applyWord and applyChar use
  @param [Boolean] wholeWord true to applyWord false to applyChar
  @param [Poe.Word] word the word to apply to. Only needed if using applyWord
  ###
  apply: (wholeWord = false, word = @currentWord) ->
    element = word.element

    if not wholeWord
      word = @textCursor.currentWord
      otherStyle = new Poe.TextStyle()
      otherStyle.update word
      lastWord = new Poe.Word()
      lastWord.insertAfter word
      while @textCursor.element.nextSibling()
        lastWord.element.append @textCursor.element.nextSibling()
      lastWord.prepend @textCursor.element

      middleWord = new Poe.Word()
      middleWord.insertAfter word
      otherStyle = null
      element = middleWord.element
      element.prepend @textCursor.element
      @textCursor.currentWord = middleWord
      if word.isEmpty()
        word.remove()
      if lastWord.isEmpty()
        lastWord.remove()
      else
        otherStyle.apply lastWord
      word = middleWord

    if @bold
      element.addClass 'bold'
    else
      element.removeClass 'bold'

    if @italic
      element.addClass 'italic'
    else
      element.removeClass 'italic'

    if @underline
      element.addClass 'underline'
    else
      element.removeClass 'underline'

    apply = (style, value) ->
      element.css(style, value)

    apply 'font-family', '"' + @font + '"'
    size = (@fontSize * 96) / 72;
    apply 'font-size', "#{size}px"
    apply 'color', @color
    apply 'background-color', @background
    @currentWord = word

    @hasChanged

    if @textCursor
      @textCursor.visibleCursor.css('height', "#{@fontSize}pt")
      @textCursor.update()
      if @italic
        @textCursor.visibleCursor.css('transform', 'rotate(10deg)')
      else
        @textCursor.visibleCursor.css('transform', 'none')


  ###
  Applies style so that any new text that is typed gets the style
  @return [Poe.TextStyle] this
  @note This requires a Poe.TextCursor to be known by the style. Use setTextCursor().
  @throw [Error] if there is no Poe.TextCursor to use
  ###
  applyChar: () ->
    if not @textCursor
      throw new Error('Poe.TextStyle.applyChar needs a textCursor')
    @apply false, @textCursor.currentWord
    return this

  ###
  Applies style to word. The whole word gets the style.
  This also calls any callbacks registered with changed.
  @param [Poe.Word] word word to apply style to
  @return [Poe.TextStyle] this
  ###
  applyWord: (word) ->
    if not word
      word = @textCursor.currentWord
    
    @apply true, word
    return this

  ###
  Makes this style match the style that word has.
  @param [Poe.Word] word word to get styles from
  @return [Poe.TextStyle] this
  ###
  update: (word) ->
    element = word.element
    if not word or not element
      return

    if element.hasClass 'bold'
      @bold = true
    else
      @bold = false

    if element.hasClass 'italic'
      @italic = true
    else
      @italic = false

    if element.hasClass 'underline'
      @underline = true
    else
      @underline = false

    @font = element.css('font-family').split('"')[0]
    @font = @font.replace("'", '').replace("'", '')
    @fontSize = Math.floor((parseInt(element.css('font-size')) * 72) / 96)
    @color = element.css('color')
    @background = element.css('background-color')

    if @textCursor
      @textCursor.visibleCursor.css('height', "#{@fontSize}pt")
      if @italic
        @textCursor.visibleCursor.css('transform', 'rotate(10deg)')
      else
        @textCursor.visibleCursor.css('transform', 'none')

    @currentWord = word
    @hasChanged()

    return this
