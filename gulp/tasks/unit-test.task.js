/* eslint-env node */
export default gulp => {
    gulp.addOption({
        name: 'spec',
        type: 'string',
    });

    gulp.task(
        'unit-test',
        'Run Karma unit tests and then exit.',
        [ 'babel' ],
        { watch: [ gulp.files.es6, gulp.files.specs, gulp.files.templates ] },
        () => {
            const child_process = require('child_process')
                , env           = Object.assign({}, process.env);

            if (gulp.options.spec) {
                env.TEST_SPEC = gulp.options.spec;
            }

            try {
                child_process.execSync('karma start', {
                    cwd:   gulp.baseDir,
                    stdio: 'inherit',
                    env,
                });
            } catch (err) { /* don't kill gulp on test failures */ }
        }
    );

    return gulp;
};
