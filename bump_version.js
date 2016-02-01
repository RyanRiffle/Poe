/* Author: Ryan Riffle */
var fs = require('fs');
fs.readFile('./package.json', function(err, data) {
	if (err) {
		throw new Error('Failed to open package.json. Does it exist?');
	}

	var pkg = JSON.parse(data);
	var version = pkg.version.split('.');

	if (process.argv.length === 2 || process.argv[2] === 'patch') {
		version[2] = parseInt(version[2]) + 1;
	} else if (process.argv[2] === 'minor') {
		version[1] = parseInt(version[1]) + 1;
		version[2] = 0;
	} else if (process.argv[2] === 'major') {
		version[0] = parseInt(version[0]) + 1;
		version[1] = 0;
		version[2] = 0;
	}

	pkg.version = version[0] + '.' + version[1] + '.' + version[2];
	console.log("Version bumped: " + pkg.version);
	fs.writeFile('./package.json', JSON.stringify(pkg, null, 4), function(err) {
		if (err) {
			throw new Error('Failed to write to package.json.');
		}
	});
});
