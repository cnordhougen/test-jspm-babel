export default gulp => {
    gulp.task(
        'build',
        'Build the application.',
        [ 'build-copy-files', 'build-code', 'build-css' ]
    );

    gulp.task(
        'build:watch',
        'Build the application and rebuild code when code changes & CSS when Sass changes.',
        [ 'build-copy-files', 'build-code:watch', 'build-css:watch' ]
    );

    gulp.task.server(
        'build',
        'Serve the built application & refresh on changes.',
        [ 'build:watch' ],
        {
            port:    8100,
            https:   true,
            baseDir: gulp.files.dirs.build,
            openUrl: 'https://dev.commerce.spscommerce.com/localhost/',
        }
    );

    return gulp;
};
