var $ = require('jquery');
var _ = require('lodash');
var template = require('./autocomplete.html!text');
var controller = require('./autocomplete.ctrl');

module.exports = AutocompleteDirective;

function AutocompleteDirective() {
    return {
        scope: {
            source: '=',
            ngModel: '=?',
            modelType: '@?',
            idKey: '=?',
            textKey: '=',
            hint: '=?',
            limit: '=?',
            debounce: '@?',
            minchars: '=?',
            placeholder: '@?',
            selectOnEnter: '=?',
            allowUserInput: '=?',
            onReady: '=?',
            onChange: '=?'
        },
        restrict: 'E',
        template: template,
        controller: controller,
        bindToController: true,
        controllerAs: 'autoCompleteCtrl',
        require: ['spsuiAutocomplete', '?ngModel'],
        link: function ($scope, elem, attrs, req) {

            var ctrl = req[0];
            var ngModel = req[1];
            var $input = $(elem).find('input');

            ctrl.setup($input, ngModel);

            // The ngModel value may change outside of our component
            // and we want to make sure we reflect that selection.

            var stopWatching = $scope.$watch(function () {
                return ctrl.ngModel;
            }, function (val) {
                $input.typeahead('val', ctrl.getTextValue(val));
            });

            // When the component is destroyed, stop watching our values.

            $scope.$on('$destroy', function () {
                $input.typeahead('destroy');
                stopWatching();
            });

            // Initialize the Twitter Typeahead.js plugin on our element.

            $input.typeahead({
                highlight: true,
                hint: ctrl.hint,
                minLength: ctrl.minchars
            }, {
                async: true,
                limit: ctrl.limit,
                display: ctrl.textKey,
                source: ctrl.getSource(),
                name: _.uniqueId('autocomplete'),
                templates: {
                    notFound: function() {
                        return '<div class="tt-suggestion">' + ctrl.noResults + '</div>';
                    },
                    pending: function() {
                        return '<div class="tt-suggestion">' + ctrl.searching + '</div>';
                    }
                }
            }).on('typeahead:render', function () {

                // Set the width of the menu to match input width.
                // Unfortunately needs to be done via jquery. :|

                var width = $input.outerWidth() - 2;
                $input.siblings('.tt-menu').width(width);

            }).on('typeahead:select typeahead:autocomplete', function (ev, selection) {

                // Selection was made, update the model with it.

                ctrl.updateModel(selection);

            }).on('input', function () {

                var val = $(this).val();

                if (!val) {
                    ctrl.updateModel(null);
                    return;
                }

                if (ctrl.allowUserInput) {
                    ctrl.updateModel(val);
                }

            }).on('autocomplete:suggestions', function () {

                if (ctrl.api.state.onlyExactMatch) {
                    ctrl.api.closeMenu();
                }

            }).on('focus blur', function () {

                // Menu likes to open immediately on focus. It should really
                // only open when the user changes the input value, which it
                // does well enough on it's own.

                // Also menu should always close when we blur the input.

                $input.typeahead('close');

            }).on('keydown', function (e) {

                var key = e.keyCode || e.which;

                // Pressing enter on the input should complete the suggestion,
                // emulate this by selecting the first available option.

                if (ctrl.selectOnEnter) {
                    if (key === 13 && ctrl.api.state.open) {
                        e.preventDefault();
                        ctrl.api.selectSuggestion();
                    }
                }

            });
        }
    };
}
