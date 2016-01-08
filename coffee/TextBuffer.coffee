class Poe.TextBuffer
	constructor: () ->
		@buf = []

	insertMarker: (index, marker) ->
		@buf.splice(index, 0, marker)
		marker.index = index
		marker.buffer = this
		return marker

	removeMarker: (marker) ->
		@buf.splice(marker.index, 1)
		marker = null
