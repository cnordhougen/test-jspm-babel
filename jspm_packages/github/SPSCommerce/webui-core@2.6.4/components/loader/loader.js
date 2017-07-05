require('./loader.css!');

var _class = 'loading';
var _parent = document.body;

module.exports = {
    start: _startLoading,
    done: _doneLoading
};

/*
// Use this to show a spinner during the loading. For now, this loader
// is only used by webui-core to hide the flash of unstyled content.
// In the future, it would be great to allow apps to toggle the spinner.

function _appendSpinner() {
    var el = document.createElement('spsui-loader');
    _parent.appendChild(el);
}
*/

function _startLoading() {
    //_appendSpinner();
    _setHidden(_parent);
    _addClass(_parent, _class);
    return this;
}

function _doneLoading() {
    _setVisible(_parent);
    _removeClass(_parent, _class);
    return this;
}

function _setVisible(el) {
    el.style.visibility = 'visible';
}

function _setHidden(el) {
    el.style.visibility = 'hidden';
}

function _addClass(el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}

function _removeClass(el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        var parts = className.split(' ').join('|');
        var regex = new RegExp('(^|\\b)' + parts + '(\\b|$)', 'gi');
        el.className = el.className.replace(regex, ' ');
    }
}
