var Mouse = {
    Left: 0,
    Middle: 1,
    Right: 2
};

function Selection() {
    var self = this;
    self.startElement = null;
    self.endElement = null;
    
    self.startNode = null;
    self.endNode = null;
    
    /*
        The element will need to be split in order to highlight
        only part of a word. After a selection is removed, rejoin
        the split parts to prevent fragmentation of the dom elements.
    */
    self._splitStart = [];
    self._splitEnd = [];
    
    self._buttonsDown = [
        false, //Mouse.Left
        false, //Mouse.Middle
        false //Mouse.Right
    ];
    
    self._mouseMoved = false;
    
    self.wasButtonDown = function(button) {
        return self._buttonsDown[button];  
    };
    
    self.hasSelection = function() {
        if ($('.selected').length === 0)
            return false;
        
        return true;
    };
    
    self.initialize = function() {
        $('.writer').on('mousedown', '.page', self.handleMouseDown);
        $('.writer').on('mouseup', '.page', self.handleMouseUp);
        $('.writer').on('mousemove', '.page', self.handleMouseMove);
    };
    
    self.handleMouseDown = function(event) {
        switch(event.button) {
        case Mouse.Left:
            event.preventDefault();
            self.handleLeftMouseDown(event);
            break;
                
        case Mouse.Right:
            event.preventDefault();
            self.handleRightMouseDown(event);
            break;
        }
    };
    
    self.handleLeftMouseDown = function(event) {
        //using splitAt defined in input.js
        if (self.wasButtonDown(Mouse.Left)) {
            self.endNode = self._textNodeAtClientPos(event.clientX, event.clientY);
            return;
        } else {
            if (self.hasSelection) {
                $('.selected').removeClass('selected');   
            }
        }
        
        self.startNode = self._textNodeAtClientPos(event.clientX, event.clientY);
        self._buttonsDown[Mouse.Left] = true;
        self._mouseStartPos = {x: event.clientX, y: event.clientY};
    };
    
    self.handleRightMouseDown = function(event) {
        
    };
    
    self.handleMouseMove = function(event) {
        if (self.wasButtonDown(Mouse.Left)) {
            self.endNode = self._textNodeAtClientPos(event.clientX, event.clientY);
            self._selectElements();
        }
    };
    
    self.handleMouseUp = function(event) {
        self._buttonsDown[event.button] = false;
        if (event.button === Mouse.Left)
            self.handleLeftMouseUp(event);
    };
    
    self.handleLeftMouseUp = function(event) {
        self.startElement = null;
        self.endElement = null;
    };
    
    self.handleRightMouseUp = function(event) {
        
    };
    
    /*
        
    */
    self._selectElements = function() {
        if (self.startNode === self.endNode)
            return;
        //Split the elements so they can all be selected
        self._splitElements();
        
        //Now startElement and endElement are correct,
        if (self.startElement === self.endElement) {
            $(self.startElement).addClass('selected');
            return;
        }
        
        $('.selected').removeClass('selected').removeClass('middle').removeClass('left').removeClass('right');
        
        $(self.startElement).nextUntil($(self.endElement), '.word').each(function(index, $element) {
            $element = $($element);
             if ($element[0] === self.startElement)
                 $element.addClass('selected').addClass('left');
             else if ($element[0] === self.endElement)
                 $element.addClass('selected').addClass('right');
             else
                 $element.addClass('selected middle');
            
        });
        $(self.startElement).addClass('selected');
        $(self.endElement).addClass('selected');
    };
    
    self._splitElements = function() {
        var $splitter = $('<span></span>');
        //Swap the start and end if they are backwards
        if (self.startNode === undefined || self.endNode === undefined)
            return;
        
        if ($(self.startNode).isAfter($(self.endNode))) {
            var swap = self.startNode;
            self.startNode = self.endNode;
            self.endNode = swap;
        }
        
        if (self.startNode.nextSibling === self.endNode || self.startNode.previousSibling === self.endNode) {
            //Split 'em!W
            $(self.endNode).after($splitter);
            splitAt($splitter, function($before, $after) {
                self.startElement = $before[0];
                self.endElement = $before[0];
            });
            
            $splitter.remove();
            $('.word:empty').remove();
            
            return;
        }
        
        //Since start is only set once every selection
        if (self.startElement === null) {
            $(self.startNode).before($splitter);
            var firstNode = $(self.startNode).parent()[0].firstChild;
            if (firstNode.nodeType === 3 && firstNode.textContent === '')
                $(firstNode).remove();
            
            if ($splitter[0] === $(self.startNode).parent()[0].firstChild)
                self.startElement = $(self.startNode).parent()[0];
            else {
                splitAt($splitter, function($before, $after) {
                    self._splitStart = [$before, $after];
                    self.startElement = $after[0];
                });
            }
        }
                
        $(self.endNode).after($splitter);
        splitAt($splitter, function($before, $after) {
            self._splitEnd = [$before, $after];
            self.endElement = $before[0];
            $splitter.remove();
        });
        
        $('.word:empty').remove();
    };
    
    self._textNodeAtClientPos = function(x, y) {
        var $lines = $('.line');
        var start = $lines.first();
        var end = $lines.last();
        
        var node;
        if (y > end.position().top + end.height()) {
            node = end.children().last()[0].lastChild;
            if (node.nodeType === 3 && node.textContent === '')
                node = node.previousSibling;
            console.log(node);
            return node;
        } else if (y < start.position().top) {
            console.log(start.position().top);
            node = start.children().first()[0].firstChild;
            if (node.nodeType === 3 && node.textContent === '')
                node = node.nextSibling;
            console.log(node);
            return node;   
        }
        
        var $line;
        for(var i = 0; i < $lines.length; i++) {
            $line = $($lines[i]);
            if (y > $line.position().top && y < $line.position().top + $line.height()) {
                break;
            }
        }
        
        //Line now has the correct line.
        if (x > $line.position().left && x < $line.position().left + $line.width()) {
            //The click was inside the line
            var $word;
            for(var i=0; i < $line.children().length; i++) {
                $word = $($line.children()[i]);
                
                for(var e=0; e < $word[0].childNodes.length; e++) {
                    var node = $word[0].childNodes[e];
                    var range = document.createRange();
                    range.selectNode(node);
                    var rects = range.getClientRects()[0];
                    
                    if (rects === undefined)
                        continue;
                    
                    if (x > rects.left && x < rects.right && y > rects.top && y < rects.bottom) {
                        return node;
                    }
                }
            }
        }
        else if (x < $line.position().left) {
            var node = $line.children('.word').first()[0].firstChild;
            if (node.nodeType === 3 && node.textContent === '') {
                node = node.nextSibling;
            }
            
            return node;
        } else if (x > $line.position().left + $line.width()) {
            var node = $line.children('.word').last()[0].lastChild;
            if (node.nodeType === 3 && node.textContent === '')
                node = node.previousSibling;
            return node;
        }
    };

    self.initialize();
}

var selection = new Selection();