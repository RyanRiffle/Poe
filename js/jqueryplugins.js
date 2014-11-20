$.fn.isAfter = function(elm) {
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