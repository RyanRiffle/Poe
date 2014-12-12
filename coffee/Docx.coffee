SaveToDisk = (blobURL, fileName) ->
  reader = new FileReader()
  reader.readAsDataURL(blobURL)
  reader.onload = (event) ->
    save = document.createElement('a')
    save.href = event.target.result
    save.target = '_blank'
    save.download = fileName || 'unknown file'

    event = document.createEvent('Event')
    event.initEvent('click', true, true)
    save.dispatchEvent(event)
    (window.URL || window.webkitURL).revokeObjectURL(save.href)

class Poe.Docx
  constructor: (poeDocument) ->
    @document = poeDocument
    @doc = new officegen('docx')
    $('body').keydown @generate
    @paragraphStyle = new Poe.ParagraphStyle()
    @textStyle = new Poe.TextStyle()
    @currentParagraph = null
    @currentPoeParagraph = null

  generate: (event) =>
    if event.keyCode != 27
      return;

    @doc = new officegen('docx')
    @stream = blobStream()
    stream = @stream

    for page in @document.children
      @generatePage page

    @doc.generate @stream
    @stream.on 'finish', (written) =>
      console.log stream
      url = stream.toBlob('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      SaveToDisk(url,"document.docx")
  
  generatePage: (page) ->
    for paragraph in page.children
      @paragraphStyle.update paragraph
      if !(paragraph instanceof Poe.List)
        @currentParagraph = @doc.createP()
      @currentPoeParagraph = paragraph
      @currentParagraph.options.align = @paragraphStyle.align
      @generateParagraph paragraph

  generateParagraph: (paragraph) ->
    for line in paragraph.children
      if line.children.length == 1 && line.child(0).element[0].textContent.charCodeAt(0) == 8203
          continue
      if line instanceof Poe.ListItem
        if @currentPoeParagraph.listType == Poe.List.ListType.Bullets
          @currentParagraph = @doc.createListOfDots()
          console.log 'dots'
        else
          @currentParagraph = @doc.createListOfNumbers()
      @generateLine line

  generateLine: (line) ->
    for word in line.children
      @textStyle.update word
      text = word.element[0].textContent
      text = text.replace(/[\u200B-\u200D\uFEFF]/g, '')

      @currentParagraph.addText text, 
        color: @textStyle.color
        bold: @textStyle.bold
        italic: @textStyle.italic
        font_face: @textStyle.font
        font_size: @textStyle.fontSize