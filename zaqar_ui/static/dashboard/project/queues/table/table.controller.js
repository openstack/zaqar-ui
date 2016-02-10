/**
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
   * @name queuesTableController
   * @ngController
   *
   * @description
   * Controller for the queues table
   */
  angular
    .module('horizon.dashboard.project.queues')
    .controller('horizon.dashboard.project.queues.tableController', queuesTableController);

  queuesTableController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.project.queues.batch-actions.service',
    'horizon.dashboard.project.queues.events'
  ];

  function queuesTableController($scope, zaqar, batchActions, events) {

    var ctrl = this;

    ctrl.queues = [];
    ctrl.queuesSrc = [];

    ctrl.batchActions = batchActions;
    ctrl.batchActions.initScope($scope);

    init();
    initScope();

    //////////

    function initScope() {
      var createWatcher = $scope.$on(events.CREATE_SUCCESS, onCreateSuccess);
      $scope.$on('$destroy', function destroy() {
        createWatcher();
      })
    }

    //////////

    function init() {
      zaqar.getQueues().success(getQueuesSuccess);
    }

    function getQueuesSuccess(response) {
      ctrl.queuesSrc = response;
    }

    function onCreateSuccess(e, newQueue) {
      e.stopPropagation();
      ctrl.queuesSrc.push(newQueue);
    }
  }

})();
