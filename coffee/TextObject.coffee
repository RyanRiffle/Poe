###
Poe.TextObject is the base on which all document children are made of.
It serves as a wrapper around a DOM element, in order to get away
from the nitty gritty details of the DOM. It is not intended
to be instantiated, but instead extended.
###
class Poe.TextObject
  ###
  Creates a new Poe.TextObject.
  @note It is pointless to create a Poe.TextObject. It has no
  DOM element. Use a extension of it instead like {Poe.Word}, {Poe.Line},
  etc.
  ###
  constructor: ->
    @children = []
    @element = null
    @parent = null

  ###
  Gets the child at index.
  @param index [Number] the index of the child
  @return [Poe.TextObject or null] the object if it exists
  ###
  child: (index) ->
    return @children[index] if index >= 0 and index < @children.length
    return null

  ###
  Gets the index of this in its parent's children.
  @throw [Error] If it is not found there is a bug somewhere
  @return [Number] the index. -1 if it has no parent
  ###
  index: ->
    if not @parent
      return -1
    index = @parent.children.indexOf this
    throw new Error('Index should never be -1') if index == -1
    return index

  ###
  Inserts this after textObject. The parent is changed
  and this is added to the parents list of children. This change
  is also reflected in the DOM.
  @return [Poe.TextObject] this
  ###
  insertAfter: (textObject) ->
    if textObject
      @setParent textObject.parent
      @parent.children.insertAfter this, textObject
      textObject.element.after @element if @element and textObject.element
    return this

  ###
  Inserts this before textObject. The parent is changed and this is addded
  to the parents list of children. This change is reflected in the DOM.
  @return [Poe.TextObject] this
  ###
  insertBefore: (textObject) ->
    if textObject
      @setParent textObject.parent
      @parent.children.insertAfter this, textObject
      textObject.element.after @element if @element and textObject.element
    return this

  ###
  Appends textObject to children and adds it to the DOM.
  @param textObject [Poe.TextObject] the text object to append
  @return [Poe.TextObject] this
  ###
  append: (textObject) ->
    textObject.setParent this
    @children.append textObject
    @element.append textObject.element if @element
    return this

  ###
  Prepends textObject to children and adds it to the DOM.
  @param textObject [Poe.TextObject] the text object to prepend
  @return [Poe.TextObject] this
  ###
  prepend: (textObject) ->
    textObject.setParent this
    @children.prepend textObject
    @element.prepend textObject.element if @element

  ###
  Sets the parent of this to textObject, however it does not add itself
  to the parents list of children.
  @param textObject [Poe.TextObject] the new parent
  @return [Poe.TextObject] this
  ###
  setParent: (textObject) ->
    if textObject
      @parent.children.remove this if @parent
      @parent = textObject
    return this

  ###
  Removes this from DOM and parent's children. Also removes all
  children.
  ###
  remove: ->
    for child in @children
      child.remove()
    @element.remove()
    @parent.children.remove this

  ###
  Gets the next object in parents children and returns it
  @return [Poe.TextObject or null] next object if it exists
  ###
  next: ->
    return @parent.children.next this

  ###
  Gets the previous object in parents children and returns it
  @return [Poe.TextObject or null] previous object if it exists
  ###
  prev: ->
    return @parent.children.prev this

  ###
  Returns whether or not the object is empty of text
  @note Even though the {Poe.TextCursor} is not text. It does contain a
  text node. This will return false if there is a {Poe.TextCursor} somewhere
  in it's child tree.
  @return [Boolean] true if empty, false otherwise
  ###
  isEmpty: ->
    if @element[0].textContent == ''
      return true
    return false
