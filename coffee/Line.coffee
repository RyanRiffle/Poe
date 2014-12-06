###
Poe.Line is really only neccessary for word wrap and page breaks.
It normally contains children of type Poe.Word.
###
class Poe.Line extends Poe.TextObject
  ###
  Create a new Poe.Line. This also creates a new
  {Poe.Word} as a child.
  ###
  constructor: () ->
    @children = []
    @element = $ '<div class="line"></div>'
    @parent = null
    $('body').append(@element)
    @append new Poe.Word()

  ###
  Returns whether or not child is completely inside of this line.
  It does not check however if it contains that child. It goes only
  by screen position.
  @param child [Poe.TextObject] The textObject to check
  @return [Boolean] true if child is contained, false otherwise
  ###
  visiblyContains: (child) ->
    childPos = child.element.position()
    pos = @element.position()
    childPos.right = childPos.left + child.element.width()
    pos.right = pos.left + @element.outerWidth(false)

    if (childPos.right > pos.right)
      return false
    return true
