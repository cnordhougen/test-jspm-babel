require('handsontable');
var Handsontable = window.Handsontable;
/**
 * Mapped Set renderer
 * @param {Object} instance Handsontable instance
 * @param {Element} TD Table cell where to render
 * @param {Number} row
 * @param {Number} col
 * @param {String|Number} prop Row object property name
 * @param value Value to render (remember to escape unsafe HTML before inserting to DOM!)
 * @param {Object} cellProperties Cell properties (shared by cell renderer and editor)
 */
var MappedSelectRenderer = function (instance, TD, row, col, prop, value, cellProperties) {
    var mappedLabel = value;

    if (mappedLabel === null ||
        mappedLabel === undefined ||
        mappedLabel === false) {
        // handsontable was passing me null values on deletes...
        mappedLabel = '';
    }

    if (('source' in cellProperties) && (mappedLabel.length > 0)) {
        for (var i = 0; i < cellProperties.source.length; i++) {
            if (cellProperties.source[i].value === mappedLabel) {
                mappedLabel = cellProperties.source[i].label;
            }
        }
    }

    Handsontable.renderers.AutocompleteRenderer(instance, TD, row, col, prop, mappedLabel, cellProperties);
};

Handsontable.MappedSelectRenderer = MappedSelectRenderer;  //Left for backward compatibility with versions prior 0.10.0
Handsontable.renderers.MappedSelectRenderer = MappedSelectRenderer;
Handsontable.renderers.registerRenderer('mappedselect', MappedSelectRenderer);

var MappedSelectEditor = Handsontable.editors.SelectEditor.prototype.extend();

MappedSelectEditor.prototype.prepare = function () {
    Handsontable.editors.BaseEditor.prototype.prepare.apply(this, arguments);

    var selectOptions = this.cellProperties.source;

    Handsontable.Dom.empty(this.select);

    for (var i = 0; i < selectOptions.length; i++) {
        var pair = selectOptions[i];
        var optionElement = document.createElement('OPTION');
        optionElement.value = pair.value;
        Handsontable.Dom.fastInnerHTML(optionElement, pair.label);
        this.select.appendChild(optionElement);
    }
};

Handsontable.editors.MappedSelectEditor = MappedSelectEditor;
Handsontable.editors.registerEditor('mappedselect', MappedSelectEditor);

Handsontable.MappedSelectCell = {
    renderer: Handsontable.renderers.MappedSelectRenderer,
    editor: Handsontable.editors.MappedSelectEditor
};

Handsontable.cellTypes.mappedselect = Handsontable.MappedSelectCell;
