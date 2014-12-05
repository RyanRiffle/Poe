###
Poe.Document is the top and contains pages. It also manages
page margins and page size.
###
class Poe.Document
  ###
  Create a new Poe.Document. Creating a document is only possible in {Poe.Writer}
  in order for it to be shown in the DOM.
  ###
  constructor: ->
    @children = []
    @element = $ '<div class="document"></div>'
    $('body').append(@element)
    @append new Poe.Page()
    @textCursor = new Poe.TextCursor(@children[0].child(0).child(0).child 0)
    @setPageSize Poe.Document.PageSize.Letter
    @setPageMargins margins =
      top: 96
      bottom: 96
      left: 96
      right: 96

  ###
  Gets the child page at index.
  @param index [Number] index to retrieve
  @return [null] if the page does not exist
  @return [Poe.Page] if the page exists
  ###
  page: (index) ->
    return @children[index] if index >= 0 and index < @children.length
    return null

  ###
  Append a page to the end of the document.
  @param page [Poe.Page] the page to append
  ###
  append: (page) ->
    page.document = this
    @children.append page
    @element.append page.element
    page.setParent this
    return this

  ###
  Prepend a page to the front of the document.
  @param page [Poe.Page] the page to prepend
  @return [Poe.Document] this
  ###
  prepend: (page) ->
    page.document = this
    @children.prepend page
    @element.prepend page.element
    page.setParent this
    return this

  ###
  Sets the page size to size
  @param size [Object] the size object
  @option size [Number] width the width in pixels
  @option size [Number] height the height in pixels
  @return [Poe.Document] this
  ###
  setPageSize: (size) ->
    for page in @children
      page.element.height(size.height)
      page.element.width(size.width)
    return this

  ###
  Sets the page margins for all pages.
  @param margins [Poe.Document.PageSize] the size
  @return [Poe.Document] this
  ###
  setPageMargins: (margins) ->
    for page in @children
      page.element.css 'padding-left', margins.left
      page.element.css 'padding-right', margins.right
      page.element.css 'padding-top', margins.top
      page.element.css 'padding-bottom', margins.bottom
    return this

  ###
  "Enum" of possible page sizes
  ###
  @PageSize =
    Letter:
      height: 1056
      width: 816
