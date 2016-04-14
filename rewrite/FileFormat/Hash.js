(function(Poe) {
'use strict';

class Hash {
	constructor() {
		this._data = null;
	}

	setData(data) {
		this._data = data;
	}

	getHash() {
		var nums = [];
		var index = 0;
		for (var x = 0; x < this._data.length; x+=2, index++) {
			nums[index] = parseInt((this._data.charCodeAt(x) + this._data.charCodeAt(x+1)) / 6);
		}

		return nums;
	}

	verifyHash(hash) {
		if (this._data === null) {
			throw new Error('You must use Hash.setData before Hash.verifyHash');
		}

		if (this.getHash() === hash) {
			return true;
		}

		return false;
	}
}

Poe.FileFormat.Hash = Hash;
})(window.Poe);
