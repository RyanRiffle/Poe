module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		babel: {
			options: {
				presets: ['es2015']
			},
			dist: {
				files: [{
					expand: true,
					src: [
						"rewrite/Poe.js",
						"rewrite/Keysym.js",
						"rewrite/EventHandler.js",
						"rewrite/DomElement.js",
						"rewrite/InputHandler.js",
						"rewrite/Writer.js",
						"rewrite/Document.js",
						"rewrite/TextBuffer.js",
						"rewrite/TextBufferMarker.js",
						"rewrite/Caret.js",
						"rewrite/ElementGenerator.js",
						"rewrite/TextLayout.js",
						"rewrite/TextFormat/TextFormat.js",
						"rewrite/TextFormat/TextStyle.js",
						"rewrite/TextFormat/ParagraphStyle.js",
						"rewrite/Ribbon/Ribbon.js",
						"rewrite/Ribbon/TabBar.js",
						"rewrite/Ribbon/TabPane.js",
						"rewrite/Ribbon/Button.js",
						"rewrite/Ribbon/TabPaneGroup.js",
						"rewrite/Ribbon/InputText.js",
						"rewrite/Clipboard.js",
						"rewrite/Ribbon/Select.js",
						"rewrite/FileFormat/FileFormatBase.js",
						"rewrite/FileFormat/ElectronFile.js",
						"rewrite/FileFormat/Docx/Docx.js",
						"rewrite/FileFormat/Docx/Document.js",
						"rewrite/FileFormat/PoeDocumentPrivate.js",
						"rewrite/FileFormat/Pml.js",
						"rewrite/FileFormat/Docx.js"
					],
					dest: 'js/ES5',
					ext: '.js'
				}]
			}
		},

		uglify: {
				Poe: {
					options: {
						mangle: false
					},
					files: {
						"js/Poe.min.js": [
							"js/ES5/rewrite/Poe.js",
							"js/ES5/rewrite/Keysym.js",
							"js/ES5/rewrite/EventHandler.js",
							"js/ES5/rewrite/DomElement.js",
							"js/ES5/rewrite/InputHandler.js",
							"js/ES5/rewrite/Writer.js",
							"js/ES5/rewrite/Document.js",
							"js/ES5/rewrite/TextBuffer.js",
							"js/ES5/rewrite/TextBufferMarker.js",
							"js/ES5/rewrite/Caret.js",
							"js/ES5/rewrite/ElementGenerator.js",
							"js/ES5/rewrite/TextLayout.js",
							"js/ES5/rewrite/TextFormat/TextFormat.js",
							"js/ES5/rewrite/TextFormat/TextStyle.js",
							"js/ES5/rewrite/TextFormat/ParagraphStyle.js",
							"js/ES5/rewrite/Ribbon/Ribbon.js",
							"js/ES5/rewrite/Ribbon/TabBar.js",
							"js/ES5/rewrite/Ribbon/TabPane.js",
							"js/ES5/rewrite/Ribbon/Button.js",
							"js/ES5/rewrite/Ribbon/TabPaneGroup.js",
							"js/ES5/rewrite/Ribbon/InputText.js",
							"js/ES5/rewrite/Clipboard.js",
							"js/ES5/rewrite/Ribbon/Select.js",
							"js/ES5/rewrite/FileFormat/FileFormatBase.js",
							"js/ES5/rewrite/FileFormat/ElectronFile.js",
							"js/ES5/rewrite/FileFormat/Docx/Docx.js",
							"js/ES5/rewrite/FileFormat/Docx/Document.js",
							"js/ES5/rewrite/FileFormat/PoeDocumentPrivate.js",
							"js/ES5/rewrite/FileFormat/Pml.js",
							"js/ES5/rewrite/FileFormat/Docx.js"
						]
					}
				}
		},

		clean: ["js"]
	});

	// Load the plugin that provides the "coffee" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-babel');

	// Default task(s).
	grunt.registerTask('default', ['babel','uglify']);
};
