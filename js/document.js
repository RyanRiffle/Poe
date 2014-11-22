'use strict';
poe.Types.Document = 'Document';

poe.Document = function () {
    var margins = {
        left: 96,
        top: 96,
        right: 96,
        bottom: 96
    },
    
        size = {
            width: 816,
            height: 1056
        },
    
        lineLeft = $('.line').first().position().left,
        lineRight = lineLeft + $('.line').first().width(),
    
        updateMargins = function () {
            //Update the dom the reflect margin changes.
            $(poe.Selectors.Page).css('padding-left', margins.left + 'px');
            $(poe.Selectors.Page).css('padding-top', margins.top + 'px');
            $(poe.Selectors.Page).css('padding-right', margins.right + 'px');
            $(poe.Selectors.Page).css('padding-bottom', margins.bottom + 'px');
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
                $(poe.Selectors.Page).css('min-width', size.width);
                $(poe.Selectors.Page).css('min-height', size.height);

                $(poe.Selectors.Page).css('max-width', size.width);
                $(poe.Selectors.Page).css('max-height', size.height);
            },

            pageSize: function () {
                return size;
            }
        };
    
    //Constructor 
    (function () {
        self.setMargin(1, 1, 1, 1);
        self.setSize(816, 1056);
    }());
    
    return self;
};