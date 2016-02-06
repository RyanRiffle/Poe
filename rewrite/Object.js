(function(Poe) {
'use strict';

/*
	class Poe.Object
	Every class in Poe should inherit Poe.Object
	It ensures
*/
class PoeObject {
	constructor() {

	}

	free() {
		throw new Error(this.prototype.constructor.name + " needs to implement free()");
	}
}

Poe.Object = PoeObject;
})(window.Poe);
