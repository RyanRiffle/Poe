'use strict';
poe.Types.Document = 'Document';

poe.Document = function () {
    var styleElement = $('<style type="text/css"></style>'),
        margins = {
            left: 96,
            top: 96,
            right: 96,
            bottom: 96
        },
    
        size = {
            width: 816,
            height: 1056
        },
        
        lineSpacing = 2,
    
        lineLeft = $('.line').first().position().left,
        lineRight = lineLeft + $('.line').first().width(),
    
        updateMargins = function () {
            //Update the dom the reflect margin changes.
            /*$(poe.Selectors.Page).css('padding-left', margins.left + 'px');
            $(poe.Selectors.Page).css('padding-top', margins.top + 'px');
            $(poe.Selectors.Page).css('padding-right', margins.right + 'px');
            $(poe.Selectors.Page).css('padding-bottom', margins.bottom + 'px');*/
            styleElement.html('');
            
            styleElement.append(createCss(poe.Selectors.Page, {
                'padding-left': margins.left + 'px',
                'padding-right': margins.right + 'px',
                'padding-top': margins.top + 'px',
                'padding-bottom': margins.bottom + 'px'
            }));
            
            styleElement.append(createCss(poe.Selectors.Line, {
                'line-height': (lineSpacing*100) + '%'
            }));
            
            updateSize();
        },
        
        updateSize = function() {
            styleElement.append(createCss(poe.Selectors.Page, {
                'min-width': size.width + 'px',
                'min-height': size.height + 'px',
                'max-width': size.width + 'px',
                'max-height': size.height + 'px'
            }));
        },
        
        createCss = function(selector, value) {
            var key,
                lines = [],
                ret,
                x;
            for (key in value) {
                lines.push(key + ':' + value[key] + ';');
            }
            
            ret = selector + '{ ';
            for (x = 0; x < lines.length; x += 1) {
                ret += lines[x];
            }
            ret += ' }';
            
            return ret;
        },
    
        self = {
            type: function () {
                return poe.Types.Document;
            },

            setMargin: function (left, top, right, bottom) {
                margins.left = left * 96;
                margins.top = top * 96;
                margins.right = right * 96;
                margins.bottom = bottom * 96;
                updateMargins();
            },
            
            margins: function() {
                return margins;  
            },

            lineOuterPosition: function () {
                return lineRight;
            },

            lineInnerPosition: function () {
                return lineLeft;
            },

            wordCount: function () {
                return $(poe.Selectors.Word).length;
            },

            pageCount: function () {
                return $(poe.Selectors.Page).length + 1;
            },

            setSize: function (width, height) {
                size.width = width;
                size.height = height;
                updateSize();
            },
            
            pageAdded: function() {
                updateMargins();
                updateSize();
            },

            pageSize: function () {
                return size;
            }
        };
    
    //Constructor 
    (function () {
        $('head').append(styleElement);
        
        self.setMargin(1, 1, 1, 1);
        self.setSize(816, 1056);
    }());
    
    return self;
};