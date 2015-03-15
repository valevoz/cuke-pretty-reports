module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {src: ["target-grunt"]}
        },
        useminPrepare: {
            options: {
                dest: 'target-grunt/<%= pkg.name %>'
            },
            html: 'web/index.html'
        },
        usemin: {
            html: 'target-grunt/<%= pkg.name %>/index.html'
        },
        ngAnnotate: {
            app: {
                files: {
                    'target-grunt/<%= pkg.name %>/app.min.js': ['web/js/pretty-reports.js', 'web/js/filters.js']
                }
            }
        },
        uglify: {
            minify: {
                files: {
                    'target-grunt/<%= pkg.name %>/app.min.js': ['target-grunt/<%= pkg.name %>/app.min.js']
                }
            }
        },
        cssmin: {
            minify: {
                files: {
                    'target-grunt/<%= pkg.name %>/app.min.css': ['web/css/bootstrap.css','web/css/bootstrap-theme.css','web/css/main.css']
                }
            }
        },
        concat: {
            js: {
                src: ['web/js/angular.min.js', 'web/js/angular-sanitize.min.js', 'web/js/ui-bootstrap-tpls-0.12.0.min.js', 'target-grunt/<%= pkg.name %>/app.min.js'],
                dest: 'target-grunt/<%= pkg.name %>/app.min.js'
            }
        },
        copy: {
            html: {
                expand: 'true',
                cwd: 'web/',
                src: '*.html',
                dest: 'target-grunt/<%= pkg.name %>/'
            },
            favicon: {
                expand: 'true',
                cwd: 'web/',
                src: 'favicon.ico',
                dest: 'target-grunt/<%= pkg.name %>/'
            }
        },
        chmod: {
            options: {
                mode: '755'
            },
            target: {
                src: ['target-grunt/**']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-chmod');

    grunt.registerTask('default', ['clean', 'useminPrepare', 'ngAnnotate', 'uglify:minify', 'concat', 'cssmin:minify', 'copy', 'usemin', 'chmod']);

};