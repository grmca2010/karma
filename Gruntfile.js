module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
       build    :   ['build']
    },

    jshint: {
        all: {
          options: {
            '-W099': true,
            '-W030': true,
            laxcomma    :   true
          },
          src: ['Gruntfile.js', 'src/js/**/*.js', 'tests/specs/**/*.js']
        }
    },

    karma: {
      //continuous integration mode: run tests once in PhantomJS browser.
        phantomjs: {
            configFile: 'karma.conf.js',
            singleRun: true,
            browsers: ['PhantomJS'],
            autoWatch : false
       }
    }
  });

  //clean plugin
  grunt.loadNpmTasks('grunt-contrib-clean');

  //js lint
  grunt.loadNpmTasks('grunt-contrib-jshint');

  //karma for running tests
  grunt.loadNpmTasks('grunt-karma');

    // Default task(s).
  grunt.registerTask('default', ['clean', 'jshint', 'karma:phantomjs']);

    //grunt.registerTask('jenkins', ['clean', 'jshint', 'karma:phantomjs']);

};
