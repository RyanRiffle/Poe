class Poe.TextObject extends Poe.Checkable
  ###
  Puts this after another textObject.

  Returns true on success and false otherwise.
  ###
  after: (textObject) ->
    return false
  
  ###
  Puts this before another textObject

  Returns true on success and false otherwise
  ###
  before: (textObject) ->
    return false
  
  ###
  Returns the next text node for a Poe.TextCursor.

  Returns null if no node exists
  ###
  nextTextNode: (textCursor) ->
    return null
  
  ###
  Returns the previous text node fora Poe.TextCursor

  Returns null if no node exists
  ###
  prevTextNode: (textCursor) ->
    return null