###
Poe.FontManager manages fonts for poe. It is used in both the standalone version and the OS.js version.
It's main goal is to load the fonts that will be used including their font files for use when
fonts need to be embedded in an exported document.
###
class Poe.FontManager
	###
	Creates a Poe.FontManager.
	@note This should be instantiated only once during the course of execution. The {Poe.ToolbarHelper}
	created in {Poe.Writer} creates an instance of this class.
	###
	constructor: () ->
		@element = $ '<link rel="stylesheet" type="text/css"></link>'
		$('head').append @element
		Poe.Fonts = {}
		@addedCallback = null

	###
	Loads the default fonts. When Poe is being run as a standalone application it loads fonts
	from the /fonts directory of the projct. When it is being run as an application inside OS.js
	the font names are retrieved from the OS.js API.
	@note This functions stores and object as Poe.Fonts. Where the key is the name of the font
	and the value is the loaded font file (if any).
	###
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

	@param name [string] the name of the font
	@param url [string] the url of the font file e.g. .ttf .woff
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
		else
			Poe.Fonts[name] = null
		@addedCallback name if typeof(@addedCallback) == 'function'

	###
	Register an event callback. The current events available are:

	newFont  -  called when a new font is added

	@param event [string] the event to register
	@param callback [function] the callback to be called when the event is fired.
	###
	on: (event, callback) ->
		if (event == 'newFont')
			@addedCallback = callback
