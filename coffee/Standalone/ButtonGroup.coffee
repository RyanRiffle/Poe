###
A button group. This class is a wrapper around Bootstrap's button group, to try
to abstract away the DOM.
###
class Poe.ButtonGroup extends Poe.ToolBarItem
  ###
  Creates a {Poe.ButtonGroup} object

  @param toolbar [Poe.ToolBar] the toolbar to add this button group to
  @param buttons [array] an array of {Poe.Button} to add to the group
  ###
  constructor: (toolbar, buttons) ->
    @container = $ '<div class="btn-group" role="group"></div>'
    toolbar.element.append @container
    if buttons
      for button in buttons
        @container.append button.element()
      @buttons = buttons
    else
      @buttons = []

  ###
  Get the element that is being used in the DOM
  @return [jQuery] A jQuery object for the button group
  ###
  element: ->
    return @container

  ###
  Sets the buttons in this group to only have one active at a time. Like a group of radio
  checkboxes.

  @param radio [boolean] Turn radio on or off
  ###
  setRadio: (radio) ->
    if radio
      @container.on 'click', 'button', @handleRadio
    else
      @container.off 'click', 'button', @handleRadio

  ###
  Handles the radio style of the buttons if {Poe.ButtonGroup#setRadio} has been used.
  This is for internal use.
  ###
  handleRadio: (event) =>
    for button in @buttons
      if event.target == button.element()[0]
        button.active true
      else
        button.active false
