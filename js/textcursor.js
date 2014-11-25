'use strict';
poe.TextCursor = {
    Move: {
        Char: 1,
        Word: 2,
        Line: 3
    },
    
    create: function (forNode) {
        return new poe.textCursor(forNode);
    }
};

poe.Types.TextCursor = 'TextCursor';

poe.textCursor = function (forNode) {
    var anchor = $('<span class="textcursor"></span>'),
        range = $('<span class="textcursorrange"></span>'), //For selections
        visibleCursor = $('<div class="visiblecursor"></div>'),
        blinkTimer, //Cursor blink timer
        styleChangedCallback,
        
        blinkCursor = function () {
            $('.visiblecursor').toggleClass('hide');
        },
    
        /*
            Used to stop the cursor from blinking when the user is typing.
        */
        stopBlink = function () {
            clearInterval(blinkTimer);
            $('.visiblecursor').removeClass('hide');
        },

        /*
            Restarts the blinking of the cursor after the typing is done.
        */
        startBlink = function () {
            blinkTimer = setInterval(blinkCursor, 700);
        },
        
        style = {
            bold: false,
            italic: false,
            underline: false,
            color: 'black',
            font: {
                size: 12,
            }
        },
        
        /*
            Updates the style stored in style to reflect the style of the current word.
            It is updated every time the current word changes.
        */
        updateStyle = function() {
            var tmp;
            var styleChanged = false;
            if (tmp = self.currentWord().hasClass('bold') !== style.bold) {
                style.bold = tmp;
                styleChanged = true;
            }
            
            if (tmp = self.currentWord().hasClass('italic') !== style.italic) {
                style.italic = tmp;
                styleChanged = true;
            }
            
            if (tmp = self.currentWord().hasClass('underline') !== style.underline) {
                style.underline = tmp;
                styleChanged = true;
            }
            
            if (tmp = parseInt(self.currentWord().css('font-size').replace('px','')) !== style.font.size) {
                style.font.size = tmp;
                styleChanged = true;
            }
            
            if (styleChanged) {
                styleChangedCallback();
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
                        family: 'Open Sans'
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
                
                if (style.bold) {
                    self.currentWord().addClass('bold');
                }

                style.italic = newStyle.italic;
                
                if (style.italic) {
                    self.currentWord().addClass('italic');
                }
            
                style.underline = newStyle.underline;
                
                if (style.underline) {
                    self.currentWord().addClass('underline');
                }
                
                styleChangedCallback();
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
                if (self.currentWord()[0] !== word[0])
                    updateStyle();
                return ret;
            },

            /*
                Returns a jQuery object of the previous text node found in the document.
            */
            prev: function () {
                var word = self.currentWord();
                var ret =  anchor.prevTextNode();
                if (self.currentWord()[0] !== word[0])
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
                stopBlink();
                if (typeof (TextCursorMove) !== 'number') {
                    throw {
                        error: 'poe.TextCursor.Move.* should be the first argument to move functions.'
                    };
                }

                if (typeof (count) !== 'number') {
                    count = 1;
                }

                var char = function () {
                    var x;
                    for (x = 0; x < count; x = x + 1) {
                        if (!self.next().isValid()) {
                            break;
                        }
                        self.next().after(anchor);
                    }
                },

                    word = function () {
                        var x;
                        for (x = 0; x < count; x = x + 1) {
                            if (!self.nextWord().isValid()) {
                                break;
                            }
                            self.nextWord().prepend(anchor);
                        }
                    },
                    line = function () {
                        var x;
                        for (x = 0; x < count; x = x + 1) {
                            if (!self.nextLine().isValid()) {
                                break;
                            }
                            self.nextLine().firstChild().prepend(anchor);
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
                startBlink();
            },

            /*
                Move the cursor left count times.
                TextCursorMove      see poe.TextCursor.Move
            */
            moveLeft: function (TextCursorMove, count) {
                stopBlink();
                if (typeof (TextCursorMove) !== 'number') {
                    throw {
                        error: 'poe.TextCursor.Move.* should be the first argument to move functions.'
                    };
                }

                if (typeof (count) !== 'number') {
                    count = 1;
                }

                var char = function () {
                    var x;
                    for (x = 0; x < count; x = x + 1) {
                        if (!self.prev().isValid()) {
                            break;
                        }
                        
                        self.prev().before(anchor);
                    }
                },

                    word = function () {
                        var x = 0;
                        for (x = 0; x < count; x = x + 1) {
                            if (!self.prevWord().isValid()) {
                                break;
                            }
                            self.prevWord().append(anchor);
                        }
                    },

                    line = function () {
                        var x;
                        for (x = 0; x < count; x += 1) {
                            if (!self.prevLine().isValid()) {
                                break;
                            }
                            self.prevLine().prevWord().append(anchor);
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
                startBlink();
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

        startBlink();
        self.updateVisibleCursor();
    }());
    
    // Return the cursor object that will be used
    return self;
};