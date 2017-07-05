require('handsontable');
var Handsontable = window.Handsontable;

var MappedSetEditor = Handsontable.editors.AutocompleteEditor.prototype.extend();

MappedSetEditor.prototype.prepare = function () {
    Handsontable.editors.AutocompleteEditor.prototype.prepare.apply(this, arguments);

    this.cellProperties.filter = false;
    this.cellProperties.strict = true;
};

MappedSetEditor.prototype.open = function () {
    Handsontable.editors.HandsontableEditor.prototype.open.apply(this, arguments);

    this.TEXTAREA.style.visibility = 'visible';
    this.focus();

    this.htContainer.style.overflow = 'hidden'; // small hack to prevent vertical scrollbar causing a horizontal scrollbar

    var choicesListHot = this.htEditor.getInstance();
    var that = this;

    choicesListHot.updateSettings({
        'colWidths': [Handsontable.Dom.outerWidth(this.TEXTAREA) - 2],
        afterRenderer: function (TD, row, col, prop, value) {
            TD.innerHTML = '<strong>' + value.label + '</strong>';
        }
    });

    that.instance._registerTimeout(setTimeout(function () {
        that.queryChoices(that.TEXTAREA.value);
        that.htContainer.style.overflow = 'auto'; // small hack to prevent vertical scrollbar causing a horizontal scrollbar
    }, 0));

};

MappedSetEditor.prototype.setValue = function (newValue) {
    // the choices are objects and that makes this tricky
    if (typeof newValue === 'object') {
        newValue = newValue.value;
    } else {
        newValue = findLabelforValue(this.cellProperties.source, newValue);
    }
    this.TEXTAREA.value = newValue;
};

MappedSetEditor.prototype.updateChoicesList = function (choices) {
    var pos = Handsontable.Dom.getCaretPosition(this.TEXTAREA),
        endPos = Handsontable.Dom.getSelectionEndPosition(this.TEXTAREA);

    if ((choices.length > 0) && (typeof choices[0] === 'object')) {
        for (var j = 0; j < choices.length; j++) {
            this.choices.push(choices[j].label);
        }
    }

    this.htEditor.loadData(Handsontable.helper.pivot([choices]));
    this.htEditor.updateSettings({height: this.getDropdownHeight()});

    this.instance.listen();
    this.TEXTAREA.focus();
    Handsontable.Dom.setCaretPosition(this.TEXTAREA, pos, (pos !== endPos ? endPos : void 0));
};

Handsontable.editors.MappedSetEditor = MappedSetEditor;
Handsontable.editors.registerEditor('mappedset', MappedSetEditor);

/**
 * Mapped Set renderer
 * @param {Object} instance Handsontable instance
 * @param {Element} TD Table cell where to render
 * @param {Number} row
 * @param {Number} col
 * @param {String|Number} prop Row object property name
 * @param value Value to render (remember to escape unsafe HTML before inserting to DOM!)
 * @param {Object} cellProperties Cell properites (shared by cell renderer and editor)
 */
var MappedSetRenderer = function (instance, TD, row, col, prop, value, cellProperties) {
    var mappedLabel = value;

    if (('source' in cellProperties) && (value.length > 0)) {
        mappedLabel = findLabelforValue(cellProperties.source, value);
    }

    Handsontable.renderers.AutocompleteRenderer(instance, TD, row, col, prop, mappedLabel, cellProperties);
};

Handsontable.MappedSetRenderer = MappedSetRenderer;
Handsontable.renderers.MappedSetRenderer = MappedSetRenderer;
Handsontable.renderers.registerRenderer('mappedset', MappedSetRenderer);

Handsontable.MappedSetCell = {
    editor: Handsontable.editors.MappedSetEditor,
    renderer: Handsontable.renderers.MappedSetRenderer
};

Handsontable.cellTypes.mappedset = Handsontable.MappedSetCell;


function findLabelforValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].value === val) {
            return arr[i].label;
        }
    }
    return '';
}
