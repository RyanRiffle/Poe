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
    @setPageSize Poe.Document.PageSize.Letter
    @setPageMargins margins =
      top: 96
      bottom: 96
      left: 96
      right: 96
    @pdf = new Poe.PDF (this)
    @append new Poe.Page()
    @textCursor = new Poe.TextCursor(@children[0].child(0).child(0).child 0)

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

    @setPageMargins @margins
    @setPageSize @pageSize
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

    @setPageMargins @margins
    @setPageSize @pageSize
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
      page.element.css 'height', "#{size.height}"
      page.element.css 'width', "#{size.width}"
    @pageSize = size
    @textCursor.show() if @textCursor
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
    @margins = margins
    @textCursor.show() if @textCursor
    return this


  ###
  Gets a {Poe.TextObject} for the jQuery object specified. This function recursively searches
  all {Poe.TextObject}'s in the document tree. If it finds an object that is for the element it 
  returns it, otherwise returns null.

  @return [Poe.TextObject] The object that was found, or null otherwise.

  @param element [jQuery] the element to find 
  ###
  objectFromElement: (element) ->
    for page in @children
      if page.element[0] == element[0]
        return page

      ret = page.fromElement element
      if ret != null
        return ret

    return null

  ###
  "Enum" of possible page sizes
  ###
  @PageSize =
    Letter:
      height: 1056
      width: 816

    Legal:
      width: 8.5 * 96
      height: 14 * 96

    Ledger:
      width: 17 * 96
      height: 11 * 96

    Tabloid:
      width: 11 * 96
      height: 17 * 96
