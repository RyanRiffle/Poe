module.exports = function(grunt) {
	var isWeb = false;
	var isNative = false;

	if (process.argv.length !== 2) {
		switch (process.argv[1]) {
			case null:
			case 'build-dist':
				isWeb = true;
				break;

			case 'build-dist-native':
			case 'build-osx':
			case 'build-win32':
			case 'build-win64':
			case 'build-all':
				isNative = true;
				break;
		}
	} else {
		isWeb = true;
	}

	var config;
	if (isWeb) {
		config = 'rewrite/Config/Web.js';
	} else {
		config = 'rewrite/Config/Native.js';
	}

	console.log('isWeb: ', isWeb);
	console.log('isNative: ', isNative);

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
						config,
						"rewrite/Config/Both.js",
						"rewrite/Keysym.js",
						"rewrite/Object.js",
						"rewrite/Color.js",
						"rewrite/EventHandler.js",
						"rewrite/EventManager.js",
						"rewrite/ShortcutManager.js",
						"rewrite/PoeDefaultShortcuts.js",
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
						"rewrite/Ribbon/UnorderedList.js",
						"rewrite/Ribbon/Popover.js",
						"rewrite/Ribbon/ColorPopover.js",
						"rewrite/Ribbon/Dropdown.js",
						"rewrite/Ribbon/FontDropdown.js",
						"rewrite/FileFormat/FileFormatBase.js",
						"rewrite/FileFormat/ElectronFile.js",
						//"rewrite/FileFormat/WebFile.js",
						"rewrite/FileFormat/Docx/Docx.js",
						"rewrite/FileFormat/Docx/Document.js",
						"rewrite/FileFormat/PoeDocumentPrivate.js",
						"rewrite/FileFormat/Pml.js",
						"rewrite/FileFormat/Docx.js",
						"rewrite/FileFormat/Hash.js"
					],
					dest: 'build/int-js',
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
					"build/js/Poe.min.js": [
						"build/int-js/rewrite/Poe.js",
						(isWeb ? "build/int-js/rewrite/Config/Web.js" : "build/int-js/rewrite/Config/Native.js"),
						"build/int-js/rewrite/Keysym.js",
						"build/int-js/rewrite/EventHandler.js",
						"build/int-js/rewrite/DomElement.js",
						"build/int-js/rewrite/InputHandler.js",
						"build/int-js/rewrite/Writer.js",
						"build/int-js/rewrite/Document.js",
						"build/int-js/rewrite/TextBuffer.js",
						"build/int-js/rewrite/TextBufferMarker.js",
						"build/int-js/rewrite/Caret.js",
						"build/int-js/rewrite/ElementGenerator.js",
						"build/int-js/rewrite/TextLayout.js",
						"build/int-js/rewrite/TextFormat/TextFormat.js",
						"build/int-js/rewrite/TextFormat/TextStyle.js",
						"build/int-js/rewrite/TextFormat/ParagraphStyle.js",
						"build/int-js/rewrite/Ribbon/Ribbon.js",
						"build/int-js/rewrite/Ribbon/TabBar.js",
						"build/int-js/rewrite/Ribbon/TabPane.js",
						"build/int-js/rewrite/Ribbon/Button.js",
						"build/int-js/rewrite/Ribbon/TabPaneGroup.js",
						"build/int-js/rewrite/Ribbon/InputText.js",
						"build/int-js/rewrite/Clipboard.js",
						"build/int-js/rewrite/Ribbon/Select.js",
						"build/int-js/rewrite/FileFormat/FileFormatBase.js",
						"build/int-js/rewrite/FileFormat/ElectronFile.js",
						"build/int-js/rewrite/FileFormat/WebFile.js",
						"build/int-js/rewrite/FileFormat/Docx/Docx.js",
						"build/int-js/rewrite/FileFormat/Docx/Document.js",
						"build/int-js/rewrite/FileFormat/PoeDocumentPrivate.js",
						"build/int-js/rewrite/FileFormat/Pml.js",
						"build/int-js/rewrite/FileFormat/Docx.js"
					]
				}
			}
		},

		clean: {
			dist: {
				src: ['build']
			},

			postBuild: {
				src: ['build/int-*']
			}
		},

		copy: {
			distIndex: {
				src: [ 'distIndex.html' ],
				dest: 'build/index.html'
			},

			favicon: {
				src: ['favicon.png'],
				dest: 'build/',
				expand: true
			},

			fonts: {
				src:['fonts/*'],
				dest: 'build/',
				expand: true
			},

			static: {
				src:['LICENSE', 'README.md', 'index.js', 'package.json'],
				dest: 'build/'
			},
    	},

		autoprefixer: {
			dist: {
				expand: true,
				src: [ 'css/*.css' ],
				dest: 'build/int-css/'
			}
		},

		cssmin: {
			dist: {
				files: {
					'build/css/Poe.min.css': [ 'build/int-css/**/*.css' ]
				}
			}
		},

		shell: {
			osx: {
				command: 'sh ./build-native.sh osx'
			},

			win32: {
				command: 'sh ./build-native.sh win32'
			},

			win64: {
				command: 'sh ./build-native.sh win64'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Default task(s).
	grunt.registerTask(
		'build-dist',
		'Builds Poe and puts it in build',
		['babel', 'uglify', 'copy', 'autoprefixer:dist', 'cssmin:dist', 'clean:postBuild']
	);

	grunt.registerTask('default', ['build-dist']);

	grunt.registerTask(
		'build-osx',
		'Builds Poe for OSX',
		['build-dist', 'shell:osx']
	);

	grunt.registerTask(
		'build-win32',
		'Builds Poe for windows',
		['build-dist', 'shell:win32']
	);

	grunt.registerTask(
		'build-win64',
		'Builds Poe for x64 Windows',
		['build-dist', 'shell:win64']
	);

	grunt.registerTask(
		'build-all',
		'Builds Poe for all platforms',
		['build-dist', 'shell:osx', 'shell:win32', 'shell:win64']
	);
};
