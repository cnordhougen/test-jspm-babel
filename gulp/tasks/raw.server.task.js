export default gulp => gulp.task.server(
    'raw',
    'Serve unbundled app & reload on changes.',
    [ 'babel:watch', 'build-css:watch' ],
    {
        port:  8100,
        https: true,
        files: [].concat(gulp.files.static.flat)
                 .concat(gulp.files.static.recursive)
                 .concat([
                     gulp.files.css,
                     gulp.files.js,
                     gulp.files.templates,
                 ]),
        openUrl: 'https://dev.commerce.spscommerce.com/localhost/',
    }
);
