
module.exports = DateTimeDirective;

DateTimeDirective.$inject = [
    '$filter',
    'localizationService'
];

function DateTimeDirective($filter, localizationService) {
    return {
        restrict: 'AE',
        scope: {
            value: '=',
            format: '@',
            relative: '@'
        },
        link: function($scope, $elem) {

            var string = '';
            var filter = $filter('spsuiDate');
            var unwatchLocaleChange = localizationService.onLocaleChange(_render);
            var unwatchTimezoneChange = localizationService.onTimezoneChange(_render);

            $scope.$on('$destroy', function () {
                unwatchLocaleChange();
                unwatchTimezoneChange();
            });

            _render(true);

            /**
             * Change the text content of the element to the formated date string.
             *
             * @param {*} changed
             * @private
             */
            function _render (changed) {
                if (changed) {
                    string = filter($scope.value, $scope.format, $scope.relative);
                    $elem.text(string);
                }
            }
        }
    };
}
