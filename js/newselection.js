var Mouse = {
    Left: 0,
    Middle: 1,
    Right: 2
};

function Selection() {
    var self = this;
    self.startElement = null;
    self.endElement = null;
    
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
    
    self.initialize = function() {
        $('.writer').on('mousedown', '.word', self.handleMouseDown);
        $('.writer').on('mouseup', '.word', self.handleMouseUp);
        $('.writer').on('mousemove', '.word', self.handleMouseMove);
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
        console.log('Selection.handleLeftMouseDown ->');
        //using splitAt defined in input.js
        if (self.wasButtonDown(Mouse.Left)) {
            
            return;
        };
        
        self.startElement = $(event.target).childAtClientPos(event.clientX, event.clientY);
        self._buttonsDown[Mouse.Left] = true;
        self._mouseStartPos = {x: event.clientX, y: event.clientY};
    };
    
    self.handleRightMouseDown = function(event) {
        
    };
    
    self.handleMouseMove = function(event) {
        if (self.wasButtonDown(Mouse.Left)) {
            console.log('Left mouse was down');
            self.endElement = $(event.target).childAtClientPos(event.clientX, event.clientY);
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
        //Split the elements so they can all be selected
        self._splitElements();
        
        //Now startElement and endElement are correct,
        $(self.startElement).nextUntil($(self.endElement), '.word').each(function(index, $element) {
             if ($element[0] === self.startElement)
                 $element.addClass('selected').addClass('left');
             else if ($element[0] === self.endElement)
                 $element.addClass('selected').addClass('right');
             else
                 $element.addClass('selected').addClass('middle');
        });
    };
    
    self._splitElements = function() {
        var $splitter = $('<span></span>');
        //Swap the start and end if they are backwards
        if ($(self.startElement).isAfter($(self.endElement))) {
            var swap = self.startElement;
            self._correctedStartElement = self.endElement;
            self._correctedEndElement = swap;
        }
        
        $(self.startElement).before($splitter);
        splitAt($splitter, function($before, $after) {
            self._splitStart = [$before, $after];
            self.startElement = $after[0];
        });
                
        $(self.endElement).after($splitter);
        splitAt($splitter, function($before, $after) {
            self._splitEnd = [$before, $after];
            self.endElement = $before[0];
            $splitter.remove();
        });
    };
    
    self._textNodeAtClientPos = function(x, y) {
        var start = $('.word').first();
        var end = $('.word').last();
        
        if (y > end.position().top + end.height()) {
            return end.children().last();
        } else if (y < start.position().top) {
            return start.children().first();   
        }
    };

    self.initialize();
}

var selection = new Selection();