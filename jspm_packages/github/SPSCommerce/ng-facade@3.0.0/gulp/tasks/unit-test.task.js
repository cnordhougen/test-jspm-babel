/* eslint-env node */
export default gulp => gulp.task(
    'unit-test',
    'Run Jasmine unit tests via Karma.',
    { watch: [].concat(gulp.files.specs, gulp.files.source) },
    done => {
        const karma = require('child_process').spawn('karma', [ 'start' ], {
            cwd:   gulp.baseDir,
            stdio: 'inherit'
        });
        karma.on('close', () => done());
    }
);
