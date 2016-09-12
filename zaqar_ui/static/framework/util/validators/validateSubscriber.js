/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name validateSubscriber
   * @restrict A
   *
   * @description
   * A valid subscriber must be in the form of mailto, HTTP, or HTTPS.
   * This validator checks for the correct format.
   *
   * @example
   * ```
   * <input type="text" ng-model="someValue" validate-subscriber">
   * ```
   */
  angular
    .module('horizon.framework.util.validators')
    .directive('validateSubscriber', validateSubscriber);

  function validateSubscriber() {

    var regex = /^(http:\/\/\w+|https:\/\/\w+|mailto:\w+)/;
    var directive = {
      require: 'ngModel',
      restrict: 'A',
      link: link
    };

    return directive;

    ////////////////

    function link(scope, element, attrs, ctrl) {

      if (!ctrl) { return; }
      ctrl.$parsers.push(subValidator);
      ctrl.$formatters.push(subValidator);

      function subValidator(value) {
        ctrl.$setValidity('validateSubscriber', regex.test(value));
        return value;
      }
    } // end of link
  } // end of validateSubscriber
})();
