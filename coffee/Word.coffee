class Poe.Word extends Poe.TextObject
  constructor: (text) ->
    @element = $ '<span class="word"></span>'
    $('body').append(@element)
    @append text if typeof text == 'string'

  append: (text) ->
    @element.append $(text)
    return this

  prepend: (text) ->
    @element.prepend $(text)
    return this

  text: ->
    ret = $ @element[0].childNodes
    return ret

  index: ->
    @parent.children.indexOf this

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
    return this

  setParent: (parent) ->
    return this if not parent
    @parent.children.remove this if @parent
    @parent = parent
    return this
