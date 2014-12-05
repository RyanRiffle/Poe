class Poe.Writer
  constructor: (parentSelector) ->
    @document = new Poe.Document()
    @toolbar = new Poe.ToolBar(this)
    @element = $ '<div class="writer"></div>'
    $(parentSelector).append @element
    @element.append @document.element
    @document.show()
    $('body').resize @windowResized
    @element.scroll @windowResized
    @windowResized()

  windowResized: (event) =>
    @element.css('width', $('body').width())
    @element.css('height', $('body').height())
    @document.textCursor.update()
