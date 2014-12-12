class Poe.ToolBarItem
  constructor: ->
    return

  parent: ->
    return @element().parent()

  hide: ->
    return @element().hide()

  show: ->
    return @element().show()

  
  css: (key, value) ->
    @element().css key, value
    return this