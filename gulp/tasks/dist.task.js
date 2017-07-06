/* eslint-env node */
export default gulp => gulp.task(
    'dist',
    'Remove unnecessary files for distribution',
    () => gulp.runSequence(
        () => require('del')([
            gulp.files.dirs.gulp,
            gulp.files.dirs.test,
            gulp.files.dot,
            gulp.files.es6,
            gulp.files.gulpfile,
            gulp.files.karmaConfig,
            gulp.files.sass,
            gulp.files.specs,
        ]),
        () => gulp.src('.gitignore.dist')
                  .pipe(require('rename')('.gitignore'))
                  .pipe(gulp.dest('.'))
    }
);
