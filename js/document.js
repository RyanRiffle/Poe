poe.Types.Document = 'Document';

poe.document = function() {
    var margins = {
        left: 96,
        top: 96,
        right: 96,
        bottom: 96
    };
    
    var size = {
        width: 816,
        height: 1056
    };
    
    var lineLeft = $('.line').first().position().left;
    var lineRight = lineLeft + $('.line').first().width();
    
    var updateMargins = function() {
        //Update the dom the reflect margin changes.
        $('.page-inner').css('padding-left', margins.left + 'px');
        $('.page-inner').css('padding-top', margins.top + 'px');
        $('.page-inner').css('padding-right', margins.right + 'px');
        $('.page-inner').css('padding-bottom', margins.bottom + 'px');
        
        $('.page-break').css('margin-top', margins.bottom + 'px');
        $('.page-break').css('margin-bottom', margins.top + 'px');
    };
    
    var self = {
        setMargin: function(left, top, right, bottom) {
            margins.left = left * 96;
            margins.top = top * 96;
            margins.right = right * 96;
            margins.bottom = bottom * 96;
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
        },
        
        pageCount: function() {
            return $('.page-break').length + 1;
        },
        
        updateSize: function() {
            $('.page-inner').css('width', size.width);
            $('.page-inner').css('height', size.height);
        },
        
        pageSize: function() {
            return size;  
        },
        
        addPage: function(page) {
            $('.writer').append(page.element());
        }
    };
    
    var initialize = function() {
        self.setMargin(1, 1, 1, 1);
    }();
    
    return self;
};