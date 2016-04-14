(function(Poe) {
	if (!window.electron) {
		return;
	}
	
	Poe.config = Poe.config || {};
	Poe.config.isNative = true;
})(window.Poe);
