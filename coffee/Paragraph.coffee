class Poe.Paragraph extends Poe.Checkable

  constructor: (document) ->
    @children = []
    @element = $ '<div class="paragraph"></div>'
    $('body').append(@element)
    @setParent document

    line = new Poe.Line()
    @append line
    console.log "Paragraph child count: #{@children.length}"
    #@append new Poe.Line()

  child: (index) ->
    return @children[index] if index >= 0 && index < @children.length
    return null

  ###
  insert after inserts this after paragraph
  ###
  insertAfter: (paragraph) ->
    @setParent paragraph.parent
    @parent.children.insertAfter this, paragraph
    paragraph.element.after @element
    return this

  ###
  insertBefore inserts this before paragraph
  ###
  insertBefore: (paragraph) ->
    @setParent paragraph.parent
    @parent.children.insertBefore this, paragraph
    paragraph.element.before @element
    return this

  ###
  prepend adds line to the top of the paragraph
  ###
  prepend: (line) ->
    line.setParent this
    @children.prepend line
    @element.prepend line.element
    return this

  ###
  append adds line to the end of the paragraph
  ###
  append: (line) ->
    line.setParent this
    @children.append line
    @element.append line.element
    return this

  next: ->
    @parent.children.next this

  prev: ->
    @parent.children.prev this

  setParent: (parent) ->
    if parent
      @parent = parent
      @element.show()
    return this
