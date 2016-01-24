(function() {
'use strict';

window.Poe = window.Poe || {
	FileFormats: {},
	Gui: {}
};

Poe.init = function(parentSelector) {
	window.ribbon = new Poe.Ribbon.DefaultRibbon();
	$prepend(window.ribbon.elm, document.body);
	window.app = new Poe.Writer(parentSelector);
	var doc = new Poe.Document();
	app.setDocument(doc);
	app.show();
	ribbon.setupEventHandlers();

	var pd = new Poe.FileFormat.Pml();
	pd.openFile('/Users/ryan/Desktop/Untitled.pml');
	/*
	var note = new Notification('Title', {
		body: 'Lorem ipsum dolor sit amet.'
	});
	*/
};

window.$addClass = function(elm, className) {
	if (elm.className.indexOf(className) !== -1) {
		return;
	}
	elm.className += ' ' + className;
};

window.$removeClass = function(elm, className) {
	elm.className = elm.className.replace(' ' + className, '');
};

window.$hasClass = function(elm, className) {
	return elm.className.indexOf(className) != -1;
};

window.$addAttr = function(elm, attr, val) {

};

window.$insertBefore = function(ins, bef) {
	bef.parentNode.insertBefore(ins, bef);
	return ins;
};

window.$insertAfter = function(ins, aft) {
	if (aft.nextSibling) {
		aft.parentNode.insertBefore(ins, aft.nextSibling);
		return ins;
	}

	aft.parentNode.appendChild(ins);
	return ins;
};

window.$append = function(elm, parent) {
	parent.appendChild(elm);
	return elm;
};

window.$prepend = function(elm, parent) {
	if (parent.childNodes.length != 0) {
		$insertBefore(elm, parent.childNodes[0]);
		return elm;
	}

	return $append(elm, parent);
};

window.$empty = function(elm) {
	elm.innerHTML = '';
	return elm;
};

window.$createElm = function(tagName) {
	return document.createElement(tagName);
};

window.$createElmWithClass = function(tagName, className) {
	var elm = $createElm(tagName);
	$addClass(elm, className);
	return elm;
}

window.$inchToPx = function(inches) {
	return inches * 96;
};

window.$pxToInch = function(px) {
	return px / 96;
};

window.$pxStr = function(num) {
	return parseInt(num) + 'px';
}

window.$css = function(elm, attr, val) {
	elm.style[attr] = val;
	return elm;
};

window.$show = function(elm) {
	$removeClass(elm, 'hidden');
};

window.$hide = function(elm) {
	$addClass(elm, 'hidden');
};

window.$posAboveNode = function(y, node) {
	var rect = node.getBoundingClientRect();
	if (rect.top > y) {
		return true;
	}
	return false;
};

window.$posBelowNode = function(y, node) {
	var rect = node.getBoundingClientRect();
	if (rect.bottom < y) {
		return true;
	}
	return false;
};

window.$posLeftOfNode = function(x, node) {
	var rect = node.getBoundingClientRect();
	if (rect.left > x) {
		return true;
	}
	return false;
};

window.$posRightOfNode = function(x, node) {
	var rect = node.getBoundingClientRect();
	if (rect.right < x) {
		return true;
	}
	return false;
};

window.$posInsideNode = function(x, y, node) {
	var rect = node.getBoundingClientRect();
	var ret = Poe.Contains.NONE;
	if (rect.left <= x && rect.right >= x) {
		ret |= Poe.Contains.HORIZONTAL;
	}
	if (rect.top <= y && rect.bottom >= y) {
		ret |= Poe.Contains.VERTICAL;
	}

	return ret;
};

window.$isNodeBeforeNode = function(node1, node2) {
	var nrect;
	var nrect2;

	if (node1.nodeType === 3) {
		nrect = $getBoundingClientRect(node1);
	} else {
		nrect = node1.getBoundingClientRect();
	}

	if (node2.nodeType === 3) {
		nrect2 = $getBoundingClientRect(node2);
	} else {
		nrect2 = node2.getBoundingClientRect();
	}

	if (nrect.top < nrect2.top) {
		return true;
	} else if (nrect2.top < nrect.top) {
		return false;
	}

	if (nrect.left < nrect2.left) {
		return true;
	} else if (nrect2.left < nrect.left) {
		return false;
	}

	return undefined;
};

window._range = document.createRange();
window.$getBoundingClientRect = function(node) {
	if (node.nodeType === 3) {
		window._range.selectNode(node);
		return window._range.getBoundingClientRect();
	}

	return node.getBoundingClientRect();
};

window.mixin = function(one, two, three) {
	var o = Object.create(one.prototype);
	if (two) {
		o = window.mix(o, two);
	}

	if (three) {
		o = window.mix(o, three);
	}

	return o;
};

window.mix = function(one, two) {
	var o = Object.create(one.prototype);
	for (var k in two) {
		if (two.hasOwnProperty(k)) {
			o[k] = two[k];
		}
	}

	return o;
};

/*
	NOTE: This function is only for testing. It is not
	a part of the API.
*/
window.save = function() {
	var pml = new Poe.FileFormat.Pml();
	pml.saveFile('/Users/ryan/Desktop/Untitled.pml');
};

Poe.Contains = {
	NONE: 0x0,
	VERTICAL: 0x01,
	HORIZONTAL: 0x02,
	BOTH: 0x01 | 0x02
};

})();
