var template = require('./document-payload.template.html!text');

function DocumentPayloadDirective() {
    return {
        scope:            {},
        restrict:         'E',
        transclude:       false,
        template:         template,
        bindToController: { document: '=' },
        controllerAs:     'ctrl',

        controller: function () {
            Object.defineProperty(this, 'lines', {
                get: function () {
                    return this.document && this.document.payload ? this.document.payload.split(/\r?\n/) : [];
                }
            });
        }
    };
}

module.exports = DocumentPayloadDirective;
