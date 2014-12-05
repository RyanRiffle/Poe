class Poe.Document
  constructor: ->
    @children = []
    @element = $ '<div class="document"></div>'
    $('body').append(@element)
    @element.hide()
    @append new Poe.Page()
    @textCursor = new Poe.TextCursor(@children[0].child(0).child(0).child 0)
    @setPageSize Poe.Document.PageSize.Letter
    @setPageMargins margins =
      top: 96
      bottom: 96
      left: 96
      right: 96

  page: (index) ->
    @page[index]

  lines: ->
    for page in @children
      page.children

  append: (page) ->
    page.document = this
    @children.append page
    @element.append page.element
    page.setParent this
    return this

  prepend: (page) ->
    page.document = this
    @children.prepend page
    @element.prepend page.element
    page.setParent this
    return this

  show: ->
    @element.show()
    return this

  hide: ->
    @element.hide()
    return this

  setPageSize: (size) ->
    for page in @children
      page.element.height(size.height)
      page.element.width(size.width)
    return this

  setPageMargins: (margins) ->
    for page in @children
      page.element.css 'padding-left', margins.left
      page.element.css 'padding-right', margins.right
      page.element.css 'padding-top', margins.top
      page.element.css 'padding-bottom', margins.bottom
    return this

  @PageSize =
    Letter:
      height: 1056
      width: 816
