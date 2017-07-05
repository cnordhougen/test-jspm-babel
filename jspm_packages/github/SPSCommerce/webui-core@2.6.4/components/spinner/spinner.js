var $ = require('jquery');
var template = require('./spinner.html!text');

var spinning = 'spinning';
var selector = '.spinnerContainer';

$.fn.extend({
    startSpinning: function () {
        if ($(selector, this).length < 1) {
            this.prepend(template);
        }
        this.addClass(spinning);
    },
    stopSpinning: function () {
        $(selector, this).remove();
        this.removeClass(spinning);
    },
    toggleSpinning: function () {
        if (this.hasClass(spinning)) {
            this.stopSpinning();
        } else {
            this.startSpinning();
        }
    }
});
