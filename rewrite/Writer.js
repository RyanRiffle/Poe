(function(Poe) {
'use strict';


class Writer extends Poe.DomElement {
	constructor(parentSelector) {
		super('div');
		$addClass(this.elm, 'writer');
		if (!parentSelector) {
			$append(this.elm, document.body);
		} else {
			let parent = document.querySelector(parentSelector);
			$append(this.elm, parent);
		}

		window.onresize = this._evtWindowResized;
	}

	setDocument(doc)
	{
		$append(doc.elm, this.elm);
		this.doc = doc;
		this.doc.show();
		return this;
	}

	_evtWindowResized(event)
	{

	}
}

Poe.Writer = Writer;

})(window.Poe);
