/* eslint-env node */
export default gulp => gulp.task(
    'clean',
    'Remove transpiled source, maps, and build',
    () => {
        const del = require('del');
        return del([
            gulp.files.build,
            gulp.files.js,
            gulp.files.jsMaps,
        ]);
    }
);
