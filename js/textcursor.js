'use strict';
poe.TextCursor = {
    Move: {
        Char: 1,
        Word: 2,
        Line: 3
        //Paragraph: 4
    },
    
    create: function (forNode) {
        return new poe.textCursor(forNode);
    }
};

poe.Types.TextCursor = 'TextCursor';

poe.textCursor = function (forNode) {
    var anchor = $('<span class="textcursor"></span>'),
        range = $('<span class="textcursorrange"></span>'),
        visibleCursor = $('<div class="visiblecursor"></div>'),
        blinkTimer,
        styleChangedCallback,
        
        blinkCursor = function () {
            $('.visiblecursor').toggleClass('hide');
        },
    
        stopBlink = function () {
            clearInterval(blinkTimer);
            $('.visiblecursor').removeClass('hide');
        },

        startBlink = function () {
            blinkTimer = setInterval(blinkCursor, 700);
        },
        
        style = {
            bold: false,
            italic: false,
            underline: false,
            
            font: {
                size: 12,
            }
        },
        
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
            style: function() {
                return style;  
            },
            
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

            position: function () {
                return anchor.position();
            },

            next: function () {
                var word = self.currentWord();
                var ret =  anchor.nextTextNode();
                if (self.currentWord()[0] !== word[0])
                    updateStyle();
                return ret;
            },

            prev: function () {
                var word = self.currentWord();
                var ret =  anchor.prevTextNode();
                if (self.currentWord()[0] !== word[0])
                    updateStyle();
                return ret;
            },
            
            nextNode: function () {
                return anchor.nextNode();
            },
            
            prevNode: function () {
                return anchor.prevNode();
            },

            currentWord: function () {
                return anchor.parents(poe.Selectors.Word);
            },

            currentLine: function () {
                return anchor.parents(poe.Selectors.Line);
            },

            currentPage: function () {
                return anchor.parents(poe.Selectors.Page);
            },

            nextWord: function () {
                var node = anchor.parents(poe.Selectors.Word).nextSibling();
                while (!node.hasClass('word') && node.isValid()) {
                    node = node.nextNode();
                }

                return node;
            },

            prevWord: function () {
                var node = anchor.parents(poe.Selectors.Word).prevNode();
                while (!node.hasClass('word') && node.isValid()) {
                    node = node.prevNode();
                }

                return node;
            },

            nextLine: function () {
                var node = self.currentLine().nextSibling();

                while (!node.hasClass('line') && node.isValid()) {
                    node = node.nextSibling();
                }

                return node;
            },

            prevLine: function () {
                var node = self.currentLine().prevSibling();
                while (!node.hasClass('line') && node.isValid()) {
                    node = node.prevSibling();
                }

                return node;
            },

            nextPage: function () {
                return self.currentPage().next(poe.Selectors.Page);
            },

            prevPage: function () {
                return self.currentPage().prev(poe.Selectors.Page);
            },

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

            insertBefore: function (data) {
                anchor.before(data);
                self.updateVisibleCursor();
            },

            insertAfter: function (data) {
                anchor.after(data);
                self.updateVisibleCursor();
            },

            updateVisibleCursor: function () {
                visibleCursor.css('left', anchor.position().left + 'px');
                visibleCursor.css('top', anchor.position().top + 'px');
            },
            
            on: function(event, callback) {
                if (event === 'styleChanged') {
                    styleChangedCallback = callback;
                    updateStyle();
                }
            },
            
            setBold: function (bold) {
                style.bold = bold;
                self.applyCharStyle(style);
            },
            
            setItalic: function (italic) {
                style.italic = italic;
                self.applyCharStyle(style);
            },
            
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