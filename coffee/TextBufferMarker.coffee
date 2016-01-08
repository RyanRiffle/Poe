class Poe.TextBufferMarker
	constructor: () ->
		@buffer = null
		@index = -1

	prev: ->
		if index != 0
			return @buffer[index - 1]
		return null

	next: ->
		if index != @buffer.length - 1
			return @buffer[index + 1]
		return null

	remove: ->
		@buffer.removeMarker(this)
