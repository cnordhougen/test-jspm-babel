export default gulp => gulp.task('build-copy-files', () => {
    gulp.src(gulp.files.static.flat)
        .pipe(gulp.dest(gulp.files.dirs.build));
    gulp.src(gulp.files.static.recursive, { base: '.' })
        .pipe(gulp.dest(gulp.files.dirs.build));
});
