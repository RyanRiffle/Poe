###
Poe.ListItem is a extension of Poe.Line for numbered or bulleted lists.
It works with {Poe.List} to provide them. A {Poe.Line} could be used
in place of this if you would like a line to be added to the list without
a bullet or number, eg. for more than one line in a list item.
###
class Poe.ListItem extends Poe.Line
  ###
  Creates a new Poe.ListItem
  ###
  constructor: ->
    @element = $ '<li></li>'
    @children = []

    word = new Poe.Word()
    @append word
