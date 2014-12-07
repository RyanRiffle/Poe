###
Poe.List is a Poe.Paragraph subclass for bulleted or numbered lists.
Instead of a {Poe.Line}, it takes a {Poe.ListItem} as a child. However note
that a {Poe.Line} could be added as a child if no bullet or number is wanted.
###
class Poe.List extends Poe.Paragraph
  ###
  Creates a new Poe.List
  ###
  constructor: ->
    @element = $ '<ul></ul>'
    @children = []
    $('body').append @element

    li = new Poe.ListItem()
    @append li

  setListType: (type=Poe.List.ListType.Bullets) ->
    @element.css 'list-style-type', type

  @ListType =
    Bullets: 'disc'
    Numbers: 'decimal'
