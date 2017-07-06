/* eslint-env node */
export default gulp => {
    gulp.task('dist:del', () => {
        const del = require('del');
        return del ([
            gulp.files.dirs.gulp,
            gulp.files.dirs.test,
            gulp.files.dot,
            gulp.files.es6,
            gulp.files.gulpfile,
            gulp.files.karmaConfig,
            gulp.files.sass,
            gulp.files.specs,
        ]);
    });

    gulp.task('dist:rename', () => {
        const rename = require('gulp-rename');
        return gulp.src('.gitignore.dist')
                   .pipe(rename('.gitignore'))
                   .pipe(gulp.dest('.'));
    });

    return gulp.task(
        'dist',
        'Remove unnecessary files for distribution',
        () => gulp.runSequence('dist:del', 'dist:rename')
    );
};
