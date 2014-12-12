class Poe.Button extends Poe.ToolBarItem
  constructor: (toolbar, text = "", tooltip="", tooltipPos = "right") ->
    @button = $ '<button type="button" class="btn btn-default"></button>'
    @text = $ '<span class="text"></span>'
    @setText text
    toolbar.element.append @button
    @button.append @text

    if tooltip != ""
      @setTooltip tooltip, tooltipPos

  setText: (text) ->
    @text.html text

  setTooltip: (text, position) ->
    @button.addClass 'poe-tooltip'
    @button.attr 'title', text
    @button.attr 'data-placement', position

  setIcon: (icon) ->
    @button.prepend icon.element()

  on: (event, callback) ->
    if event == 'click'
      @button.click callback

  element: ->
    return @button

  active: (onoff) ->
    if onoff
      @button.addClass 'active'
    else
      @button.removeClass 'active'