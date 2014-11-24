poe.toolbar = (function() {
    var buttons = {
        bold: $('.btn.bold'),
        italic: $('.btn.italic'),
        underline: $('.btn.underline')
    },
        cursor,
        
        self = {
            styleChanged: function(textCursor) {
                var style = textCursor.style();
                if (style.bold) {
                    buttons.bold.addClass('active');
                } else {
                    buttons.bold.removeClass('active');
                }
                
                if (style.italic) {
                    buttons.italic.addClass('active');
                } else {
                    buttons.italic.removeClass('active');
                }
                
                if (style.underline) {
                    buttons.underline.addClass('active');
                } else {
                    buttons.underline.removeClass('active');
                }
            },
            
            setCursor: function(textCursor) {
                cursor = textCursor;
            }
        },
        
        handleButtonPressed = function (event) {
            $target = $(event.target);
            $target.toggleClass('active');
            if (event.target === buttons.bold[0]) {
                cursor.setBold(buttons.bold.hasClass('active'));
            } else if (event.target === buttons.italic[0]) {
                cursor.setItalic(buttons.italic.hasClass('active'));
            } else if (event.target === buttons.underline[0]) {
                cursor.setUnderline(buttons.underline.hasClass('active'));
            }
        },
        
        handleShortcuts = function (event) {
            if (!event.ctrlKey) {
                return;
            }
            
            switch (event.keyCode) {
            case poe.key.B:
                event.preventDefault();
                cursor.setBold(!cursor.style().bold);
                break;
                    
            case poe.key.I:
                event.preventDefault();
                cursor.setItalic(!cursor.style().italic);
                break;
                    
            case poe.key.U:
                event.preventDefault();
                cursor.setUnderline(!cursor.style().underline);
                break;
            }
        },
        
        initialize = (function() {
            $('.btn').click(handleButtonPressed);
            $('body').keydown(handleShortcuts);
        }());
    
    return self;
}());