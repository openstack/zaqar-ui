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
    'horizon.dashboard.project.queues.events',
    'horizon.dashboard.project.queues.resourceType',
    'horizon.framework.conf.resource-type-registry.service',
  ];

  function queuesTableController($scope, zaqar, events, type, registry) {

    var ctrl = this;

    ctrl.queues = [];
    ctrl.queuesSrc = [];

    //ctrl.getItemActions = typeRegistry.getItemActionsFunction(imageResourceType);
    ctrl.batchActions = registry.getBatchActionsFunction(type);

    init();
    initScope();

    //////////

    function initScope() {
      var createWatcher = $scope.$on(events.CREATE_SUCCESS, onCreateSuccess);
      var deleteWatcher = $scope.$on(events.DELETE_SUCCESS, onDeleteSuccess);
      $scope.$on('$destroy', function destroy() {
        createWatcher();
        deleteWatcher();
      })
    }

    //////////

    function init() {
      registry.initActions(type, $scope);
      zaqar.getQueues().success(getQueuesSuccess);
    }

    function getQueuesSuccess(response) {
      // hz-table expects all items to have the id field
      // so we need to manually add name as id here
      ctrl.queuesSrc = response;
      ctrl.queuesSrc.map(function addIdentifier(queue, index){
        queue.id = queue.name;
      });
    }

    function onCreateSuccess(e, newQueue) {
      e.stopPropagation();
      newQueue.id = newQueue.name;
      ctrl.queuesSrc.push(newQueue);
    }

    function onDeleteSuccess(e, deletedNames) {
      // remove existing item from table
      e.stopPropagation();
      for (var i = ctrl.queuesSrc.length - 1; i >= 0; i--) {
        var queue = ctrl.queuesSrc[i];
        if (deletedNames.indexOf(queue.name) >= 0) {
          ctrl.queuesSrc.splice(i, 1);
        }
      }
      // clear selections upon deletion
      $scope.$emit('hzTable:clearSelected');
    }
  }

})();
