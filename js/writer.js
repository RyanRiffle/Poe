'use strict';

$('body').ready(function () {
    poe.Elements = {
        Word: '<span class="word"></span>',
        Line: '<div class="line"></div>',
        Page: '<div class="page-inner"></div>',
        Tab: '<span class="tab word">&#8203;</span>'
    };
    
    poe.Selectors = {
        Word: '.word',
        Line: '.line',
        Page: '.page-inner',
        Tab: '.tab'
    };

    poe.Types.Writer = 'Writer';
    poe.Types.jQuery = 'jQuery';

    poe.writer = (function () {
        var doc = new poe.Document(),
            cursor = poe.TextCursor.create(),
            toolbar = poe.toolbar,
            formatting = {
                bold: false,
                italic: false,
                underline: false,
                fontFamily: 'Open Sans',
                fontSize: 12,
                lineSpacing: 2.0,
            },
            
            lineRemoved = function (page) {
                if (page.next(poe.Selectors.Page).isValid()) {
                    page.append(page.next(poe.Selectors.Page).children(poe.Selectors.Line).first());
                }
            },

            updateWordWrap = function () {
                $(poe.Selectors.Word).filter(':empty').remove();
                
                var line = cursor.currentLine(),
                    nextLine = line.next(poe.Selectors.Line),
                    lineChildren,
                    nextLineChildren;
    
                while (line.isValid() && line.hasChildren(poe.Selectors.Word)) {
                    while (line.children(poe.Selectors.Word).last().pos().right > line.pos().right) {
                        if (!nextLine.isValid() || line.next(poe.Selectors.Line).hasClass('newline')) {
                            line.after(poe.Elements.Line);
                            nextLine = line.next(poe.Selectors.Line);
                        }
                        
                        nextLine.prepend(line.children(poe.Selectors.Word).last());    
                    }
                    
                    while (nextLine.children(poe.Selectors.Word).isValid() && nextLine.children(poe.Selectors.Word).first().width() + line.children(poe.Selectors.Word).last().pos().right < line.pos().right) {
                        line.append(nextLine.children(poe.Selectors.Word).first());
                        if (nextLine.is(':empty'))
                            nextLine.remove();
                    }
                    
                    line = nextLine;
                    nextLine = line.next(poe.Selectors.Line);
                }
                
                cursor.updateVisibleCursor();
            },

            updatePageBreaks = function () {
                if (cursor.currentLine().pos().bottom > cursor.currentPage().pos().bottom + parseInt(cursor.currentPage().css('padding-top').replace('px',''))) {
                    var page = $(poe.Elements.Page);
                    cursor.currentPage().after(page);
                    page.prepend(cursor.currentLine());
                    doc.pageAdded();
                }
                
                var line = cursor.currentPage().children(poe.Selectors.Line).last();
                while (line.pos().bottom > line.parents(poe.Selectors.Page).pos().bottom + doc.margins().top) {
                    line.parents(poe.Selectors.Page).next(poe.Selectors.Page).prepend(line);
                    
                    line = line.parents(poe.Selectors.Page).next(poe.Selectors.Page).children(poe.Selectors.Line).last();
                    if (!line.isValid()) {
                        break;
                    }
                }
                
                cursor.updateVisibleCursor();
                $(poe.Selectors.Page).filter(':empty').remove();
            },

            handleKeyDown = function (event) {
                if (event.ctrlKey)
                    return;
                
                switch (event.keyCode) {
                case poe.key.Left:
                    event.preventDefault();
                    var line;
                    if (cursor.prev().parent()[0] === cursor.currentPage()[0]) {
                        return;
                    }
                    
                    line = cursor.currentLine();
                    cursor.moveLeft(poe.TextCursor.Move.Char, 1);
                    //Correction to make the cursor just go over a newline
                    if (line[0] !== cursor.currentLine()[0]) {
                        cursor.moveRight(poe.TextCursor.Move.Char, 1);
                    }
                    break;

                case poe.key.Right:
                    event.preventDefault();
                    if (cursor.next().parent()[0] === $('.writer')[0])
                        return;
                    cursor.moveRight(poe.TextCursor.Move.Char, 1);
                    break;

                case poe.key.Backspace:
                    event.preventDefault();
                    var line;
                    
                    //Special case for tabs because well it needs it.
                    if (cursor.prevNode().hasClass('tab')) {
                        cursor.prevNode().remove();
                        updateWordWrap();
                        updatePageBreaks();
                        cursor.updateVisibleCursor();
                        return;
                    }
                        
                    if (cursor.prev().parent()[0] === cursor.currentPage()[0]) {
                        return;
                    }
                    line = cursor.currentLine();
                    cursor.moveLeft(poe.TextCursor.Move.Char, 1);
                    if (line[0] !== cursor.currentLine()[0]) {
                        cursor.moveRight(poe.TextCursor.Move.Char, 1);
                        if (line.textContent() === '') {
                            line.remove()
                            lineRemoved(cursor.currentPage());
                        }
                    } else {
                        cursor.next().remove();
                    }
                    updateWordWrap();
                    updatePageBreaks();
                    break;

                case poe.key.Delete:
                    event.preventDefault();
                    if (cursor.next().parents(poe.Selectors.Line)[0] !== cursor.currentLine()[0]) {
                        cursor.nextLine().removeClass('newline');
                    }
                        
                    cursor.next().remove();
                    updateWordWrap();
                    updatePageBreaks();
                    break;

                case poe.key.Space:
                    event.preventDefault();
                    cursor.insertBefore('&nbsp;');
                    var style = cursor.style();
                    cursor.currentWord().after(poe.Elements.Word);
                    cursor.moveRight(poe.TextCursor.Move.Word, 1);
                    cursor.applyStyle(style);
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

                    var style = cursor.style();
                    word.after(cursor.currentWord().nextAll());
                    cursor.moveRight(poe.TextCursor.Move.Line, 1);
                    cursor.applyStyle(style);
                    cursor.currentLine().addClass('newline');
                    updatePageBreaks();
                    break;
                        
                case poe.key.Tab:
                    event.preventDefault();
                    var tab = $(poe.Elements.Tab),
                        word = $(poe.Elements.Word),
                        style = cursor.style();
                    cursor.currentWord().after(tab);
                    tab.after(word);
                    cursor.moveRight(poe.TextCursor.Move.Word, 2);
                    cursor.applyStyle(style);
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
                getDocument: function () {
                    return document;
                },

                getTextCursor: function () {
                    return cursor;
                },
                
                bold: function(enable) {
                    if (enable === undefined)
                        return formatting.bold;
                },
                
                italic: function(enable) {
                    if (enable === undefined)
                        return formatting.italic;
                },
                
                underline: function(enable) {
                    if (enable === undefined)
                        return formatting.underline;
                },
                
                fontFamily: function(fontName) {
                    if (fontName === undefined)
                        return formatting.fontFamily;
                    
                    formatting.fontFamily = fontName;
                },
                
                fontSize: function(size) {
                    if (size === undefined)
                        return formatting.fontSize;
                    
                    formatting.fontSize = size;
                }
            },
            
            handleResize = function () {
                updateWordWrap();
                updatePageBreaks();
                cursor.updateVisibleCursor();
                
                //Resize body
                console.log($('.writer').position().top);
                console.log($('body').height());
                $('.writer').css('height', ($('body').height() - $('.writer').position().top) + 'px');
            };

        //Constructor
        (function () {
            $('body').keydown(handleKeyDown);
            $(window).resize(handleResize);
            toolbar.setCursor(cursor);
            handleResize();
            cursor.on('styleChanged', function() {
                 toolbar.styleChanged(cursor);
            });
        }());
        return self;
    }());
});