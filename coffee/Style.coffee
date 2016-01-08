###
Base class for all styles including TextStyle and paragraphStyle.
###
class Poe.Style
	###
	Creates a new Poe.Style. This is not meant to instantiated, however is
	meant to be extended
	@see Poe.TextStyle
	@see Poe.ParagraphStyle
	###
	constructor: (@textCursor) ->
		@changedCallbacks = []

	###
	Set the {Poe.TextCursor} that this style would use
	when applying a style to the TextObject that contains the cursor.

	@throw [Error] error if textCursor is not a {Poe.TextCursor}
	@param textCursor [Poe.TextCursor] textCursor
	@return [Poe.Style] this
	###
	setTextCursor: (textCursor) ->
		if not textCursor instanceof Poe.TextCursor
			throw new Error('textCursor must be a Poe.TextCursor')
		@textCursor = textCursor
		return this

	###
	Override in extended class. Should copy
	the different parts of style to this
	@param style [Poe.Style] the style to clone
	@return [Poe.Style] this
	###
	clone: (style) ->
		return this

	###
	Register a callback to be called when the style has changed.
	@throws [Error] error if callbackFn is not a function
	@param callbackFn [Function] a function that takes one argument which will be {Poe.Style}
	@return [Poe.Style] this
	###
	changed: (callbackFn) ->
		if typeof(callbackFn) != 'function'
			throw new Error('Expects a function as an argument.')

		@changedCallbacks.append callbackFn
		return this

	###
	Convenience function to call all registered changed callbacks.
	###
	hasChanged: ->
		for callback in @changedCallbacks
			callback this

	@rgbToHex: (rgb) ->
		rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
		hex = (x) ->
			return ("0" + parseInt(x).toString(16)).slice(-2);

		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
