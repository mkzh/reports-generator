module.exports = function(grunt) {
  // COnfigure tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['src/main.js']
    },
    removelogging: {
      dist: {
        src: "src/*.js"
      }
    },
    uglify: {
      dist: {
        options: {
          compress: {
            drop_console: true
          }
        },
        files: {
          'dist/<%= pkg.name %>.amd.min.js' : ['src/main.js']
        }
      }
    },
    watch: {
      files: ['<%= jshint.files >'],
      tasks: ['jshint', 'uglify']
    }, 
    connect: {
      test: {
        options: {
          port: '9001', 
          base: '.',
          keepalive: true
        }
      }
    },
    concurrent: {
      target: {
        tasks: ['connect', 'watch']
      }
    }
  });

  // Load taks from npm packages
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks("grunt-remove-logging");

  grunt.registerTask('default', ['removelogging', 'jshint', 'uglify', 'concurrent:target']);
};
