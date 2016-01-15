module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
				poe: {
					src: [
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
					],

					dest: "js/Poe.js"
				}
		},

		clean: ["js"]
	});

	// Load the plugin that provides the "coffee" task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['concat']);
};
