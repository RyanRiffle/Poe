class Poe.TextCursor
  constructor: (inside) ->
    if not inside
      throw new Error('Poe.TextCursor constructor expects one argument of type Poe.Word')

    @element = $ '<span class="textcursor"></span>'
    @visibleCursor = $ '<div class="visiblecursor"></div>'
    @currentWord = inside
    @blinkTimer = null
    inside.prepend @element
    $('body').append @visibleCursor
    @show()
    $('body').keydown(@keyEvent)
    @textStyle = new Poe.TextStyle(this)
    @textStyle.applyWord @currentWord


  currentLine: ->
    return @currentWord.parent

  currentParagraph: ->
    return @currentLine().parent

  currentPage: ->
    return @currentParagraph().parent

  ###
  next returns the next text node in the document as a jQuery object
  returns null if no node exists
  ###
  next: (applyChanges = false) ->
    next = @element.nextSibling()
    word = @currentWord
    line = word.parent
    paragraph = line.parent
    page = paragraph.parent
    while !next
      word = word.next()
      if !word
        line = line.next()
        if !line
          paragraph = paragraph.next()
          if !paragraph
            page = page.next()
            return null if !page
            paragraph = page.child 0
          line = paragraph.child 0
        word = line.child 0
      next = word.text().first()
    @textStyle.update word if @currentWord != word
    @currentWord = word if applyChanges and next
    return next

  ###
  prev returns the previous text node in the document as a jQuery object
  returns null if no node exists
  ###
  prev: (applyChanges = false) ->
    prev = @element.prevSibling()
    word = @currentWord
    line = word.parent
    paragraph = line.parent
    page = paragraph.parent
    while !prev
      [old, word] = [word, word.prev()]
      old.remove() if old.isEmpty()
      if !word
        line = line.prev()
        if !line
          paragraph = paragraph.prev()
          if !paragraph
            page = page.prev()
            return null if !page
            paragraph = page.children.last()
          line = paragraph.children.last()
        word = line.children.last()
      prev = word.text().last() if word.text().length > 0
    @textStyle.update word if @currentWord != word
    @currentWord = word if applyChanges and prev
    return prev

  ###
  moveLeft moves the cursor one text node to the left
  ###
  moveLeft: ->
    prev = @prev(true)
    prev.before @element if prev
    return this

  ###
  moveRight moves the cursor one text node to the left
  ###
  moveRight: ->
    next = @next(true)
    next.after @element if next
    return this

  ###
  update moves the actuall visible cursor to the correct position in the document
  ###
  update: ->
    @visibleCursor.css 'top', "#{@element.position().top}px"
    @visibleCursor.css 'left', "#{@element.position().left}px"

  ###
  doWordWrap checks all lines in a paragraph to see if it needs word wraped and then wraps it
  ###
  doWordWrap: ->
    # Loop through all lines in the current paragraph
    for line in @currentParagraph().children
      while !line.visiblyContains line.children.last()
        if !line.next()
          newLine = new Poe.Line()
          newLine.child(0).remove()
          newLine.insertAfter line
        else
          newLine = line.next()

        newLine.prepend line.children.last()

  ###
  keyEvent handles typing
  ###
  keyEvent: (event) =>
    if (event.ctrlKey)
      return
    event.preventDefault()
    @hide()
    switch event.keyCode
      when Poe.key.Shift then break

      when Poe.key.Left
        @moveLeft()

      when Poe.key.Right
        @moveRight()

      when Poe.key.Enter
        paragraph = new Poe.Paragraph()
        paragraph.insertAfter @currentParagraph()
        line = paragraph.child(0)
        word = line.child(0)
        while @element.nextSibling()
          word.element.append @element.nextSibling()

        while @currentWord.next()
          line.append @currentWord.next()

        # Move all lines after the current to the new paragraph
        while @currentLine().next()
          paragraph.append @currentLine().next()

        if @currentWord.text().length == 1 and @currentLine().children.length == 1
          @currentWord.element.append '&#8203;'

        console.log line.children.length
        @currentWord = word
        @currentWord.element.prepend @element
        @textStyle.apply @currentWord

      when Poe.key.Backspace
        # If the currentPage is empty there will be nothing to backspace
        if @currentPage().isEmpty() and @currentPage().index() == 0
          break

        prev = @prev()

        #Used for backspace over a word wrap
        if @currentWord.index() == 0
          word = @currentWord
          prev.before @element if prev
          prev.remove() if prev
          if @currentLine().index() != 0 and not @element.prevSibling()
            prev2 = @currentLine().prev().children.last()
            if prev2
              @currentWord = prev2
              @currentWord.append @element
            word.parent.remove if word.isEmpty()
            break
          else if @currentLine().index() == 0 and not @element.prevSibling()
            if @currentParagraph().index() == 0 and @currentPage().index() == 0
              break
            prev2 = @currentParagraph().prev().children.last().children.last()
            if prev2
              @currentWord = prev2
              @currentWord.append @element
            word.parent.parent.remove() if word.parent.parent.isEmpty()
            break

        prev.remove() if prev

        #If the cursor is at the beginning of the word move
        #it to the previous word and remove cursor containing
        #word if it is empty
        if not @element.prevSibling()
          prev2 = @prev()
          prev2.after @element if prev2
          word = @currentWord.prev()
          if @currentWord.isEmpty()
            @currentWord.remove()
            @currentWord = word

      when Poe.key.Delete
        next = @next()
        next.remove() if next

      when Poe.key.Space
        @element.before "&nbsp;"
        word = new Poe.Word()
        word.insertAfter @currentWord
        next = @element.nextSibling()
        while next
          word.append next
          next = next.nextSibling()
        word.prepend @element
        @currentWord = word
        @textStyle.applyWord @currentWord
        @doWordWrap()
      else
        letter = Poe.keyMapShift[event.keyCode] if event.shiftKey
        letter = Poe.keyMap[event.keyCode] unless event.shiftKey
        @element.before letter
        @doWordWrap()
    @show()

  ###
  Show the cursor
  ###
  show: ->
    @update()
    @visibleCursor.removeClass 'hide'
    return if @blinkTimer
    @blinkTimer = setInterval @blink, 700
    return this

  ###
  Hide the cursor
  ###
  hide: ->
    clearInterval @blinkTimer
    @blinkTimer = null
    @visibleCursor.addClass 'hide'
    return this

  ###
  Used by show, do not use by itself
  ###
  blink: =>
    @visibleCursor.toggleClass 'hide'
