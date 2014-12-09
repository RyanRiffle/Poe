###
PDF Generator for {Poe.Document} using jsPDF
@see https://parall.ax/products/jspdf
@see https://mrrio.github.io/jsPDF/doc/symbols/jsPDF.html
###
class Poe.PDF
	constructor: (document) ->
		@document = document
		@margins  = 
			top: @document.margins.top * 0.75
			bottom: @document.margins.bottom * 0.75
			left: @document.margins.left * 0.75
			right: @document.margins.right * 0.75

		@lastWordPos = 
			top: @margins.top
			left: @margins.left

		@formatting = {}

		@totalPos = null

		$('body').keyup @generate

	generate: (event) =>
		if event.keyCode != Poe.key.Up
			return

		@doc = new PDFDocument
		@stream = @doc.pipe(blobStream())
		@stream.on 'finish', @finalize
		@registeredFonts = []

		for page in @document.children
			@generatePage false, page

		@doc.end()
		return this

	generateParagraph: (paragraph) ->
		for line in paragraph.children
			pstyle = new Poe.ParagraphStyle()
			pstyle.update(paragraph)
			@formatting.align = pstyle.align
			@generateLine line
		return this

	generateLine: (line) ->
		for word in line.children
			textStyle = new Poe.TextStyle()
			textStyle.update word
			@doc.fontSize(textStyle.fontSize)

			if not @registeredFonts.contains(textStyle.font)
				@doc.registerFont(textStyle.font, Poe.Fonts[textStyle.font], textStyle.font)
				@registeredFonts.push textStyle.font
			@doc.font(textStyle.font)

			if word == line.children.first() and @formatting.align != 'left'
				wordpos = word.element.position()
				linepos = line.element.position()
				@doc.x = ((wordpos.left - linepos.left) * 0.75) + @margins.left
				console.log "px: #{wordpos.left - linepos.left}"
				console.log "x: #{@doc.x}"

			cont = yes
			cont = no if word == line.children.last()

			@doc.fillColor textStyle.color
				.text word.element[0].textContent,
					continued: cont
					underline: textStyle.underline
		return this

	generatePage: (addPage = false, page) ->
		for paragraph in page.children
			@generateParagraph paragraph
		return this

	finalize: =>
		blob = @stream.toBlobURL('application/pdf')
		w = window.open(blob)
		w.focus()