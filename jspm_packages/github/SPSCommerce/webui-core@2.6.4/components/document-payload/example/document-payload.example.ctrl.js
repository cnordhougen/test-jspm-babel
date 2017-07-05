var docContents = require('./example-doc.txt!text');

function DocPayloadExampleController() {
    this.docWithDescription = {
        payload:     docContents,
        filename:    'example-doc.txt',
        url:         './example-doc.txt',
        description: 'Example EDI document'
    };

    this.docWithoutDescription = {
        payload:     docContents,
        filename:    'example-doc.txt',
        url:         './example-doc.txt'
    };
}

module.exports = DocPayloadExampleController;
