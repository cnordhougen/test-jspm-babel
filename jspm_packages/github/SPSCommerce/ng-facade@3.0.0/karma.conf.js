/* eslint-env node */
const files = require('./gulp/files');

module.exports = config => {
    config.set({
        autoWatch:  true,
        singleRun:  true,
        browsers:   [ 'jsdom' ],
        frameworks: [ 'jspm', 'jasmine' ],
        reporters:  [ 'progress', 'coverage', 'threshold', 'junit' ],

        jspm: {
            config:    'config.js',
            loadFiles: [
                files.testSetup,
                files.specs
                // 'test/specs/common/CommonModule.spec.js'
            ],
            serveFiles: [
                files.source,
                files.testMeta
            ]
        },

        proxies: {
            [`/${files.dirs.source}/`]: `/base/${files.dirs.source}/`,
            [`/${files.dirs.test}/`]:   `/base/${files.dirs.test}/`,
            [`/${files.dirs.jspm}/`]:   `/base/${files.dirs.jspm}/`
        },

        preprocessors: {
            [files.source]: [ 'babel' ]
        },

        babelPreprocessor: {
            options: {
                presets: [ 'es2015', 'stage-1' ],
                plugins: [ 'transform-decorators-legacy', '__coverage__' ]
            }
        },

        coverageReporter: {
            reporters: [
                {
                    type: 'html',
                    dir:  files.dirs.coverage
                }
            ]
        },

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
