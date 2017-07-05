## spsui-document-payload

| First Available | Lifecycle | Screenshot                        | Files                                           |
|-----------------|-----------|-----------------------------------|-------------------------------------------------|
| v2.5.3          | New       | [screenshot][document-payload-ss] | [components/document-payload][document-payload] |

*This is a new feature. You are encouraged to use it and [report any issues you may find][issues].*

This component provides a document payload display with line numbers and a download link.

#### How to Import

**JSPM + SystemJS**

Require the document payload module into your app and list it as a dependency.

app.js

```javascript
require('webui-core');
require('webui-core/components/document-payload');

module.exports = angular.module('myApp', ['webui-core', 'webui-document-payload']);
```

**Bower**

index.html

```html
<head>
    <!-- Webui-core and module scripts -->
    <script src="/bower_components/webui-core/dist/webui-core.min.js"></script>
    <script src="/bower_components/webui-core/dist/webui-document-payload.min.js"></script>
</head>
```

#### Usage

```javascript
function MyController() {
    this.doc = {
        filename:    'dc4-incomingfile-1076146100-20161013105353.txt',
        description: 'Cabelas 856',
        payload:     'ISA*00* *00* *12*5035320874 *ZZ*SPSSCHEELSSPTS...',
        url:         'https://path/to/document'
    };
}
```

```html
<spsui-document-payload document="ctrl.doc"></spsui-document-payload>
```

#### Attributes

spsui-document-payload has one attribute, "document", which is required. Its value should be an object with the following properties:

| Property    | Type   | Required | Description                                   |
|-------------|--------|----------|-----------------------------------------------|
| payload     | string | yes      | document payload (contents)                   |
| filename    | string | yes      | document filename                             |
| url         | string | yes      | URL from which the document can be downloaded |
| description | string | no       | description or add'l info about the document  |

---

[issues]: https://github.com/SPSCommerce/webui-core/issues
[document-payload]: https://github.com/SPSCommerce/webui-core/blob/master/core/components/document-payload
[document-payload-ss]: https://cloud.githubusercontent.com/assets/6266754/19401168/60af518c-921f-11e6-9edc-13566229fb6b.png
