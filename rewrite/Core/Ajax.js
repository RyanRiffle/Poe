(function(Core) {
	Core.$get = function(url, onRecv) {
		var req = new XMLHttpRequest();
		req.onload = function() {
			console.log(this);
			onRecv();
		};

		var errorCb = function(evt) {
			console.log(evt);
		};
		req.onerror = errorCb;
		req.onabort = errorCb;
		req.ontimeout = errorCb;
		req.open("get", url, true);
		return req;
	};
})(window.Core = window.Core || {});
