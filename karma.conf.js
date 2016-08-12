// Karma configuration
// Generated on Wed Feb 05 2014 14:57:27 GMT+0000 (GMT)

module.exports = function(config) {
  config.set({

    basePath : './',
    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.min.js',
      {pattern: 'scripts/*.js', included: true,served: true},
      {pattern: 'specs/*.js', included: true,served: true}
    ],

    plugins : ['karma-chrome-launcher','karma-jasmine'],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    //reporters: ['progress', 'junit', 'html'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    //loggers : [{type    :   'console'}],


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers : ['Chrome'],

    preprocessors: {
        "**/*.html": []
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    reporters: ['progress'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
