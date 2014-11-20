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
            if (prevSibling !== null && prevSibling.textContent !== '') {
                $(prevSibling).before($TextCursor);
            } else {
                prevSibling = $TextCursor.parent().prev('.word');
                if (prevSibling.length !== 0) {
                    prevSibling = prevSibling[0].lastChild;
                    if (prevSibling.textContent === '') {
                        /*
                            In case there is an empty text node go to the next
                            and remove the empty one. Has to check for the empty
                            one because sometimes there is an empty text node.
                        */
                        if (prevSibling === $TextCursor.parent()[0].firstChild) {
                            prevSibling = $TextCursor.parent().prev('.word')[0].lastChild;
                            $($TextCursor.parent().next('.word')[0].firstChild).remove();
                        } else {
                            prevSibling = prevSibling.previousSibling;
                            $(prevSibling.nextSibling).remove();
                        }
                    }
                    $(prevSibling).before($TextCursor);
                } else {
                    prevSibling = $TextCursor.parents('.line').prev('.line')[0];//.lastChild.lastChild;
                    if (prevSibling !== undefined) {
                        prevSibling = prevSibling.lastChild.lastChild;
                        if (prevSibling !== null) {
                            $(prevSibling).after($TextCursor);   
                        }
                    }
                }
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
                var child = $TextCursor.parent().next('.word');//[0].firstChild);
                if (child.length !== 0) {
                    child = $(child[0].firstChild);
                    if (child[0].textContent === '') {
                        child = $(child[0].nextSibling);
                        $(child[0].previousSibling).remove();
                    }
                    child.after($TextCursor);
                }
                else {
                    nextSibling = $TextCursor.parents('.line').next('.line');
                    if (nextSibling.length !== 0) {
                        nextSibling.children().first().prepend($TextCursor);    
                    }
                }
            }
        }
        this.endMove();
    };
    
    this.nextWord = function(count) {
        
    };
    
    this.previousWord = function(count) {
        
    };
    
    this.beginMove = function() {
        clearInterval(BlinkTimer);  
        this.showCursor();
    };
    
    this.endMove = function() {
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