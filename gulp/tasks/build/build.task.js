export default gulp => {
    gulp.task(
        'build',
        'Build the application.',
        [ 'babel', 'build-css' ]
    );

    gulp.task(
        'build:watch',
        'Build the application and rebuild code when code changes & CSS when Sass changes.',
        [ 'babel:watch', 'build-css:watch' ]
    );

    return gulp;
};
