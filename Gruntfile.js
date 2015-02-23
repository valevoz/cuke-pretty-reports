module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {src: ["build"]}
        },
        useminPrepare: {
            options: {
                dest: 'build/<%= pkg.name %>'
            },
            html: 'web/index.html'
        },
        usemin: {
            html: 'build/<%= pkg.name %>/index.html'
        },
        ngAnnotate: {
            app: {
                files: {
                    'build/<%= pkg.name %>/js/app.min.js': ['web/js/pretty-reports.js', 'web/js/filters.js']
                }
            }
        },
        uglify: {
            minify: {
                files: {
                    'build/<%= pkg.name %>/js/app.min.js': ['build/<%= pkg.name %>/js/app.min.js']
                }
            }
        },
        cssmin: {
            minify: {
                files: {
                    'build/<%= pkg.name %>/css/main.min.css': ['web/css/main.css']
                }
            }
        },
        copy: {
            vendor: {
                files: [
                    {
                        expand: 'true',
                        cwd: 'web/js/vendor/',
                        src: '*',
                        dest: 'build/<%= pkg.name %>/js/vendor/'
                    }, {
                        expand: 'true',
                        cwd: 'web/css/vendor/',
                        src: '*',
                        dest: 'build/<%= pkg.name %>/css/vendor/'
                    }
                ]
            },
            html: {
                expand: 'true',
                cwd: 'web/',
                src: '*',
                dest: 'build/<%= pkg.name %>/'
            },
            images: {
                expand: 'true',
                cwd: 'web/images',
                src: '*',
                dest: 'build/<%= pkg.name %>/images'
            }
        },
        chmod: {
            options: {
                mode: '755'
            },
            target: {
                src: ['build/**']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-chmod');

    grunt.registerTask('default', ['clean', 'useminPrepare', 'ngAnnotate', 'uglify:minify', 'cssmin:minify', 'copy', 'usemin', 'chmod']);

};