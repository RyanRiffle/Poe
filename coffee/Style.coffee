###
Base class for all styles including TextStyle and paragraphStyle.
###
class Poe.Style
  constructor: (@textCursor) ->
    @changedCallbacks = []

  ###
  Set the {Poe.TextCursor} that this style would use
  when applying a style to the TextObject that contains the cursor.

  @throw [Error] error if textCursor is not a {Poe.TextCursor}
  @param textCursor [Poe.TextCursor] textCursor
  @return [Poe.Style] this
  ###
  setTextCursor: (textCursor) ->
    if not textCursor instanceof Poe.TextCursor
      throw new Error('textCursor must be a Poe.TextCursor')
    @textCursor = textCursor
    return this

  ###
  Override in extended class. Should copy
  the different parts of style to this
  @param style [Poe.Style] the style to clone
  @return [Poe.Style] this
  ###
  clone: (style) ->
    return this

  ###
  Register a callback to be called when the style has changed.
  @throws [Error] error if callbackFn is not a function
  @param callbackFn [Function] a function that takes one argument which will be {Poe.Style}
  @return [Poe.Style] this
  ###
  changed: (callbackFn) ->
    if typeof(callbackFn) != 'function'
      throw new Error('Expects a function as an argument.')

    @changedCallbacks.append callbackFn
    return this

  ###
  Convenience function to call all registered changed callbacks.
  ###
  hasChanged: ->
    for callback in @changedCallbacks
      callback this
