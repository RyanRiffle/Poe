class Poe.Glyphicon extends Poe.ToolBarItem
  constructor: (icon = 'tree-conifer', parent) ->
    @span = $ '<span class="glyphicon"></span>'
    @setIcon icon

    if parent
      @parent.element().prepend @span

  setIcon: (icon) ->
    @span.attr 'class', 'glyphicon'
    icon = 'glyphicon-' + icon
    @span.addClass icon

  element: ->
    return @span