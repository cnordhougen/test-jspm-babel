export default gulp => gulp.task(
    'test',
    'Lint and unit test.',
    [ 'lint', 'unit-test' ]
);
