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

  /**
   * @ngdoc overview
   * @name subscriptionController
   * @ngController
   *
   * @description
   * Controller for the subscriptions table
   */
  angular
    .module('horizon.dashboard.project.queues')
    .controller('horizon.dashboard.project.queues.table.subscriptionController',
        subscriptionController);

  subscriptionController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.project.queues.events',
    'horizon.framework.widgets.toast.service'
  ];

  function subscriptionController($scope, zaqar, events, toast) {

    var ctrl = this;
    ctrl.queuesMap = {};
    ctrl.deleteSubscription = deleteSubscription;

    init();
    initScope();

    //////////

    function initScope() {
      var expandWatcher = $scope.$on('hzTable:rowExpanded', getSubscriptions);
      var createWatcher = $scope.$on(events.SUBSCRIPTION_CREATE_SUCCESS, addSubscription);
      $scope.$on('$destroy', function destroy() {
        expandWatcher();
        createWatcher();
      });
    }

    function init() {}

    //////////

    function checkAndInitMap(id) {
      if (!ctrl.queuesMap.hasOwnProperty(id)) {
        ctrl.queuesMap[id] = {
          subscriptions: []
        };
      }
    }

    function addSubscription(event, sub) {
      checkAndInitMap(sub.queueName);
      ctrl.queuesMap[sub.queueName].subscriptions.push(sub);
    }

    function deleteSubscription(queue, sub) {
      var msg = gettext('Removed %(subscriber)s subscriber from the %(queue)s queue.');
      var context = { subscriber: sub.subscriber, queue: queue.name };
      zaqar.deleteSubscription(queue.name, sub).success(deleteSuccess);

      function deleteSuccess() {
        toast.add('success', interpolate(msg, context, true));
        var index = ctrl.queuesMap[queue.name].subscriptions.indexOf(sub);
        if (index >= 0) { ctrl.queuesMap[queue.name].subscriptions.splice(index, 1); }
      }
    }

    function getSubscriptions(event, queue) {
      zaqar.getSubscriptions(queue).success(function (response) {
        checkAndInitMap(queue.name);
        ctrl.queuesMap[queue.name].subscriptions = response;
      });
    }
  }

})();
