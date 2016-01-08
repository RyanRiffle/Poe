###
Poe.Dropdown is a wrapper around a Bootstrap 3 dropdown.
###
class Poe.Dropdown extends Poe.ToolBarItem
	constructor: (toolbar, buttonText = "No Text", tooltip = "", tooltipPos="right") ->
		@container = $ '<div class="dropdown">'
		@button = $ '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"></button>'
		@childContainer = $ '<ul class="dropdown-menu" role="menu" aria-expand="true"></ul>'
		@text = $ '<span class="text"><span>'
		toolbar.element.append @container
		@container.append @button
		@container.append @childContainer
		@button.append (@text)
		@setText buttonText

		if tooltip != ''
			@button.addClass('poe-tooltip')
			@button.attr('title', tooltip)
			@button.attr('data-placement', tooltipPos)
		@children = []

	###
	Add a caret dropdown indicator to the dropdown.
	@return [Poe.Dropdown] this for method chaining.
	###
	addCaret: () ->
		caret = $ '<span class="caret"></span>'
		@button.append caret
		return this

	###
	Sets the dropdown's selected text

	@param text [string] the text to set as the dropdown's value
	###
	setText: (text) ->
		@text.html(text + ' ')

	###
	Add an item to the dropdown list.

	@param text [string] the string to add
	@return [jQuery] jQuery object representing the <li> added
	###
	addItem: (text) ->
		li = $ '<li role="presentation"></li>'
		a = $ '<a role="menuitem" tabindex="-1" href="#"></a>'
		@childContainer.append li
		li.append a
		a.html(text)
		return li

	###
	Register an event callback. Valid events are:

	itemClicked	-	called when an item is clicked
	###
	on: (event, callback) ->
		if event == 'itemClicked'
			@container.on 'click', 'ul li a', callback

	###
	Returns the element that this dropdown is a wrapper for
	@return [jQuery] the element
	###
	element: ->
		return @container
