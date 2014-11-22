poe.document = function() {
    var margins = {
        left: 96,
        top: 96,
        right: 96,
        bottom: 96
    };
    
    var lineLeft = $('.line').first().position().left;
    var lineRight = lineLeft + $('.line').first().width();
    
    var updateMargins = function() {
        //Update the dom the reflect margin changes.
    };
    
    var self = {
        setMargin: function(left, top, right, bottom) {
            margins.left = left;
            margins.top = top;
            margins.right = right;
            margins.bottom = bottom;
            updateMargins();
        },
        
        lineOuterPosition: function() {
            return lineRight;
        },
        
        lineInnerPosition: function() {
            return lineLeft;
        },
        
        wordCount: function() {
            return $('.word').length;
        }
    };
    
    return self;
};