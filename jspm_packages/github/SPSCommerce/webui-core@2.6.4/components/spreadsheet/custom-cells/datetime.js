var $ = require('jquery');
require('handsontable');
require('../../datepicker/datepicker');

var Handsontable = window.Handsontable;
var DateTimeEditor = Handsontable.editors.TextEditor.prototype.extend();

DateTimeEditor.prototype.init = function () {

    Handsontable.editors.TextEditor.prototype.init.apply(this, arguments);

    this.isCellEdited = false;
    var _this = this;

    this.instance.addHook('afterDestroy', function () {
        _this.destroyElements();
    });

};

DateTimeEditor.prototype.createElements = function () {
    Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);

    this.$datePicker = $(this.TEXTAREA);
    this.datePicker = this.TEXTAREA;

    var eventManager = Handsontable.eventManager(this);

    /**
     * Prevent recognizing clicking on jQuery Datepicker as clicking outside of table
     */
    eventManager.addEventListener(this.datePicker, 'mousedown', function (event) {
        Handsontable.helper.stopPropagation(event);
    });

    this.hideDatepicker();
};

DateTimeEditor.prototype.destroyElements = function () {
    this.$datePicker.datetimepicker('destroy');
    this.$datePicker.remove();
};

DateTimeEditor.prototype.open = function () {
    Handsontable.editors.TextEditor.prototype.open.call(this);
    this.showDatepicker();
};

DateTimeEditor.prototype.finishEditing = function () {
    this.hideDatepicker();
    Handsontable.editors.TextEditor.prototype.finishEditing.apply(this, arguments);
};

DateTimeEditor.prototype.showDatepicker = function () {

    var _this = this;
    var dataType = 'date';

    if (('entityType' in this.cellProperties) && this.cellProperties.entityType === 'JTime') {
        dataType = 'time';
    }

    var config = {
        scrollInput: false,
        closeOnDateSelect: true,
        datepicker: dataType === 'date',
        timepicker: dataType === 'time',
        onChangeDateTime: function processChange(dp, $input) {
            _this.setValue($input.val());
        }
    };

    if (dataType === 'date') {
        config.formatDate = 'm/d/Y';
        config.format = 'm/d/Y';
    }

    if (dataType === 'time') {
        config.format = 'h:i:A';
        config.formatTime = 'h:i:A';
        config.step = '30';
    }

    this.$datePicker.datetimepicker(config);
    this.$datePicker.datetimepicker('show');
};

DateTimeEditor.prototype.hideDatepicker = function () {
    this.$datePicker.datetimepicker('hide');
};

Handsontable.editors.DateTimeEditor = DateTimeEditor;
Handsontable.editors.registerEditor('datetime', DateTimeEditor);

Handsontable.DateTimeCell = {
    editor: Handsontable.editors.DateTimeEditor,
    renderer: Handsontable.renderers.AutocompleteRenderer //displays small gray arrow on right side of the cell
};

Handsontable.cellTypes.datetime = Handsontable.DateTimeCell;
