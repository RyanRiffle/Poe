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
                
                console.log(style.color);
                $('#color-pick').css('background-color', style.color);
                $('#font-size-select .text').html(style.font.size);
                $('#font-select .text').html(style.font.name);
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
            
            default:
                event.preventDefault();
                break;
            }
        },
        
        handleFontSelect = function (event) {
            var $target = $(event.target),
                style = cursor.style();
            $('#font-select .text').html($target.text());
            $('#font-select .text').css('font-family', '"' + $target.text() + '"');
            style.font.name = $target.text();
            cursor.applyCharStyle(style);
        },
        
        handleFontSize = function (event) {
            var $target = $(event.target),
                style = cursor.style();
            $('#font-size-select .text').html($target.text());
            style.font.size = parseInt($target.text());
            cursor.applyCharStyle(style);
        },
        
        handleColorSelect = function (event) {
            var $color = $(event.target),
                colorCode,
                style;
            colorCode = $color.css('background-color');
            $('#color-pick').css('background-color', colorCode);
            style = cursor.style();
            style.color = colorCode;
            cursor.applyCharStyle(style);
        },
        
        initialize = (function() {
            $('.btn').click(handleButtonPressed);
            $('body').keydown(handleShortcuts);
            $('#font-list li a').click(handleFontSelect);
            $('#font-size-list li a').click(handleFontSize);
            $('.color-list-item').click(handleColorSelect);
        }());
    
    return self;
}());