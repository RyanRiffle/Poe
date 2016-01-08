module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
				poe: {
					src: [
						"rewrite/Poe.js",
						"rewrite/DomElement.js",
						"rewrite/EventHandler.js",
						"rewrite/TextBuffer.js",
						"rewrite/Writer.js",
						"rewrite/Document.js"
					],

					dest: "js/Poe.js"
				}
		},

		coffee: {
				compileWithMaps: {
						options: {
								sourceMap: true,
								join: false
						},
						files: {
								"js/Poe.js": [
										"js/01_Core.coffee",
										"js/02_TextObjects.coffee",
										"js/03_Input.coffee",
										"js/05_FileFormats.coffee"
								]
						}
				}
		},

		watch: {
				scripts: {
						files: ["coffee/*.coffee"],
						tasks: ["default"],
						options: {
								spawn: false,
						}
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
	grunt.registerTask('watch', ['watch']);
};
