class Poe.FontManager
	constructor: () ->
		@element = $ '<link rel="stylesheet" type="text/css"></link>'
		$('head').append @element
		Poe.Fonts = {}
		@addedCallback = null

	loadDefaults: ->
		fonts = null
		if (Poe.OSjs)
			fonts = OSjs.API.getHandlerInstance().getConfig('Fonts').list
			for font in fonts
				@loadFont font

		if (!fonts || fonts.length == 0)
			@loadFont('Arimo', 'fonts/Arimo/Arimo-Regular.ttf')
			@loadFont('Calligraffitti', 'fonts/Calligraffitti/Calligraffitti-Regular.ttf')
			@loadFont('Cousine', 'fonts/Cousine/Cousine-Regular.ttf')
			@loadFont('Droid Sans', 'fonts/Droid_Sans/DroidSans.ttf')
			@loadFont('Droid Serif', 'fonts/Droid_Serif/DroidSerif.ttf')
			@loadFont('Lobster', 'fonts/Lobster/Lobster-Regular.ttf')
			@loadFont('Open Sans', 'fonts/Open_Sans/OpenSans-Regular.ttf')
			@loadFont('Pacifico', 'fonts/Pacifico/Pacifico.ttf')
			@loadFont('Raleway', 'fonts/Raleway/Raleway-Regular.ttf')
			@loadFont('Syncopate', 'fonts/Syncopate/Syncopate-Regular.ttf')
			@loadFont('Tinos', 'fonts/Tinos/Tinos-Regular.ttf')
			@loadFont('Ubuntu', 'fonts/Ubuntu/Ubuntu-Regular.ttf')

	###
	Loads a font by name, and optionally url. If it is a universal font among
	all operating systems then url is not necessary.
	###
	loadFont: (name, url) ->
		if (url)
			str = "<style rel='stylesheet' type='text/css'>@font-face {font-family: '#{name}'; src: url(#{url});}</style>"
			$('head').append str
			Poe.Fonts[name] = url
			xhr = new XMLHttpRequest()
			xhr.responseType = 'arraybuffer'
			xhr.overrideMimeType 'text/plain; charset=x-user-defined'
			xhr.open('GET', url, true)
			xhr.onload = (e) ->
				if this.status == 200
					Poe.Fonts[name] = e.target.response
					console.log "FontManager: Adding font '#{name}'"

			xhr.send()
		@addedCallback name if typeof(@addedCallback) == 'function'

	on: (event, callback) ->
		if (event == 'newFont')
			@addedCallback = callback
