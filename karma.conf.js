// var webpack = require('./webpack.config.test');

module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'webpack'],
    files: ['src/tests.js'],
    preprocessors: {
      'src/tests.js': ['webpack', 'sourcemap']
    },
    junitReporter: {
      outputDir: (process.env.CIRCLE_TEST_REPORTS || 'public') + '/karma',
      suite: 'karma'
    },
    singleRun: true,
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-spec-reporter',
      'karma-junit-reporter',
      'karma-sourcemap-loader',
      'karma-chrome-launcher'
    ],
    webpack: require('./webpack.config.test'),
  })
}
