module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
        all: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          globals: {
            jQuery: true
          },
          src: ['Gruntfile.js', 'scripts/js/*.js', '/specs/*.js']
        }
    },

    karma: {
      //continuous integration mode: run tests once in PhantomJS browser.
        phantomjs: {
            configFile: 'karma.conf.js',
            singleRun: true,
            browsers: ['PhantomJS'],
            autoWatch : false
       },
       chrome: {
           configFile: 'karma.conf.js',
           singleRun: true,
           browsers: ['Chrome', 'Chrome_without_security'],
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
