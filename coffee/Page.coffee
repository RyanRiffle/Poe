class Poe.Page extends Poe.Checkable
  constructor: (document) ->
    @children = []
    @element = $ '<div class="page"></div>'
    $('body').append(@element)
    @setParent document

    @append new Poe.Paragraph()

  child: (index) ->
    return @children[index] if index >= 0 and index <= @children.length
    return null

  index: ->
    @parent.children.indexOf this

  ###
  insertAfter inserts this after page
  ###
  insertAfter: (page) ->
    @setParent page.parent
    @parent.pages.insertAfter this, page
    page.element.after @element

  ###
  insertBefore inserts this before page
  ###
  insertBefore: (page) ->
    @setParent page.parent
    @parent.pages.insertBefore this, page
    page.element.before @element

  ###
  append adds paragraph to the bottom of the page
  ###
  append: (paragraph) ->
    @children.append paragraph
    @element.append paragraph.element
    paragraph.setParent this

  ###
  prepend adds the paragraph to the top of the page
  ###
  prepend: (paragraph) ->
    @children.prepend paragraph
    @element.prepend paragraph.element

  next: ->
    @parent.children.next this

  prev: ->
    @parent.children.prev this

  ###
  isEmpty returns true when only the textcursor is in the page or the page is
  completely void of any text data
  returns false otherwise
  ###
  isEmpty: ->
    if @children.length == 1
      if @child(0).children.length == 1
        word = @child(0).child(0).child(0)
        if word.text().length == 1 and word.text().first()[0] == @parent.textCursor.element[0]
          return true

    return false

  setParent: (parent) ->
    if parent != null && parent != undefined && parent.length != 0
      @parent = parent
      @element.show()
