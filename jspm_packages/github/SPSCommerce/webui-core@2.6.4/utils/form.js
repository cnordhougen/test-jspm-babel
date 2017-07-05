var $ = require('jquery');
var angular = require('angular');
require('../components/spinner/spinner');

var spsFormUtils = angular.module('sps.formUtils', []);

module.exports = spsFormUtils;

//Sets the specified scope variable to true when the element has focus, and false otherwise
//
//Example usage:
//  <input type="password" ng-model="password" sps-focus-flag="passwordFocused" />
//  $scope.passwordFocused would equal true if element currently has focus
//
//Modified version of http://stackoverflow.com/questions/15798594/angularjs-forms-validate-fields-after-user-has-left-field
spsFormUtils.directive('spsFocusFlag', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attributes) {
            scope[attributes.spsFocusFlag] = false;

            element.on('focus', function () {
                scope[attributes.spsFocusFlag] = true;
                scope.$apply();
            });

            element.on('blur', function () {
                scope[attributes.spsFocusFlag] = false;
                scope.$apply();
            });

            element.closest('form').on('submit', function () {
                scope[attributes.spsFocusFlag] = false;
                scope.$apply();
            });
        }
    };
});


//Provides common form validation methods that can make use of the focus information provided by the sps-focus-flag directive above
//
//This is intended to be injected into a controller that displays a form, and set into the controller's scope:
//  app.controller('someController', ['$scope', 'spsFormValidation', function($scope, spsFormValidation) {
//      $scope.validation = new spsFormValidation($scope);
//
//The submitAttempted() method should be executed in the ng-submit method of the form, as hasError() is designed to hide errors
//from the user if they haven't attempted to fill out that field yet - but only if the form has not been submitted.
//
//Then, these methods can be used in angular directives to determine if the error state should be displayed for an element.
//
//http://stackoverflow.com/questions/19642138/how-to-include-inject-functions-which-use-scope-into-a-controller-in-angularjs
spsFormUtils.factory('spsFormValidation', function() {
    function Interface($scope) {
        this.$scope = $scope;
        this.submitted = false;
    }

    Interface.prototype.submitAttempted = function() {
        this.submitted = true;
    };

    Interface.prototype.hasError = function(element, validation) {
        //Input has failed some validation, and the form has been submitted or the user entered something at one point
        var invalid = (element.$invalid && (this.submitted || element.$dirty));

        if (validation) {
            //Did the input fail this specific validation?
            return invalid && element.$error[validation];
        }

        return invalid;
    };

    //Make sure the element uses the custom sps-focus-flag directive so we track when component has focus
    Interface.prototype.hasErrorNotFocused = function(element, focusFlag, validation) {
        //If the element is valid, no error should be displayed
        //If the element is invalid, display an error UNLESS the form has not been submitted yet AND the element has focus
        var invalid = this.hasError(element, validation);

        if (!invalid) {
            return false;
        } else if (invalid && !this.submitted && this.$scope[focusFlag]) {
            return false;
        } else {
            return true;
        }
    };

    return Interface;
});


//Directive to lowercase user input before it is stored in the model.
//
//Example usage:
//  <input type="text" ng-model="name" lowercase-input required />
//
//http://stackoverflow.com/questions/14419651/angularjs-filters-on-ng-model-in-an-input
spsFormUtils.directive('lowercaseInput', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attributes, controller) {
            controller.$parsers.push(function(inputValue) {
                if (inputValue === null) { return; }

                var transformedInput = inputValue.toLowerCase();

                if (transformedInput !== inputValue) {
                    controller.$setViewValue(transformedInput);
                    controller.$render();
                }

                return transformedInput;
            });
        }
    };
});

// Swaps a button's text for a spinner and disables the button
// based on the boolean value of the provided variable.
// Used as a "Working..." indicator during form submission.
//
// Example usage:
//      <button type="submit" class="button confirm" submit-toggle="submitting">Save</button>
//      submitting = true; // text replaced with spinner, button disabled
//      // process form submission here
//      submitting = false; // spinner replaced with text, button re-enabled
spsFormUtils.directive('submitToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            scope.$watch(attributes.submitToggle, function(newValue) {
                if (newValue){
                    $(element).startSpinning();
                    $(element).prop('disabled', true);
                } else {
                    $(element).stopSpinning();
                    $(element).prop('disabled', false);
                }
            });
        }
    };
});
