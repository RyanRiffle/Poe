'use strict';

$('body').ready(function () {
    poe.Elements = {
        Word: '<span class="word"></span>',
        Line: '<div class="line"></div>',
        Page: '<div class="page-inner"></div>'
    };
    
    poe.Selectors = {
        Word: '.word',
        Line: '.line',
        Page: '.page-inner'
    };

    poe.Types.Writer = 'Writer';
    poe.Types.jQuery = 'jQuery';

    poe.writer = (function () {
        var doc = new poe.Document(),
            cursor = poe.TextCursor.create(),
            
            lineRemoved = function (page) {
                
            },

            updateWordWrap = function () {
                if (cursor.position().left > doc.lineOuterPosition()) {
                    if (!cursor.nextLine().isValid()) {
                        cursor.currentLine().after(poe.Elements.Line);
                    }
                    console.log(cursor.nextLine());
                    cursor.nextLine().prepend(cursor.currentWord());
                    cursor.updateVisibleCursor();
                } else if (cursor.nextLine().isValid() && !cursor.nextLine().hasClass('newline')) {
                    if (cursor.nextLine().firstChild().width() + cursor.currentLine().lastChild().pos().right < doc.lineOuterPosition()) {
                        cursor.currentLine().append(cursor.nextLine().firstChild());
                        if (cursor.nextLine().is(':empty')) {
                            cursor.nextLine().remove();
                            lineRemoved(cursor.currentPage());
                        }
                    }
                }
            },

            updatePageBreaks = function () {
                console.log(cursor.currentLine().pos().bottom + ' > ' + cursor.currentPage().pos().bottom);
                if (cursor.currentLine().pos().bottom > cursor.currentPage().pos().bottom) {
                    var page = $(poe.Elements.Page);
                    cursor.currentPage().after(page);
                    page.prepend(cursor.currentLine());
                }
            },

            handleKeyDown = function (event) {
                switch (event.keyCode) {
                case poe.key.Left:
                    event.preventDefault();
                    if (cursor.prev().parent()[0] === cursor.currentPage()[0]) {
                        return;
                    }

                    cursor.moveLeft(poe.TextCursor.Move.Char, 1);
                    break;

                case poe.key.Right:
                    event.preventDefault();
                    cursor.moveRight(poe.TextCursor.Move.Char, 1);
                    break;

                case poe.key.Backspace:
                    event.preventDefault();
                    if (cursor.prev().parent()[0] === cursor.currentPage()[0]) {
                        return;
                    }

                    cursor.moveLeft(poe.TextCursor.Move.Char, 1);
                    cursor.next().remove();
                    updateWordWrap();
                    updatePageBreaks();
                    break;

                case poe.key.Delete:
                    event.preventDefault();
                    if (cursor.next().parent().parent()[0] !== cursor.currentLine()[0]) {
                        cursor.nextLine().removeClass('newline');
                    }
                    cursor.next().remove();
                    updateWordWrap();
                    updatePageBreaks();
                    break;

                case poe.key.Space:
                    event.preventDefault();
                    cursor.insertBefore('&nbsp;');
                    cursor.currentWord().after(poe.Elements.Word);
                    cursor.moveRight(poe.TextCursor.Move.Word, 1);
                    updateWordWrap();
                    updatePageBreaks();
                    break;

                case poe.key.Enter:
                    event.preventDefault();
                    cursor.currentLine().after(poe.Elements.Line);
                    var word = $(poe.Elements.Word);
                    cursor.nextLine().prepend(word);
                    while (cursor.next().parent() === cursor.currentWord()) {
                        word.append(cursor.next());
                    }

                    word.after(cursor.currentWord().nextAll());
                    cursor.moveRight(poe.TextCursor.Move.Line, 1);
                    cursor.moveRight(poe.TextCursor.Move.Word, 1);
                    cursor.currentLine().addClass('newline');
                    updatePageBreaks();
                    break;

                default:
                    event.preventDefault();
                    var letter;
                    if (event.shiftKey) {
                        letter = poe.keyMapShift[event.keyCode];
                    } else {
                        letter = poe.keyMap[event.keyCode];
                    }

                    cursor.insertBefore(letter);
                    updateWordWrap();
                    updatePageBreaks();
                    break;
                }
            },
            
                    //The public interface of poe.writer
            self = {
                type: function () {
                    return poe.Types.Writer;
                },

                getDocument: function () {
                    return document;
                },

                getTextCursor: function () {
                    return cursor;
                }
            };

        //Constructor
        (function () {
            $('body').keydown(handleKeyDown);
        }());
        return self;
    }());
});