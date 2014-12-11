class Poe.ButtonGroup extends Poe.ToolBarItem
  constructor: (toolbar, buttons) ->
    @container = $ '<div class="btn-group" role="group"></div>'
    toolbar.element.append @container
    if buttons
      for button in buttons
        @container.append button.element()
      @buttons = buttons
    else
      @buttons = []

  element: ->
    return @container

  setRadio: (radio) ->
    if radio
      @container.on 'click', 'button', @handleRadio
    else
      @container.off 'click', 'button', @handleRadio

  handleRadio: (event) =>
    for button in @buttons
      if event.target == button.element()[0]
        button.active true
      else
        button.active false
