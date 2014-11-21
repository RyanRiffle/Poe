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

$.fn.wordsUntil = function($element, selector) {
    $ret = this.nextUntil($element, selector);
    $line = this.parents('.line');
    var contains = $line.index($element);
    
    while(contains === -1) {
        $line = $line.next('.line');
        if ($line.length === 0 || $line.index($element) === 0)
            break;
        
        console.log($line.children(selector).first().nextUntil($element, selector).length);
        $ret.add($line.children(selector).first().nextUntil($element, selector));
        $ret.add($line.children(selector).first());
        
        contains = $line.index($element);
    }
    
    return $ret;
};

$.fn.join = function($element) {
    if ($element.isAfter(this))
        this.append($element.children());
    else
        this.prepend($element.children());
    
    $element.remove();
};