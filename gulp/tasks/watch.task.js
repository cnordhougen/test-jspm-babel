export default gulp => gulp.task(
    'watch',
    'Watch and auto lint, test, build, doc.',
    [
        'build:watch',
        'jsdoc:watch',
        'lint:watch',
        'unit-test:watch',
    ]
);
