###
Poe.Word is the base of all text in the document. With no formatting
in the document and only text, each Poe.Word contains one text word
followed by a space. However once formatting comes in words are split
and that is not always the case.
###
class Poe.Word extends Poe.TextObject
  ###
  Creates a new Poe.Word.
  @param text [String] optional text to put in word
  ###
  constructor: (text) ->
    @element = $ '<span class="word"></span>'
    $('body').append(@element)
    @append text if typeof text == 'string'

  ###
  Appends a string to the word.
  @param text [String] the string to append
  @return [Poe.Word] this
  ###
  append: (text) ->
    for i in [0..text.length]
      @element.append $(text[i])
    return this

  ###
  Prepends a string to the word.
  @param text [String] the string to prepend
  @return [Poe.Word] this
  ###
  prepend: (text) ->
    for i in [0..text.length]
      @element.prepend $(text[i])
    return this

  ###
  Gets and returns the child nodes of the word.
  @note This could include the Poe.TextCursor
  @return [jQuery] jQuery object of all child nodes
  ###
  children: ->
    ret = $ @element[0].childNodes
    return ret

  child: (index) ->
    if index >= 0 && index < @element[0].childNodes.length
      return $ @element[0].childNodes[index]
    return null

  isEmpty: ->
    if @children().length == 0
      return true

    if @children().length == 1 && !@child(0).hasClass('textcursor') && @child(0)[0].textContent.charCodeAt(0) == 8203
      return true

    return false