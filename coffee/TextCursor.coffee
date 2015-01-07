###
Poe.TextCursor is the visible caret on the screen. It is where all of the magic
happens when it comes to user input. It listens for keydown event from the body element
and inserts the text typed before the cursor. It also handles word wrap and page wrap.

The cursor is actually handled in two different areas. There is a span and a visible
cursor, this.element and this.visibleCursor respectively. The span is actually the
cursor that is used. It has one child that is a zero width space &#8203; When the cursor
is moved the visible cursor gets updated to the position of that span. Making it look
like it is the cursor.
###
class Poe.TextCursor
  ###
  Creates a Poe.TextCursor instance
  @param [Poe.Word] inside the word to put the cursor inside
  ###
  constructor: (inside) ->
    if not inside
      throw new Error('Poe.TextCursor constructor expects one argument of type Poe.Word')

    @element = $ '<span class="textcursor">&#8203;</span>'
    @visibleCursor = $ '<div class="visiblecursor"></div>'
    @currentWord = inside
    @blinkTimer = null
    inside.prepend @element
    $('body').keydown(@keyEvent)
    @currentPage().parent.element.click @handleClick
    @textStyle = new Poe.TextStyle(this)
    @textStyle.applyWord @currentWord

    @paragraphStyle = new Poe.ParagraphStyle(this)
    @paragraphStyle.apply()
    @paragraphStyle.changed @paragraphStyleChanged
    @document = @currentPage().parent
    @document.element.append @visibleCursor

    @capsLock = off
    @show()

  ###
  Convienence function for getting the cursor contiaining word's parent
  @return [Poe.TextObject] the parent
  ###
  currentLine: ->
    return @currentWord.parent

  ###
  Convienence function for currentLine().parent
  @return [Poe.TextObject] currentLine().parent
  ###
  currentParagraph: ->
    return @currentLine().parent

  ###
  Convenience function for currentParagraph().parent
  @return [Poe.TextObject] currentParagraph().parent
  ###
  currentPage: ->
    return @currentParagraph().parent

  document: ->
    return @currentPage().parent

  ###
  Gets the next text node after the cursor. This will loop through all parents up to
  the Poe.Document if neccessary. It does not change any members unless applyChanges
  is true.
  @param applyChanges [Boolean] If true the currentWord is changed by this function.
  @return [null] if no node is found
  @return [jQuery or null] the next text node found
  ###
  next: ->
    next = @element.nextSibling()
    if next && next[0].textContent.charCodeAt(0) == 8203
      next.remove()
      next = @element.nextSibling()
    word = @currentWord
    if not next
      word = word.next()
      next = word?.children().first()
      @currentWord = word if word
    @textStyle.update(word) if word
    @paragraphStyle.update(word.parent.parent) if word
    return next

  ###
  Gets the previous text node before the cursor. This will loop through all parents up to
  the Poe.Document containing the cursor if neccessary. This does not change any members
  unless applyChanges is true.
  @param applyChanges [Boolean] Sets the current word on return to the word containing
  the return value.
  @return [null] if no node is found
  @return [jQuery or null] the previous text node found
  ###
  prev: ->
    prev = @element.prevSibling()
    if prev && prev[0].textContent.charCodeAt(0) == 8203
      prev.remove()
      prev = @element.prevSibling()
    word = @currentWord
    if not prev
      word = word.prev()
      prev = word?.children().last()
      @currentWord = word if word
    @textStyle.update(word) if word
    @paragraphStyle.update(word.parent.parent) if word
    return prev

  ###
  Moves the cursor before the previous text node found by prev()
  @return [Poe.TextCursor] this
  ###
  moveLeft: ->
    oldLine = @currentLine()
    prev = @prev()
    if prev
      if oldLine == @currentLine()
        prev.before @element
      else
        prev.after @element
    return this

  ###
  Moves the cursor after the next text node found by next()
  @return [Poe.TextCursor] this
  ###
  moveRight: ->
    oldLine = @currentLine()
    next = @next()
    if next
      if oldLine == @currentLine()
        next.after @element
      else
        next.before @element
    return this

  ###
  Moves the actual blinking cursor to where it should be.
  @return [Poe.TextCursor] this
  @private
  ###
  update: ->
    pos = @element.offset()
    @visibleCursor.css 'top', "#{pos.top}px"
    @visibleCursor.css 'left', "#{pos.left}px"
    @visibleCursor.css 'height', "#{@textStyle.fontSize}pt"
    return this

  ###
  Fixes word wrap. Starts off by calling {Poe.TextCursor#paragraphStyleChanged} then
  loops through all lines of the currentParagraph() and checks to see if the
  last word in that line is outside of the editable area. If the word is
  outside it gets moved down to the next line. If no line exists a line is created
  after it.
  @return [Poe.TextCursor] this
  @private
  ###
  doWordWrap: ->
    # Loop through all lines in the current paragraph
    for line in @currentParagraph().children
      if line.isEmpty()
        line.remove()
        continue
      while !line.visiblyContains line.children.last()
        if !line.next()
          newLine = new Poe.Line()
          newLine.element.attr('class', line.element.attr('class'))
          newLine.child(0).remove()
          newLine.insertAfter line
        else
          newLine = line.next()

        newLine.prepend line.children.last()

      childWidth = 0
      for child in line.children
        childWidth += child.width()

      break if not line.nextSibling()
      break if line.nextSibling() instanceof Poe.ListItem
      hasRoom = true
      while hasRoom
        child = line.nextSibling().child(0)
        break if not child

        if childWidth + child.width() < line.element.outerWidth(false)
          hasRoom = true
          child.insertAfter line.children.last()
        else
          hasRoom = false
    @doPageWrap()
    return this

  doPageWrap: ->
    overflows = (page, paragraph) ->
      paragraphBottom = paragraph.position().top + paragraph.height()
      pageBottom = page.position().top + page.height()
      pageBottom += parseInt(page.element.css('padding-top'))
      return paragraphBottom > pageBottom

    for page in @document.children
      while overflows(page, page.children.last())
        overflowedParagraph = page.children.last()
        if !page.next()
          newPage = new Poe.Page()
          newPage.insertAfter @currentPage()
          newPage.child(0).remove()
          console.log newPage.element

        next = page.next()
        paragraph = new Poe.Paragraph()
        paragraph.setName page.children.last().name()
        paragraph.child(0).remove()
        next.prepend paragraph

        line = overflowedParagraph.children.last()
        while overflows(page, line)
          paragraph.prepend line
          line = overflowedParagraph.children.last()
          if overflowedParagraph.isEmpty()
            overflowedParagraph.remove()
            break
        @show()

      nextPage = page.next()
      if not nextPage
        break
      availableSpace = 0
      for child in page.children
        availableSpace += child.height()
      pageHeight = page.height() + page.element.css('padding-top') + page.position().top
      availableSpace = pageHeight - availableSpace

      for paragraph in nextPage.children
        console.log paragraph
        for line in paragraph.children
          if line.height() < availableSpace
            console.log "#{line.height()} < #{availableSpace}"
            if paragraph.name() == page.children.last().name()
              page.children.last().append line
            else
              pgraph = new Poe.Paragraph()
              pgraph.child(0).remove()
              pgraph.insertAfter page.children.last()
              pgraph.append line
            if paragraph.isEmpty()
              paragraph.remove()


  ###
  Handles typing. At first it stops the cursor from blinking. Then does anything
  neccessary to translate the keydown onto the screen. Lastly it makes the cursor
  continue blinking.
  @private
  ###
  keyEvent: (event) =>
    if (event.ctrlKey)
      return
    event.preventDefault()
    @hide()
    switch event.keyCode
      when Poe.key.Shift then break

      when Poe.key.CapsLock
        @capsLock = !@capsLock

      when Poe.key.Left
        @moveLeft()

      when Poe.key.Right
        @moveRight()

      when Poe.key.Down
        if not @currentLine().next()
          return
        pos = @element.position()
        pos.top = @currentLine().next().position().top

        pos.clientX = pos.left - 2
        pos.clientY = pos.top + 2
        pos.target = @currentLine().next().element[0]

        @handleClick pos

      when Poe.key.Up
        if not @currentLine().prev()
          return
        pos = @element.position()
        pos.top = @currentLine().prev().position().top

        pos.clientX = pos.left + 2
        pos.clientY = pos.top + 2
        pos.target = @currentLine().prev().element[0]

        @handleClick pos

      when Poe.key.Enter
        if @currentParagraph() instanceof Poe.List
          li = new Poe.ListItem()
          li.insertAfter @currentLine()
          @moveInside li.child(0)
          @textStyle.applyWord()
          break

        paragraph = new Poe.Paragraph()
        paragraph.insertAfter @currentParagraph()
        line = paragraph.child(0)
        word = line.child(0)
        @textStyle.applyWord word
        while @element.nextSibling()
          word.element.append @element.nextSibling()

        while @currentWord.element.nextSibling()
          line.append @currentWord.next()

        # Move all lines after the current to the new paragraph
        while @currentLine().element.nextSibling()
          paragraph.append @currentLine().next()

        if @currentWord.children().length == 1 and @currentLine().children.length == 1
          @currentWord.element.append '&#8203;'

        @currentWord = word
        if @currentWord.isEmpty() and @currentLine().children.length == 1
          @currentWord.element.append '&#8203;'
        @currentWord.element.prepend @element
        @textStyle.apply @currentWord
        if event.shiftKey
          @paragraphStyle.apply()
        @paragraphStyle.update @currentParagraph()
        @doWordWrap()


      when Poe.key.Backspace
        oldWord = @currentWord
        oldLine = @currentLine()
        oldParagraph = @currentParagraph()
        oldPage = @currentPage()
        prev = @prev()

        if oldParagraph instanceof Poe.List
          if oldLine instanceof Poe.ListItem
            if oldLine.children.length == 1 && oldWord.children().length == 1
              if oldLine.index() == oldParagraph.children.length-1
                paragraph = new Poe.Paragraph()
                paragraph.insertAfter oldParagraph
                @moveInside paragraph.child(0).child(0)
                @textStyle.applyWord (@currentWord)
                @paragraphStyle.apply()
                oldLine.remove()

                if oldParagraph.isEmpty()
                  oldParagraph.remove()
              break

        if not prev
          break

        prev.after @element if prev
        prev.remove() if prev && oldLine == @currentLine()

        if oldPage.isEmpty()
          oldPage.remove()
        else if oldParagraph.isEmpty()
          oldParagraph.remove()
        else if oldLine.isEmpty()
          oldLine.remove()
        else if oldWord.isEmpty()
          oldWord.remove()
        @doWordWrap()

      when Poe.key.Delete
        next = @next()
        next.remove() if next

      when Poe.key.Space
        @element.before " "
        word = new Poe.Word()
        word.insertAfter @currentWord
        next = @element.nextSibling()
        while next
          word.append next
          next = @element.nextSibling()
        word.prepend @element
        @currentWord = word
        @textStyle.applyWord @currentWord
        @doWordWrap()
      else
        if event.shiftKey and @capsLock
          event.shiftKey = false
        else if not event.shiftKey and @capsLock and event.keyCode >= 65 and event.keyCode <= 90
          event.shiftKey = true
        letter = Poe.keyMapShift[event.keyCode] if event.shiftKey
        letter = Poe.keyMap[event.keyCode] unless event.shiftKey
        @element.before letter
        @doWordWrap()
    @show()

  handleClick: (event) =>
    [x, y] = [event.clientX, event.clientY]
    target = $(event.target)

    self = this

    # Checks if the mouse click was around the right area, only allows for excess on the x axis
    checkRelative = (element) =>
      pos = element.offset()
      pos.bottom = pos.top + element.height()

      if y >= pos.top && y <= pos.bottom
        return true
      return false

    checkAbsolute = (element) =>
      pos = element.offset()
      pos.bottom = pos.top + element.height()
      pos.right = pos.left + element.width()

      if x >= pos.left && x <= pos.right && y >= pos.top && y <= pos.bottom
        return true
      return false

    findInWord = (word) =>
      for node in word[0].childNodes
        range = document.createRange()
        range.selectNode node
        rect = range.getClientRects()[0];

        if x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
          self.currentWord = self.currentPage().parent.objectFromElement(word)
          $(node).before self.element
          break

    findInLine = (line) =>
      console.log "#{x} < #{line.children().first().offset().left}"
      if x < line.children().first().offset().left
        word = line.children().first()
        self.currentWord = self.currentPage().parent.objectFromElement(word)
        word.prepend self.element
      else if x > line.children().last().offset().left + line.children().last().width()
        word = line.children().last()
        self.currentWord = self.currentPage().parent.objectFromElement(word)
        word.append self.element
      else
        for child in line.children()
          child = $(child)
          if checkAbsolute(child)
            findInWord(child)
            break

    findInParagraph = (paragraph) =>
      for child in paragraph.children()
        child = $(child)
        if checkRelative(child)
          findInLine(child)
          break

    findInPage = (page) =>
      last = page.children().last()
      if y > last.position().top + last.height()
        word = last.children().last().children().last()
        word.append @element
        @currentWord = @document.objectFromElement(word)
        return

      first = page.children().first()
      if y < first.position().top
        word = first.children().first().children().first()
        word.prepend @element
        @currentWord = @document.objectFromElement(word)
        return

      for child in page.children()
        child = $(child)
        if checkRelative(child)
          findInParagraph(child)
          break

    obj = @document.objectFromElement(target)
    if obj instanceof Poe.Page
      findInPage(target)
    else if obj instanceof Poe.Paragraph
      findInParagraph(target)
    else if obj instanceof Poe.Line
      findInLine(target)
    else if obj instanceof Poe.Word
      findInWord(target)
    @textStyle.update(@currentWord)
    @paragraphStyle.update @currentParagraph()
    @show()


  ###
  Callback registered with {Poe.ParagraphStyle} that will update the whole
  paragraph's alignment.
  ###
  paragraphStyleChanged: (style) =>
    @show()

  ###
  Moves the cursor inside and at the front of word
  @param word [Poe.Word] the word to move it inside
  @throws [Error] if the word is not a Poe.Word
  @return [Poe.TextCursor] this
  ###
  moveInside: (word) ->
    if not word instanceof Poe.Word
      throw new Error('Can only move inside a Poe.Word')

    word.prepend @element
    @currentWord = word
    @show()
    return this

  ###
  Shows the cursor if it is hidden and sets a time to make the cursor blink if
  it is not already.
  @return [Poe.TextCursor] this
  ###
  show: =>
    @update()

    if Poe.writer
      if @currentParagraph() instanceof Poe.List
        Poe.writer.toolbar.setToolBar Poe.ToolBar.DynamicPart.List
      else if @currentParagraph() instanceof Poe.Paragraph
        Poe.writer.toolbar.setToolBar Poe.ToolBar.DynamicPart.Paragraph

    @visibleCursor.removeClass 'hide'
    pos = @element.position()
    if pos.top > window.innerHeight - (@currentLine().height() * 3)
      $('.writer').animate
        scrollTop: $('.writer').scrollTop() + (@currentLine().height() * 3)
      , 200
    return if @blinkTimer
    @blinkTimer = setInterval @blink, 700
    return this

  ###
  Hides the cursor if it is visible and stops it from blinking.
  @return [Poe.TextCursor] this
  ###
  hide: =>
    clearInterval @blinkTimer
    @blinkTimer = null
    @visibleCursor.addClass 'hide'
    return this

  ###
  Controls the actual blinking of the cursor. See show()
  @private
  ###
  blink: =>
    @visibleCursor.toggleClass 'hide'
