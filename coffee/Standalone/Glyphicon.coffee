###
Poe.Glpyhicon provides a wrapper around the icons provided by Bootstrap. In an
effort to abstract away the DOM.
###
class Poe.Glyphicon extends Poe.ToolBarItem
	###
	Creates a icon

	@param icon [string] the icon class used in bootstrap without 'glyphicon-'
	@param parent [Poe.ToolBarItem] the item to add the icon to if any
	@see http://getbootstrap.com/components/#glyphicons
	###
	constructor: (icon = 'tree-conifer', parent) ->
		@span = $ '<span class="glyphicon"></span>'
		@setIcon icon

		if parent
			@parent.element().prepend @span

	###
	Set the icon being used to icon.

	@param icon [string] the icon class used in bootstrap without 'glyphicon-'
	@return [Poe.Glyphicon] this for method chaining
	###
	setIcon: (icon) ->
		@span.attr 'class', 'glyphicon'
		icon = 'glyphicon-' + icon
		@span.addClass icon
		return this

	###
	Returns the element this class provides a wrapper around.
	@return [jQuery] jQuery object for the element
	###
	element: ->
		return @span
