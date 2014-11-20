$(document).ready(function() {
    $('.writer').on('mouseup', '.page', function(event) {
        var selection = rangy.getSelection();
        
        /*
            If the user just selected text whith that mouse down then up,
            use the selection to move $TextCursor.
            
            If not, use the mouse event.
        */
        TextCursor.beginMove();
        if (selection.getRangeAt(0) !== null && !selection.isCollapsed) {
            var range = selection.getRangeAt(0);
            var $startContainer = $(range.startContainer);
        
            $startContainer.before($TextCursor);
        } else {
            //Use event.target along with clientX and clientY
            var $target = $(event.target);
            //Since the mouseup is on .page, we don't want to be able to move the cursor on the page,
            //just on the words.
            if (!$target.parent().hasClass('word')) {
                TextCursor.endMove();
                return;
            }
            
            var relx = event.clientX - $target.position().left;
            
            children = $target[0].childNodes;
            
            for(var x=0; x < children.length; x++) {
                var child = children[x];
                var range = rangy.createNativeRange();
                range.selectNode(child);
                var rects = range.getClientRects()[0];
                if (rects === undefined)
                    continue;
                
                var left = rects.left - $target.position().left;
                var right = rects.right - $target.position().left;
                var twoThirds = ((right - left)/3)*2;
                
                if (left <= relx && twoThirds >= relx) {
                    $(child).before($TextCursor); 
                    break;
                }
                else if (twoThirds <= relx && right >= relx) {
                    $(child).after($TextCursor);
                    break;
                }
            }
        }
        TextCursor.endMove();
    });
});