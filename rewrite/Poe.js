(function() {
'use strict';

window.Poe = window.Poe || {
	FileFormats: {},
	Gui: {}
};

Poe.init = function(parentSelector) {
	window.app = new Poe.Writer(parentSelector);
	var doc = new Poe.Document();
	app.setDocument(doc);
	app.show();
};

window.$addClass = function(elm, className) {
	elm.className += ' ' + className;
};

window.$removeClass = function(elm, className) {
	elm.className = elm.className.replace(' ' + className, '');
};

window.$hasClass = function(elm, className) {
	return elm.className.indexOf(className) != -1;
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

})();
