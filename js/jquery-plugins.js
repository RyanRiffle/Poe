'use strict';
$.fn.isValid = function () {
    if (this.length === 0) {
        return false;
    }
    
    if (this[0] === null || this[0] === undefined) {
        return false;
    }
    
    return true;
};

$.fn.textContent = function () {
    return this[0].textContent;
};

$.fn.isTextNode = function () {
    if (this.isValid()) {
        return this[0].nodeType === 3;
    }
    
    return false;
};

$.fn.isElement = function () {
    if (this.isValid()) {
        return this[0].nodeType === 1;
    }
    
    return false;
};

$.fn.childNodes = function () {
    return $(this[0].childNodes);
};

$.fn.hasChildNodes = function () {
    return this[0].childNodes.length !== 0;
};

$.fn.hasChildren = function(selector) {
    return this.children(selector).length !== 0;
};

$.fn.firstChild = function () {
    return $(this[0].firstChild);
};

$.fn.lastChild = function () {
    return $(this[0].lastChild);
};

$.fn.nextSibling = function () {
    return $(this[0].nextSibling);
};

$.fn.prevSibling = function () {
    return $(this[0].previousSibling);
};

$.fn.nextNode = function () {
    if (this.hasChildNodes()) {
        return this.firstChild();
    }

    if (this.nextSibling().isValid()) {
        return this.nextSibling();
    }

    var node = this.parent();
    while (!node.nextSibling().isValid()) {
        node = node.parent();
    }
    
    return node.nextSibling();
};

$.fn.prevNode = function () {
    if (this.hasChildNodes()) {
        return this.parent().lastChild();
    }
    
    if (this.prevSibling().isValid()) {
        return this.prevSibling();
    }
    
    var node = this.parent();
    while (!node.prevSibling().isValid()) {
        node = node.parent();
    }
    
    return node.prevSibling();
};

$.fn.nextTextNode = function () {
    var node = this.nextNode();
    while (!node.isTextNode() && node.isValid()) {
        node = node.nextNode();
    }
    
    return node;
};

$.fn.prevTextNode = function () {
    var node = this.prevNode();
    while (!node.isTextNode() && node.isValid()) {
        if (node.hasChildNodes()) {
            node = node.lastChild();
        } else {
            node = node.prevNode();
        }
    }
    
    return node;
};

$.fn.positionRight = function () {
    return this.position().left + this.width();
};

$.fn.pos = function () {
    var pos = this.position();
    return {
        left: pos.left,
        top: pos.top,
        right: pos.left + this.width(),
        bottom: pos.top + this.height()
    };
};

$.fn.type = function () {
    return poe.Types.jQuery;
};