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
    @element = $ '<div class="writer"></div>'
    if (!parentSelector)
        $('body').append @element
    else
        $(parentSelector).append @element
    @element.append @document.element

    @toolbarHelper = new Poe.ToolbarHelper(this)
    if (!Poe.OSjs)
      @toolbar = new Poe.ToolBar(this)

    $('body').resize @windowResized
    @element.scroll @windowResized
    @windowResized()

  ###
  Event handler when the window resizes. Updates the writers width and height
  @private
  ###
  windowResized: (event) =>
    if (!Poe.OSjs)
        @element.css('width', $('body').width())
        @element.css('height', $('body').height()-@toolbar.element.height())
    @document.textCursor.update()
