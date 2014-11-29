'use strict';
poe.TextCursor = {
    Move: {
        Char: 1,
        Word: 2,
        Line: 3
    },
    
    Align: {
        Left: 1,
        Center: 2,
        Right: 3,
        Justify: 4
    },
    
    create: function (forNode) {
        return new poe.textCursor(forNode);
    }
};

poe.Types.TextCursor = 'TextCursor';

poe.textCursor = function (forNode) {
    var anchor = $('<span class="textcursor"></span>'),
        visibleCursor = $('<div class="visiblecursor"></div>'),
        blinkTimer, //Cursor blink timer
        styleChangedCallback,
        leftMouseButtonDown = false,
        anchorIsSet = false,
        
        blinkCursor = function () {
            $('.visiblecursor').toggleClass('hide');
        },
        
        style = {
            bold: false,
            italic: false,
            underline: false,
            color: 'black',
            align: poe.TextCursor.Align.Left,
            font: {
                size: 16,
                name: 'Tinos'
            }
        },
        
        /*
            Updates the style stored in style to reflect the style of the current word.
            It is updated every time the current word changes.
        */
        updateStyle = function() {
            var tmp;
            var styleChanged = false;
            
            if ((tmp = self.currentWord().hasClass('bold')) !== style.bold) {
                style.bold = tmp;
                styleChanged = true;
            }
            
            if ((tmp = self.currentWord().hasClass('italic')) !== style.italic) {
                style.italic = tmp;
                styleChanged = true;
            }
            
            if ((tmp = self.currentWord().hasClass('underline')) !== style.underline) {
                style.underline = tmp;
                styleChanged = true;
            }
            
            tmp = 0;
            if (self.currentLine().hasClass('align-left')) {
                tmp = poe.TextCursor.Align.Left;
            } else if (self.currentLine().hasClass('align-center')) {
                tmp = poe.TextCursor.Align.Center;
            } else if (self.currentLine().hasClass('align-right')) {
                tmp = poe.TextCursor.Align.Right;
            } else if (self.currentLine().hasClass('align-justify')) {
                tmp = poe.TextCursor.Align.Justify;
            }
            
            if (tmp !== style.align) {
                style.align = tmp;
                styleChanged = true;
            }
            
            if ((tmp = self.currentWord().css('color')) !== style.color) {
                style.color = tmp;
                styleChanged = true;
            }
            
            if ((tmp = parseInt(self.currentWord().css('font-size').replace('px',''))) !== style.font.size) {
                style.font.size = tmp;
                styleChanged = true;
            }
            
            if ((tmp = self.currentWord().css('font-family').replace('"', '')) !== style.font.name) {
                style.font.name = tmp;
                styleChanged = true;
            }
            
            if (styleChanged && styleChanged) {
                styleChangedCallback();
                visibleCursor.height(style.font.size + 'px');
            }
        },

        self = {
            /*
                Returns the style of the current word.
                {
                    bold: false,
                    italic: false,
                    underline: false,
                    color: '#000000',
                    background-color: '#ffffff',
                    font: {
                        size: 12,
                        family: 'Calibri'
                    }
                }
                
                Note: font.size is always in point size.
                Note: colors are based on css color codes, because they are inserted into the document as
                      specified in the style attribute.
            */
            style: function() {
                return style;  
            },
            
            /*
                Apply a style to the current word. newStyle should have the same format as style()
            */
            applyStyle: function(newStyle) {
                style.bold = newStyle.bold;
                
                //Remove all style classes
                self.currentWord().attr('class', 'word');
                self.currentLine().attr('class', 'line');
                
                if (style.bold) {
                    self.currentWord().addClass('bold');
                }

                style.italic = newStyle.italic;
                if (style.italic) {
                    self.currentWord().addClass('italic');
                }
            
                style.underline = newStyle.underline;
                
                var alignClass = '';
                if (style.align) {
                    switch(style.align) {
                    case poe.TextCursor.Align.Left:
                        alignClass = 'align-left';
                        break;
                            
                    case poe.TextCursor.Align.Center:
                        alignClass = 'align-center';
                        break;
                            
                    case poe.TextCursor.Align.Right:
                        alignClass = 'align-right';
                        break;
                            
                    case poe.TextCursor.Align.Justify:
                        alignClass = 'align-justify';
                        break;
                    }
                }
                
                self.currentLine().addClass(alignClass);
                self.currentLine().nextUntil('.newline').each(function (index, line) {
                    $(line).addClass(alignClass); 
                });
                
                self.currentLine().prevUntil('.newline').each(function (index, line) {
                    $(line).addClass(alignClass); 
                });
                
                if (style.underline) {
                    self.currentWord().addClass('underline');
                }
                
                if (newStyle.color) {
                    style.color = newStyle.color;
                    self.currentWord().css('color', style.color);
                }
                
                if (newStyle.font.name) {
                    style.font.name = newStyle.font.name;
                    self.currentWord().css('font-family', '"' + style.font.name + '"');
                }
                
                if (newStyle.font.size) {
                    style.font.size = newStyle.font.size;
                    self.currentWord().css('font-size', style.font.size + 'px');
                    visibleCursor.height(style.font.size + 'px');
                }
                
                if (styleChangedCallback)
                    styleChangedCallback();
            },
            
            /*
                Used to stop the cursor from blinking when the user is typing.
            */
            stopBlink: function () {
                clearInterval(blinkTimer);
                $('.visiblecursor').removeClass('hide');
            },

            /*
                Restarts the blinking of the cursor after the typing is done.
            */
            startBlink: function () {
                blinkTimer = setInterval(blinkCursor, 700);
            },

            /*
                Returns the position of the cursor on the screen by client rects. Not global screen coordinates.
            */
            position: function () {
                return anchor.position();
            },

            /*
                Returns a jQuery object of the previous text node found in the document.
            */
            next: function () {
                var word = self.currentWord();
                var ret =  anchor.nextTextNode();
                if (ret.parents(poe.Selectors.Word)[0] !== word[0])
                    updateStyle();
                return ret;
            },

            /*
                Returns a jQuery object of the previous text node found in the document.
            */
            prev: function () {
                var word = self.currentWord();
                var ret =  anchor.prevTextNode();
                if (ret.parents(poe.Selectors.Word)[0] !== word[0])
                    updateStyle();
                return ret;
            },
            
            /*
                Like jQuery's .next() but it works with all nodes including text nodes.
            */
            nextNode: function () {
                return anchor.nextNode();
            },
            
            /*
                Like jQuery's .prev() but it works with all nodes including text nodes
            */
            prevNode: function () {
                return anchor.prevNode();
            },

            /*
                Returns the cursor containing word as a jQuery object.
            */
            currentWord: function () {
                return anchor.parents(poe.Selectors.Word);
            },

            /*
                Returns the cursor containing line as a jQuery object.
            */
            currentLine: function () {
                return anchor.parents(poe.Selectors.Line);
            },

            /*
                Returns the cursor containg page as a jQuery object.
            */
            currentPage: function () {
                return anchor.parents(poe.Selectors.Page);
            },

            /*
                Returns the word after the cursor containing word as a jQuery object.
            */
            nextWord: function () {
                var node = anchor.parents(poe.Selectors.Word).nextSibling();
                while (!node.hasClass('word') && node.isValid()) {
                    node = node.nextNode();
                }

                return node;
            },

            /*
                Returns the word before the cursor containing word as a jQuery object.
            */
            prevWord: function () {
                var node = anchor.parents(poe.Selectors.Word).prevNode();
                while (!node.hasClass('word') && node.isValid()) {
                    node = node.prevNode();
                }

                return node;
            },

            /*
                Returns the line after the current line as a jQuery object
            */
            nextLine: function () {
                var node = self.currentLine().nextSibling();

                while (!node.hasClass('line') && node.isValid()) {
                    node = node.nextSibling();
                }

                return node;
            },

            /*
                Returns the line before the current line as a jQuery object.
            */
            prevLine: function () {
                var node = self.currentLine().prevSibling();
                while (!node.hasClass('line') && node.isValid()) {
                    node = node.prevSibling();
                }

                return node;
            },

            /*
                Returns the page after the cursur containing page as a jQuery object.
            */
            nextPage: function () {
                return self.currentPage().next(poe.Selectors.Page);
            },

            /*
                Returns the page before the cursor containing page as a jQuery object.
            */
            prevPage: function () {
                return self.currentPage().prev(poe.Selectors.Page);
            },

            /*
                Moves the cursor right count times
                TextCursorMove      see poe.TextCursor.Move
            */
            moveRight: function (TextCursorMove, count) {
                if (self.hasSelection()) {
                    $(self.range().endContainer).before(anchor);
                    rangy.getSelection().setSingleRange(rangy.createRange());
                }
                
                self.stopBlink();
                if (typeof (TextCursorMove) !== 'number') {
                    throw {
                        error: 'poe.TextCursor.Move.* should be the first argument to move functions.'
                    };
                }

                if (typeof (count) !== 'number') {
                    count = 1;
                }

                var char = function () {
                    var x,
                        tmp;
                    for (x = 0; x < count; x = x + 1) {
                        tmp = self.next();
                        if (!tmp.isValid()) {
                            break;
                        }
                        tmp.after(anchor);
                    }
                },

                    word = function () {
                        var x,
                            tmp;
                        for (x = 0; x < count; x = x + 1) {
                            tmp = self.nextWord();
                            if (!tmp.isValid()) {
                                break;
                            }
                            tmp.prepend(anchor);
                        }
                    },
                    line = function () {
                        var x,
                            tmp;
                        for (x = 0; x < count; x = x + 1) {
                            tmp = self.nextLine();
                            if (!tmp.isValid()) {
                                break;
                            }
                            tmp.firstChild().prepend(anchor);
                        }
                    };

                switch (TextCursorMove) {
                case poe.TextCursor.Move.Char:
                    char();
                    break;

                case poe.TextCursor.Move.Word:
                    word();
                    break;

                case poe.TextCursor.Move.Line:
                    line();
                    break;
                }

                self.updateVisibleCursor();
                self.startBlink();
            },

            /*
                Move the cursor left count times.
                TextCursorMove      see poe.TextCursor.Move
            */
            moveLeft: function (TextCursorMove, count) {
                if (self.hasSelection()) {
                    $(self.range().startContainer).after(anchor);
                    rangy.getSelection().setSingleRange(rangy.createRange());
                }
                
                self.stopBlink();
                if (typeof (TextCursorMove) !== 'number') {
                    throw {
                        error: 'poe.TextCursor.Move.* should be the first argument to move functions.'
                    };
                }

                if (typeof (count) !== 'number') {
                    count = 1;
                }

                var char = function () {
                    var x,
                        tmp;
                    for (x = 0; x < count; x = x + 1) {
                        tmp = self.prev();
                        if (!tmp.isValid()) {
                            break;
                        }
                        
                        tmp.before(anchor);
                    }
                },

                    word = function () {
                        var x = 0,
                            tmp;
                        for (x = 0; x < count; x = x + 1) {
                            tmp = self.prevWord();
                            if (!tmp.isValid()) {
                                break;
                            }
                            tmp.append(anchor);
                        }
                    },

                    line = function () {
                        var x,
                            tmp;
                        for (x = 0; x < count; x += 1) {
                            tmp = self.prevLine();
                            if (!tmp.isValid()) {
                                break;
                            }
                            tmp.prevWord().append(anchor);
                        }
                    };

                switch (TextCursorMove) {
                case poe.TextCursor.Move.Char:
                    char();
                    break;

                case poe.TextCursor.Move.Word:
                    word();
                    break;

                case poe.TextCursor.Move.Line:
                    line();
                    break;
                }

                self.updateVisibleCursor();
                self.startBlink();
            },

            /*
                Insert something before the cursor. This is basically jQuery .before()
            */
            insertBefore: function (data) {
                anchor.before(data);
                self.updateVisibleCursor();
            },

            /*
                Insert something after the cursor. This is basically jQuery .after()
            */
            insertAfter: function (data) {
                anchor.after(data);
                self.updateVisibleCursor();
            },

            /*
                Move the visible cursor to the 'fake' anchor cursor.
            */
            updateVisibleCursor: function () {
                visibleCursor.css('left', anchor.position().left + 'px');
                visibleCursor.css('top', anchor.position().top + 'px');
            },
            
            /*
                Register a callback.
                The only valid event at the moment is 'styleChanged' and is called
                when the style of the word that the cursor is in is different that the current
                set style.
            */
            on: function(event, callback) {
                if (event === 'styleChanged') {
                    styleChangedCallback = callback;
                    updateStyle();
                }
            },
            
            /*
                Enables / disables bold text.
                It only applies to what is typed after calling this function.
            */
            setBold: function (bold) {
                style.bold = bold;
                self.applyCharStyle(style);
            },
            
            /*
                Enables / disables italic text.
                It only applies to what is typed after calling this function.
            */
            setItalic: function (italic) {
                style.italic = italic;
                self.applyCharStyle(style);
            },
            
            /*
                Enables / disables underlined text.
                It only applies to what is typed after calling this function.
            */
            setUnderline: function (underline) {
                style.underline = underline;
                self.applyCharStyle(style);
            },
            
            /*
                Creates three words from the current one. The text before
                the cursor, text after, and a word in the middle to contain the
                cursor and apply the style.
            */
            applyCharStyle: function (style) {
                var word = $(poe.Elements.Word),
                    word2 = $(poe.Elements.Word);
                self.currentWord().after(word);
                word.append(anchor.nextAll());
                word.before(word2);
                word2.append(anchor);
                $(poe.Selectors.Word).filter(':empty').remove();
                self.applyStyle(style);
                self.updateVisibleCursor();
            },
            
            splitWordAtCursor: function(callback) {
                var back = $(poe.Elements.Word);
                self.currentWord().after(back);
                while (anchor.nextSibling().isValid()) {
                    back.append(anchor.nextSibling());
                }
                if (self.currentWord().is(':empty'))
                    self.currentWord().remove();
                callback(back);
                if (back.is(':empty'))
                    back.remove();
            },
            
            range: function () {
                var sel = rangy.getSelection();
                return sel.getRangeAt(0);
            },
            
            hasSelection: function () {
                var isCollapsed = rangy.getSelection().isCollapsed;
                if (!isCollapsed && rangy.getSelection().getRangeAt(0).toString() === '')
                    return false;
                
                return !isCollapsed;
            },
            
            removeSelectedText: function () {
                var range = self.range();
                $(range.startContainer).before(anchor);
                range.deleteContents();
                rangy.getSelection().setSingleRange(rangy.createRange());
                $(poe.Selectors.Word).each(function (index, elm) {
                    var word = $(elm);
                    if (word.textContent() === '') {
                        word.remove();
                    }
                });
                $(poe.Selectors.Line).filter(':empty').remove();
            }
        },
        
        textNodeAtPos = function (x, y) {
            var ret = $();
            if (y < $(poe.Selectors.Line).first().position().top) {
                ret = $(poe.Selectors.Line).first().nextTextNode();
                if (ret[0] === anchor[0]) {
                    return anchor.nextSibling();
                }
                
                return ret;
            } else if (y > $(poe.Selectors.Line).last().pos().bottom) {
                ret = $(poe.Selectors.Line).last().children(poe.Selectors.Word).last().childNodes().last();
                if (ret[0] === anchor[0]) {
                    return anchor.prevSibling();
                }
                return $(poe.Selectors.Line).last().children(poe.Selectors.Word).last().childNodes().last();
            }
            
            $(poe.Selectors.Line).each(function(index, element) {
                var $line = $(element);
                
                if (y >= $line.pos().top && y <= $line.pos().bottom) {
                    $line.children(poe.Selectors.Word).each(function (wordindex, wordelement) {
                         var $word = $(wordelement);
                        if (x >= $word.pos().left && x <= $word.pos().right) {
                            $word.childNodes().each(function (textindex, textelement) {
                                var $text = $(textelement);
                                var range = document.createRange();
                                range.selectNode(textelement);
                                var rect = range.getClientRects()[0];
                                
                                if (rect && x >= rect.left && x <= rect.right) {
                                    ret = $text;
                                }
                            });
                        }
                    });
                }
            });
            
            return ret;
        },
        
        handleMouseUp = function (event) {
            if (self.hasSelection())
                return;
            
            var node = textNodeAtPos(event.clientX, event.clientY);
            if (node.isValid() && node.parent().hasClass('word')) {
                node.before(anchor);
                self.updateVisibleCursor();
            }
        };

    //Contstructor
    (function () {
        if (typeof (forNode) !== 'undefined' && forNode.isValid()) {
            if (forNode.isTextNode()) {
                forNode.before(anchor);
            } else if (forNode.isElement()) {
                forNode.prepend(anchor);
            }
        } else {
            $(poe.Selectors.Word).first().prepend(anchor);
        }
        
        $('body').append(visibleCursor);
        $('.writer').scroll(self.updateVisibleCursor);
        $('.writer').mouseup(handleMouseUp);

        self.applyStyle(style);
        self.startBlink();
        self.updateVisibleCursor();
    }());
    
    // Return the cursor object that will be used
    return self;
};