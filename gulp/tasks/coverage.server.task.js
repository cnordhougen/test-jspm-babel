export default gulp => gulp.task.server(
    'coverage',
    'Serve test coverage report & refresh on changes',
    [ 'unit-test:watch' ],
    {
        port:       8820,
        baseDir:    gulp.files.dirs.coverage,
        files:      gulp.files.coverage,
        dirListing: true,
    }
);
