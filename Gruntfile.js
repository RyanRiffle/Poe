module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
				Poe: {
					options: {
						mangle: false
					},
					files: {
						"js/Poe.min.js": [
							"rewrite/Poe.js",
							"rewrite/Keysym.js",
							"rewrite/DomElement.js",
							"rewrite/InputHandler.js",
							"rewrite/EventHandler.js",
							"rewrite/Writer.js",
							"rewrite/Document.js",
							"rewrite/TextBuffer.js",
							"rewrite/TextBufferMarker.js",
							"rewrite/Caret.js",
							"rewrite/ElementGenerator.js",
							"rewrite/TextLayout.js",
							"rewrite/TextFormat/TextFormat.js",
							"rewrite/TextFormat/TextStyle.js",
							"rewrite/Ribbon/Ribbon.js",
							"rewrite/Ribbon/TabBar.js",
							"rewrite/Ribbon/TabPane.js"
						]
					}
				}
		},

		clean: ["js"]
	});

	// Load the plugin that provides the "coffee" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task(s).
	grunt.registerTask('default', ['uglify']);
};
