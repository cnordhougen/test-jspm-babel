require('handsontable');
var Handsontable = window.Handsontable;

var MaxLengthEditor = Handsontable.editors.TextEditor.prototype.extend();

MaxLengthEditor.prototype.createElements = function () {
    Handsontable.editors.TextEditor.prototype.createElements.apply(this, arguments);

    this.TEXTAREA = document.createElement('input');
    this.TEXTAREA.className = 'handsontableInput';
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = 0;
    this.textareaStyle.height = 0;

    Handsontable.Dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);

};

Handsontable.editors.MaxLengthEditor = MaxLengthEditor;
Handsontable.editors.registerEditor('maxlength', MaxLengthEditor);
