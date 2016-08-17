// Karma configuration
module.exports = function(config) {
  config.set({

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers : [],
    phantomjsLauncher: {
        exitOnResourceError: true
    },
    plugins : ['karma-jasmine','karma-chrome-launcher'],

    basePath : './',
    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      "lib/*.js",
      {pattern: 'scripts/*.js', included: true,served: true},
      {pattern: 'specs/*.js', included: true,served: true},
      {pattern: 'templates/*.html', included: true,served: true}
    ],

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
