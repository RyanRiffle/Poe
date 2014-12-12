###
Poe.Dropdown is a wrapper around a Bootstrap 3 dropdown.
###
class Poe.Dropdown extends Poe.ToolBarItem
	constructor: (toolbar, buttonText = "No Text", tooltip = "", tooltipPos="right") ->
		@container = $ '<div class="dropdown">'
		@button = $ '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"></button>'
		@childContainer = $ '<ul class="dropdown-menu" role="menu" aria-expand="true"></ul>'
		@text = $ '<span class="text"><span>'
		console.log toolbar
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

	addCaret: ->
		caret = $ '<span class="caret"></span>'
		@button.append caret

	setText: (text) ->
		@text.html(text + ' ')

	addItem: (text) ->
		li = $ '<li role="presentation"></li>'
		a = $ '<a role="menuitem" tabindex="-1" href="#"></a>'
		@childContainer.append li
		li.append a
		a.html(text)
		return li

	on: (event, callback) ->
		if event == 'itemClicked'
			@container.on 'click', 'ul li a', callback

	element: ->
		return @container