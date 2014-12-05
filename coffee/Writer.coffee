###
Poe.Writer is the only thing you need to use in order to add Poe to your webpage.
It handles everything else.

@example index.html
  ...
  <div id="Poe"></div>

  <script type="text/javascript">
  poe = new Poe.Writer("#Poe");
  </script>
###
class Poe.Writer
  ###
  Create a new Poe.Writer instance.
  @param parentSelector [CSS] The css selector to use with jQuery to find
  your element.
  ###
  constructor: (parentSelector) ->
    @document = new Poe.Document()
    @toolbar = new Poe.ToolBar(this)
    @element = $ '<div class="writer"></div>'
    $(parentSelector).append @element
    @element.append @document.element
    $('body').resize @windowResized
    @element.scroll @windowResized
    @windowResized()

  ###
  Event handler when the window resizes. Updates the writers width and height
  @private
  ###
  windowResized: (event) =>
    @element.css('width', $('body').width())
    @element.css('height', $('body').height()-@toolbar.element.height())
    @document.textCursor.update()
