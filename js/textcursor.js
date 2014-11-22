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

        self = {
            type: function () {
                return poe.Types.TextCursor;
            },

            position: function () {
                return anchor.position();
            },

            next: function () {
                return anchor.nextTextNode();
            },

            prev: function () {
                return anchor.prevTextNode();
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