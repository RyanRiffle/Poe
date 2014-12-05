class Poe.TextStyle
  ###
  Copy constructor
  ###
  constructor: (@textCursor) ->
    @bold = false
    @italic = false
    @underline = false
    @font = 'Tinos'
    @fontSize = 16 #Pixels
    @color = 'black' #css
    @backround = 'white'
    @changedCallbacks = []
    @currentWord = null

  clone: (style) ->
    @bold = style.bold
    @italic = style.italic
    @underline = style.underline
    @font = style.font
    @fontSize = style.fontSize
    @color = style.color
    @background = style.background

  apply: (wholeWord = false, word = @currentWord) ->
    element = word.element
    if not word or not element
      throw new Error('Expected exactly one argument of type Poe.Word got #{word}')

    if not wholeWord
      word = @textCursor.currentWord
      otherStyle = new Poe.TextStyle()
      otherStyle.update word
      newWord = new Poe.Word()
      newWord.insertAfter word
      while @textCursor.element.nextSibling()
        newWord.element.append @textCursor.element.nextSibling()
      newWord.prepend @textCursor.element

      middleWord = new Poe.Word()
      middleWord.insertAfter word
      @textCursor.currentWord = middleWord
      if word.isEmpty()
        word.remove()
      if newWord.isEmpty()
        newWord.remove()
      else
        otherStyle.apply newWord

      otherStyle = null
      element = middleWord.element
      word = middleWord
      element.prepend @textCursor.element

    if @bold
      element.addClass 'bold'
    else
      element.removeClass 'bold'

    if @italic
      element.addClass 'italic'
    else
      element.removeClass 'italic'

    if @underilne
      element.addClass 'underline'
    else
      element.removeClass 'underline'

    apply = (style, value) ->
      element.css(style, value)

    apply 'font-family', '"' + @font + '"'
    apply 'font-size', "#{@fontSize}px"
    apply 'color', @color
    apply 'background-color', @background
    @currentWord = word

  ###
  This is mainly for the toolbar's use, it makes text typed after this
  function have the new style
  ###
  applyChar: (word = @currentWord) ->
    @apply false, word
    return this

  ###
  applyWordStyle applies this style to the whole word
  ###
  applyWord: (word) ->
    @apply true, word
    return this

  update: (word) ->
    element = word.element
    if not word or not element
      return

    if element.css('font-weight') == 'bold'
      @bold = true
    else
      @bold = false

    if element.css('font-style') == 'italic'
      @italic = true
    else
      @italic = false

    if element.css('text-decoration') == 'underline'
      @underline = true
    else
      @underline = false

    @font = element.css('font-family').split('"')[0]
    @fontSize = parseInt(element.css('font-size'))
    @color = element.css('color')
    @background = element.css('background-color')

    @currentWord = word
    for callback in @changedCallbacks
      callback this

  changed: (callbackFn) ->
    if typeof(callbackFn) != 'function'
      throw new Error('Poe.TextStyle.changed expects one argument of type function')

    @changedCallbacks.append callbackFn
