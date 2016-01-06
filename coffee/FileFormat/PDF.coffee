###
PDF Generator for {Poe.Document} using PDFKit
@see http://pdfkit.org/docs/getting_started.html
@see http://pdfkit.org/
###
class Poe.PDF
	###
	Creates a PDF writer

	@param document [Poe.Document] the document that will be used to generate
	the pdf
	###
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

	###
	Create the PDF and open the blob created in a new window of the browser.
	@return [Poe.PDF] this
	###
	generate: =>
		@doc = new PDFDocument
		@stream = @doc.pipe(blobStream())
		@stream.on 'finish', @finalize
		@registeredFonts = []

		for page in @document.children
			@generatePage false, page

		@doc.end()
		return this

	###
	Generate a paragraph in the PDF. This is an internal method used
	for generating the pdf.
	@param paragraph [Poe.Paragraph] the paragraph to use
	@see Poe.PDF#generate
	###
	generateParagraph: (paragraph) ->
		for line in paragraph.children
			pstyle = new Poe.ParagraphStyle()
			pstyle.update(paragraph)
			@formatting.align = pstyle.align
			@generateLine line
		return this

	###
	Generate a line in the PDF. This is an internal method used for generating the PDF.

	@param line [Poe.Line] the line to use
	###
	generateLine: (line) ->
		@doc.x = 72
		@doc.y += parseInt(line.element.css('padding-bottom').replace('px','')) * 0.75
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
				.lineWidth .03
				.strokeColor textStyle.color
				.text word.element[0].textContent,
					continued: cont
					underline: textStyle.underline
					stroke: textStyle.bold
					fill: true
			if textStyle.italic
				@doc.restore()
		return this

	###
	Generate a page in the PDF. This is for internal use.
	@param addPage [boolean] Defaults to false.
	###
	generatePage: (addPage = false, page) ->
		for paragraph in page.children
			@generateParagraph paragraph
		if page.index() != @document.children.length-1
			@doc.addPage
				margin: @margins.top

	###
	Finalizes the PDF by converting it to a blob url, and opening
	the url in the browser.

	@note It seems only chrome is able to recognize the blob url as pdf and
	allow the user to view it inside the browser. Firefox downloads it, and the
	others just completely ignore it.
	###
	finalize: =>
		blob = @stream.toBlobURL('application/pdf')
		w = window.open(blob)
		w.focus()
