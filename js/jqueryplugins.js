$.fn.isAfter = function(elm) {
    if (this[0].nodeType === 3 && elm[0].nodeType === 3) {
        var range = document.createRange();
        var thisrect, elmrect;
        range.selectNode(this[0]);
        thisrect = range.getClientRects()[0];
        range.selectNode(elm[0]);
        elmrect = range.getClientRects()[0];
        
        if (thisrect.top < elmrect.top) {
            return false;   
        } else if (thisrect.top > elmrect.top) {
            return true;   
        } else {
            //They are on the same line.
            if (thisrect.left < elmrect.left)
                return false;   
            else
                return true;   
        }
    }
    return this.prevAll().filter(elm).length !== 0;
};

$.fn.isBefore = function(elm) {
    return this.nextAll().filter(elm).length !== 0;
};

$.fn.childAtClientPos = function(x, y) {
    var self = this[0];
    for(var x=0; x < self.childNodes.length; x++) {
        var child = self.childNodes[x];
        var range = document.createRange();
        range.selectNode(child);
        var rects = range.getClientRects()[0];
        
        if (x > rects.left && x < rects.right && y > rects.top && y < rects.bottom)
            return $(child);
    }
    
    return null;
};