class Poe.Line extends Poe.Checkable
  constructor: () ->
    @children = []
    @element = $ '<div class="line"></div>'
    @parent = null
    $('body').append(@element)
    @append new Poe.Word()

  ###
  word returns the child word at index
  ###
  child: (index) ->
    return @children[index] if index >= 0 && index <= @children.length - 1
    return null

  ###
  insertBefore nserts this before line
  ###
  insertBefore: (line) ->
    @setParent line.parent
    @parent.children.insertBefore this, line
    line.element.before @element
    return this

  ###
  insertAfter inserts this after line
  ###
  insertAfter: (line) ->
    @setParent line.parent
    @parent.children.insertAfter this, line
    line.element.after @element
    return this

  ###
  prepend adds word to the front of the line
  ###
  prepend: (word) ->
    @children.prepend word
    @element.prepend word.element
    word.setParent this
    return this

  ###
  append adds word to the end of the line
  ###
  append: (word) ->
    @children.append word
    @element.append word.element
    word.setParent this
    return this

  ###
  next returns the line after this
  Returns null if no line exists
  ###
  next: ->
    return @parent.children.next this

  ###
  prev returns the line before this
  Returns null if no line exists
  ###
  prev: ->
    return @parent.children.prev this

  remove: ->
    for child in @children
      child.remove()
    @element.remove()
    @parent.children.remove this
    return this

  visiblyContains: (child) ->
    childPos = child.element.offset()
    pos = @element.offset()
    childPos.right = childPos.left + child.element.width()
    pos.right = pos.left + @element.width()

    if (childPos.right > pos.right)
      return false
    return true

  setParent: (parent) ->
    return this if not parent
    @parent.children.remove(this) if @parent
    @parent = parent
    @element.show()
    return this
