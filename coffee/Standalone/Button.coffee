###
A button for use on the toolbar when in standalone mode.
###
class Poe.Button extends Poe.ToolBarItem
  ###
  Creates a Poe.Button and returns it
  @param [Poe.ToolBar] toolbar to add the button to
  @param [string] Button text (if any)
  @param [string] The tooltip position ("top", "right", "bottom", "left")
  ###
  constructor: (toolbar, text = "", tooltip="", tooltipPos = "right") ->
    @button = $ '<button type="button" class="btn btn-default"></button>'
    @text = $ '<span class="text"></span>'
    @setText text
    toolbar.element.append @button
    @button.append @text

    if tooltip != ""
      @setTooltip tooltip, tooltipPos

  ###
  Set the buttons text
  @param [string] text 
  ###
  setText: (text) ->
    @text.html text

  ###
  Set the tooltip text and position
  @param text [string] the tooltip text
  @param position [string] The position ("top", "right", "bottom", "left")
  ###
  setTooltip: (text, position) ->
    @button.addClass 'poe-tooltip'
    @button.attr 'title', text
    @button.attr 'data-placement', position

  ###
  Sets the icon to a {Poe.Glyphicon} using Twitter Bootstrap's supplied icons.
  @see http://glyphicons.com/

  @param icon [Poe.Glyphicon] the icon to use
  ###
  setIcon: (icon) ->
    @button.prepend icon.element()

  ###
  Register an event callback. Valid events are:

  click -- button click event

  @param event [string]
  @param callback [function] the callback to call
  ###
  on: (event, callback) ->
    if event == 'click'
      @button.click callback

  ###
  Get the dom element of the button.
  @return [jQuery object] jQuery wrapped around HTMLButtonElement
  ###
  element: ->
    return @button

  ###
  Set the button as active, for toggleable buttons.
  @param onoff [boolean] whether the button should be active
  ###
  active: (onoff) ->
    if onoff
      @button.addClass 'active'
    else
      @button.removeClass 'active'