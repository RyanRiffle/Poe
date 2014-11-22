poe.Types.Page = 'Page';

var poe.Page = function() {
    var pageElement = $(poe.Elements.Page);
    
    var self = {
        type: function() {
            return poe.Types.Page;
        },
        
        lineCount: function() {
              return self.lines().count;
        },
        
        lines: function() {
            return pageElement.children('.line');  
        },
        
        insertAfter: function(page) {
            pageElement.after(page.element());
            return self;
        },
        
        insertBefore: function(page) {
            pageElement.before(page.element());
            return self;
        },
        
        geometry: function() {
            return pageElement.pos();
        },
        
        element: function() {
            return pageElement;
        },
        
        removeLine: function(line) {
            line.remove();
            return self;
        },
    };
    
    return self;
}();