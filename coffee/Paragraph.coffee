###
Poe.Paragraph's sole purpose is to hold a Poe.Line. It is used by
Poe.TextCursor when the user presses return. Which then creates
a new paragraph.
###
class Poe.Paragraph extends Poe.TextObject
  ###
  Creates a new Poe.Paragraph. This also creates a new {Poe.Line} as a child.
  @param page [Poe.Page] Optional. The page to set as this paragraphs parent.
  @note The paragraph is appended to the page if page is supplied.
  ###
  constructor: (page) ->
    @children = []
    @element = $ '<div class="paragraph"></div>'
    $('body').append(@element)
    page.append this if page

    line = new Poe.Line()
    @append line
    console.log "Paragraph child count: #{@children.length}"
    #@append new Poe.Line()
