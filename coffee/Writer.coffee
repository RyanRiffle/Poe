class Poe.Writer
  constructor: (parentSelector) ->
    @document = new Poe.Document()
    @element = $ '<div class="writer"></div>'
    $(parentSelector).append @element
    @element.append @document.element
    @document.show()
    $(window).resize @windowResized
    @windowResized()
    
  windowResized: (event) ->
    @element.css('width', $('body').width())
    @element.css('height', $('body').height())