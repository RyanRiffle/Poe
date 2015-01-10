###
Poe.Page is just a container to hold paragraphs. Or any other
similar object.
###
class Poe.Page extends Poe.TextObject
  ###
  Create a new Poe.Page. This also creates a new {Poe.Paragraph} as a child.
  ###
  constructor: (document) ->
    @children = []
    @element = $ '<div class="page"></div>'
    $('body').append(@element)
    @setParent document

    @append new Poe.Paragraph()

  ###
  Inserts this page after another {Poe.Page}

  @param page [Poe.Page] the page to insert after
  ###
  insertAfter: (page) ->
  	super page
  	@parent.setPageSize @parent.pageSize
  	@parent.setPageMargins @parent.margins