module.exports = function(grunt) {

var electron_path = "/Users/ryan/Downloads/electron-v0.36.2-darwin-x64/Electron";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
        core: {
            src: [
                "coffee/Poe.coffee",
                "coffee/ToolBarHelper.coffee",
                "coffee/Standalone/ToolBar.coffee",
                "coffee/Standalone/ToolBarItem.coffee",
                "coffee/Standalone/Glyphicon.coffee",
                "coffee/Standalone/Button.coffee",
                "coffee/Standalone/ButtonGroup.coffee",
                "coffee/Standalone/Dropdown.coffee",

                "coffee/Writer.coffee",
                "coffee/TextObject.coffee",
                "coffee/FontManager.coffee",
            ],
            dest: "js/01_Core.coffee"
        },

        textObjects: {
            src: [
                "coffee/Word.coffee",
                "coffee/Style.coffee",
                "coffee/TextStyle.coffee",
                "coffee/ParagraphStyle.coffee",
                "coffee/TextCursor.coffee",
                "coffee/Document.coffee",
                "coffee/Page.coffee",
                "coffee/Paragraph.coffee",
                "coffee/Line.coffee",
                "coffee/ListItem.coffee",
                "coffee/List.coffee"
            ],
            dest: "js/02_TextObjects.coffee"
        },

        input: {
            src: [
                "coffee/Keymap.coffee",
            ],
            dest: "js/03_Input.coffee"
        },

        fileFormats: {
            src: [
                "coffee/FileFormat/PDF.coffee",
                "coffee/FileFormat/RTF.coffee"
            ],
            dest: "js/05_FileFormats.coffee"
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
            files: ["coffee/*"],
            tasks: ["default"]
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
  grunt.registerTask('default', ['concat', 'coffee']);
  grunt.registerTask('watch', ['watch']);
};
