(function(FileFormat) {
FileFormat.Docx = {
	sizeToPxCount: function(size) {
		return parseInt((size / 20) * 1.25);
	}
};

})(window.Poe.FileFormat);
