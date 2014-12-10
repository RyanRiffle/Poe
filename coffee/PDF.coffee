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

	generate: =>
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
		@doc.x = 72
		for word in line.children
			textStyle = new Poe.TextStyle()
			textStyle.update word
			@doc.fontSize(textStyle.fontSize)

			if not @registeredFonts.contains(textStyle.font)
				console.log "PDF: Registering '#{textStyle.font}' as a font."
				@doc.registerFont(textStyle.font, Poe.Fonts[textStyle.font], textStyle.font)
				@registeredFonts.push textStyle.font
			@doc.font(textStyle.font)

			if word == line.children.first() and @formatting.align != 'left'
				wordpos = word.position()
				linepos = line.position()
				@doc.x = ((wordpos.left - linepos.left) * 0.75) + @margins.left
				console.log "px: #{wordpos.left - linepos.left}"
				console.log "x: #{@doc.x}"

			cont = yes
			cont = no if word == line.children.last()

			if textStyle.italic
				@doc.save();
				@doc.transform(1, 0, Math.tan(-10 * Math.PI / 180), 1, 0, 0);

			@doc.fillColor textStyle.color
				.lineWidth .05
				.strokeColor textStyle.color
				.text word.element[0].textContent,
					continued: cont
					underline: textStyle.underline
					stroke: textStyle.bold
					fill: true
			if textStyle.italic
				@doc.restore()
		return this

	generatePage: (addPage = false, page) ->
		for paragraph in page.children
			@generateParagraph paragraph
		return this

	finalize: =>
		blob = @stream.toBlobURL('application/pdf')
		w = window.open(blob)
		w.focus()

	progess: (callback) ->
