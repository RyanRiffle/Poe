class Poe.TextCursor
	constructor: (inside) ->
		@hiddenTextArea = $('<textarea style="position: absolute; opacity: 0; height: 2px; width: 2px;"></textarea>')
		@element = $('<span class="textcursor">&#8203;</span>')
		@visibleCursor = $('<div class="visiblecursor"></div>')
		@currentWord = inside
		@blinkTimer = null
		inside.prepend @element
