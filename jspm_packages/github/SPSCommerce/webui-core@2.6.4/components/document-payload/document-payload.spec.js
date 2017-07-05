require('test/harness');
require('./document-payload.module');
var exampleDoc = require('./example/example-doc.txt!text');

var filename    = 'example-doc.txt',
    downloadUrl = './example/example-doc.txt',
    description = 'Example EDI document',
    html        = '<div><spsui-document-payload document="doc"></spsui-document-payload></div>';

describe('components/document-payload', function () {
    var $scope,
        $compile,
        $rootScope,
        element;

    function getElement() {
        var element = $compile(html)($scope).find('spsui-document-payload');
        $scope.$digest();
        return element;
    }

    beforeEach(angular.mock.module('webui-document-payload'));

    beforeEach(inject(function (_$rootScope_, _$compile_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function () {
        $scope = $rootScope.$new();
        $scope.doc = {
            payload:     exampleDoc,
            filename:    filename,
            url:         downloadUrl,
            description: description
        };
    });

    it('should show description when present', function () {
        expect(getElement().find('.document-description').length).toBe(1);
    });

    it('should not show description when not present', function () {
        $scope.doc.description = '';
        expect(getElement().find('.document-description').length).toBe(0);
    });

    it('should not show the top info section until filename has a value', function () {
        $scope.doc.filename = '';

        var element = getElement();

        expect(element.find('.document-info').length).toBe(0);

        $scope.doc.filename = filename;
        $scope.$digest();

        expect(element.find('.document-info').length).toBe(1);
    });

    it('should not show the panel header or main panel until document has a value', function () {
        $scope.doc.payload = '';

        var element = getElement();

        expect(element.find('.document-header').length).toBe(0);
        expect(element.find('.document-payload').length).toBe(0);

        $scope.doc.payload = exampleDoc;
        $scope.$digest();

        expect(element.find('.document-header').length).toBe(1);
        expect(element.find('.document-payload').length).toBe(1);
    });

    it('ctrl.lines should be document contents split on newlines', function () {
        var ctrl = getElement().isolateScope().ctrl;
        expect(ctrl.lines.join('\n')).toBe(ctrl.document.payload.replace(/[\r\n]+/g, '\n'));
    });
});

