module.exports = function(grunt) {

    var TEMPLATES_LOCATION        = "./views/partials/tmpl/",       // don't forget the trailing /
        TEMPLATES_EXTENSION       = ".hbs",
        TEMPLATES_OUTPUT_LOCATION = "./static/js/",       // don't forget the trailing /
        TEMPLATES_OUTPUT_FILENAME = "compiled_templates.js";  // don't forget the .js

    grunt.initConfig({
        watch: {
            handlebars: {
                files: [TEMPLATES_LOCATION + '**/*' + TEMPLATES_EXTENSION],
                tasks: ['handlebars:compile']
            }
        },
        handlebars: {
            compile: {
                src: TEMPLATES_LOCATION + '**/*' + TEMPLATES_EXTENSION,
                dest: TEMPLATES_OUTPUT_LOCATION + TEMPLATES_OUTPUT_FILENAME,
                options: {
                    amd: false,
                    namespace: "APP.Templates"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');

}