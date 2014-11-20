$TextCursor = $('.textcursor');
$VisibleCursor = $('.visiblecursor');
var BlinkTimer;

var TextCursor;

$(document).ready(function() {
    TextCursor = new _TextCursor();
});

function Blink() {
    $VisibleCursor.toggleClass('hide');
}

/*
    TextCursor is a class representing the text caret on the screen.
    There are actually two DOM elements corresponding to the caret.
    The first that actually gets moved around is $TextCursor. It is
    invisible and serves as a element to position an absolute cursor.
    If it were to be used as the actual cursor, text would be offset
    according to where it is placed. That looks horrible.
*/
function _TextCursor() {
    /*
        Returns the position of $TextCursor
    */
    this.position = function() {
        return $TextCursor.offset();   
    };
    
    /*
        Moves the cursor count characters to the left.
    */
    this.moveLeft = function(count) {
        this.beginMove();
        if (count === undefined)
            count = 1;
        
        for(var i = 0; i < count; i++) {
            var prevSibling = $TextCursor[0].previousSibling;
            if (prevSibling !== null) {
                $(prevSibling).before($TextCursor);
            } else {
                var child = $TextCursor.parent().prev('.word')[0].lastChild;
                if (child.textContent === '') {
                    /*
                        In case there is an empty text node go to the next
                        and remove the empty one. Has to check for the empty
                        one because sometimes there is an empty text node.
                    */
                    if (child === $TextCursor.parent()[0].firstChild) {
                        child = $TextCursor.parent().prev('.word')[0].lastChild;
                        $($TextCursor.parent().next('.word')[0].firstChild).remove();
                    } else {
                        child = child.previousSibling;
                        $(child.nextSibling).remove();
                    }
                }
                $(child).before($TextCursor);
            }
        }
        this.endMove();
    };
    
    
    /*
        Moves the cursor count characters to the right.
    */
    this.moveRight = function(count) {
        this.beginMove();
        if (count === undefined)
            count = 1;
        
        for(var i = 0; i < count; i++) {
            var nextSibling = $TextCursor[0].nextSibling;
            if (nextSibling !== null) {
                $(nextSibling).after($TextCursor);   
            } else {
                var child = $($TextCursor.parent().next('.word')[0].firstChild);
                if (child[0].textContent === '') {
                    child = $(child[0].nextSibling);
                    $(child[0].previousSibling).remove();
                }
               child.after($TextCursor);
            }
        }
        this.endMove();
    };
    
    this.nextWord = function(count) {
        
    };
    
    this.previousWord = function(count) {
        
    };
    
    this.beginMove = function() {
        console.log('begin move');
        clearInterval(BlinkTimer);  
        this.showCursor();
    };
    
    this.endMove = function() {
    console.log('end move');
    BlinkTimer = setInterval(Blink, 800);
        
        $VisibleCursor.css('left', this.position().left).css('top', this.position().top);
    };
    
    this.showCursor = function() {
        $VisibleCursor.removeClass('hide');
    };
    
    this.hideCursor = function() {
        $VisibleCursor.addClass('hide');  
    };
    
    this.endMove();
}