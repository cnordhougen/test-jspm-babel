/* eslint-env node *//* eslint "import/unambiguous": "off", "import/no-commonjs": "off" */
module.exports = config => {
    let specs = process.env.TEST_SPEC || 'src/';
    if (specs.match(/\/$/)) {
        specs += '**/*';
    }
    specs += '.spec.js';

    config.set({
        autoWatch:  true,
        singleRun:  true,
        browsers:   [ 'jsdom' ],
        frameworks: [ 'jspm', 'jasmine' ],
        reporters:  [ 'progress', 'coverage', 'remap-coverage', 'threshold', 'junit' ],

        jspm: {
            config:    'config.js',
            loadFiles: [
                'test/setup.js',
                specs,
            ],
            serveFiles: [
                'src/**/!(*spec).js',
                'test/!(setup).js',
                'src/**/*.template.html',
                'src/**/*.styles.min.css',
            ]
        },

        proxies: {
            '/base': '/base/src'
        },

        preprocessors: {
            'src/**/*.spec.js':   [ 'babel' ],
            'test/*.js':          [ 'babel' ],
            'src/**/!(*spec).js': [ 'coverage' ]
        },

        coverageReporter:      { type: 'in-memory' },
        remapCoverageReporter: { html: 'test/coverage/' },

        junitReporter: {
            outputDir:      'test',
            outputFile:     'junit-report.xml',
            useBrowserName: false
        },

        thresholdReporter: {
            statements: 90,
            branches:   90,
            functions:  90,
            lines:      90
        },

        browserNoActivityTimeout: 60000
    });
};
