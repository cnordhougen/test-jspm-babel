
require('./css/vendor.min.css!');
require('./css/fonts.min.css!');
require('./css/main.min.css!');

/**
 * Use FontFaceObserver (https://github.com/bramstein/fontfaceobserver) to load
 * font faces only as needed, instead of all at once.  Promise resolved when the
 * initial font load is complete. Promise rejects if there are errors loading
 * the fonts.
 */

var FontFaceObserver = require('fontfaceobserver');
var SourceCodePro = new FontFaceObserver('Source Code Pro');
var SourceSansPro = new FontFaceObserver('Source Sans Pro');

Promise.all([SourceCodePro.load(), SourceSansPro.load()]).catch(function () {
    console.warn('Unable to load SPS fonts', arguments);
}).then(function () {
    document.documentElement.className += ' spsui-fonts-loaded';
});
