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

(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.queues')
    .controller('horizon.dashboard.project.queues.steps.SubscriptionController',
      SubscriptionController);

  SubscriptionController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.project.queues.events'
  ];

  /**
   * @ngdoc controller
   * @name horizon.dashboard.project.queues.steps.SubscriptionController
   * @param {Object} $scope
   * @param {Object} zaqar
   * @param {Object} events
   * @returns {undefined} Returns nothing
   * @description This controller is use for creating a subscription.
   */
  function SubscriptionController($scope, zaqar, events) {

    var ctrl = this;
    ctrl.subscription = { ttl: 3600 };
    ctrl.update = false;

    ////////////////////////

    // watch this object, when it changes, emit to parent listeners
    var watcher = $scope.$watchCollection(getSubscription, onSubscriptionChange);
    $scope.$on('$destroy', function() {
      watcher();
    });

    ////////////////////////

    function getSubscription() {
      return ctrl.subscription;
    }

    function onSubscriptionChange(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.$emit(events.SUBSCRIPTION_CHANGED, newValue);
      }
    }

  } // end of SubscriptionController

})();
