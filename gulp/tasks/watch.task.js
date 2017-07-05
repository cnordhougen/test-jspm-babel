export default gulp => gulp.task(
    'watch',
    'Watch and auto lint, test, build, doc.',
    [
        'build:watch',
        'lint:watch',
        'unit-test:watch',
    ]
);
