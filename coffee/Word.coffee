class Poe.Word extends Poe.TextObject
  constructor: (text) ->
    @element = $ '<span class="word"></span>'
    $('body').append(@element)
    @append text if typeof text == 'string'

  append: (text) ->
    @element.append $(text)

  prepend: (text) ->
    @element.prepend $(text)

  text: ->
    ret = $ @element[0].childNodes
    return ret

  insertAfter: (word) ->
    word.element.after(@element)
    @setParent word.parent
    @parent.children.insertAfter this, word
    return this

  insertBefore: (word) ->
    word.element.before(@element)
    @setParent word.parent
    @parent.children.insertBefore this, word
    return this

  next: ->
    return @parent.children.next this

  prev: ->
    prev = @parent.children.prev this
    return prev

  isEmpty: ->
    return @element[0].childNodes.length == 0

  remove: ->
    @element.remove()
    @parent.children.remove(this)

  setParent: (parent) ->
    return if not parent
    @parent.children.remove this if @parent
    @parent = parent
