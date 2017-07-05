/* eslint-env node */
export default gulp => gulp.task(
    'clean',
    'Remove transpiled source, maps, and build',
    () => {
        const del = require('del');
        return del([
            gulp.files.dirs.coverage,
            gulp.files.dirs.gulp,
            gulp.files.dirs.node,
            gulp.files.dot,
            gulp.files.es6,
            gulp.files.gulpfile,
            gulp.files.karmaConfig,
            gulp.files.sass,
            gulp.files.specs,
        ]);
    }
);
