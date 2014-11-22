$('body').ready(function() {

poe.Elements = {
    Word: '<span class="word"></span>',
    Line: '<div class="line"></div>',
};

poe.writer = function() {
    var doc = poe.document();
    var cursor = poe.TextCursor.create();
    
    //The public interface of poe.writer
    var self = {
        getDocument: function() {
            return document;
        },
        
        getTextCursor: function() {
            return cursor;
        }
    };
    
    var updateWordWrap = function() {
        if (cursor.position().left > doc.lineOuterPosition()) {
            if (!cursor.nextLine().isValid()) {
                cursor.currentLine().after(poe.Elements.Line);
            }
            console.log(cursor.nextLine());
            cursor.nextLine().prepend(cursor.currentWord());
            cursor.updateVisibleCursor();
        } else if (cursor.nextLine().isValid()) {
            console.log(cursor.nextLine().firstChild().width() + cursor.currentLine().lastChild().positionRight() +' < '+ doc.lineOuterPosition());
            if (cursor.nextLine().firstChild().width() + cursor.currentLine().lastChild().positionRight() < doc.lineOuterPosition()) {
                cursor.currentLine().append(cursor.nextLine().firstChild());
            }
        }
    };
    
    var handleKeyDown = function(event) {
        switch(event.keyCode) {
            case poe.key.Left:
                event.preventDefault();
                cursor.moveLeft(poe.TextCursor.Move.Char, 1);
                break;
                
            case poe.key.Right:
                event.preventDefault();
                cursor.moveRight(poe.TextCursor.Move.Char, 1);
                break;
                
            case poe.key.Backspace:
                event.preventDefault();
                cursor.moveLeft(poe.TextCursor.Move.Char, 1);
                cursor.next().remove();
                updateWordWrap();
                break;
                
            case poe.key.Delete:
                event.preventDefault();
                cursor.next().remove();
                updateWordWrap();
                break;
                
            case poe.key.Space:
                event.preventDefault();
                cursor.insertBefore('&nbsp;');
                cursor.currentWord().after(poe.Elements.Word);
                cursor.moveRight(poe.TextCursor.Move.Word, 1);
                updateWordWrap();
                break;
                
            default:
                event.preventDefault();
                var letter;
                if(event.shiftKey) {
                    letter = poe.keyMapShift[event.keyCode];
                } else {
                    letter = poe.keyMap[event.keyCode];
                }
                
                cursor.insertBefore(letter);
                updateWordWrap();
                break;
        }
    };
    
    var initialize = function() {
        $('body').keydown(handleKeyDown);
    }();
    return self;
}();
});