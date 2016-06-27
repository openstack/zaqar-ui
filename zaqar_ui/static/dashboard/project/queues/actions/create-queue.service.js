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
    .factory('horizon.dashboard.project.queues.actions.createQueueService', createQueueService);

  createQueueService.$inject = [
    'horizon.app.core.metadata.service',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.dashboard.project.queues.events',
    'horizon.dashboard.project.queues.actions.createQueueWorkflow',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.framework.widgets.modal.wizard-modal.service',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngDoc factory
   * @name horizon.dashboard.project.queues.actions.createQueueService
   * @Description A service to open the queues wizard.
   */
  function createQueueService(meta, policy, events, createQueueWorkflow, zaqar, wizard, toast) {

    var message = {
      success: gettext('Queue %s was successfully created.')
    };

    var scope;
    var model = {
      queue_name: null,
      metadata: {}
    };

    var service = {
      initScope: initScope,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    // we define initScope so that the table controller
    // will know when a new queue has been created
    function initScope($scope) {
      scope = $scope;
      var queueWatcher = $scope.$on(events.DETAILS_CHANGED, onDetailChange);
      var metadataWatcher = $scope.$on(events.METADATA_CHANGED, onMetadataChange);
      $scope.$on('$destroy', function destroy() {
        queueWatcher();
        metadataWatcher();
      });
    }

    function onDetailChange(e, queue) {
      angular.extend(model, queue);
      e.stopPropagation();
    }

    function onMetadataChange(e, metadata) {
      model.metadata = metadata;
      e.stopPropagation();
    }

    function perform() {
      wizard.modal({
        scope: scope,
        workflow: createQueueWorkflow,
        submit: submit
      });
    }

    function allowed() {
      return policy.ifAllowed({ rules: [['queue', 'add_queue']] });;
    }

    function submit() {
      return zaqar.createQueue(model).then(success);
    }

    function success(response) {
      toast.add('success', interpolate(message.success, [response.data.name]));
      scope.$emit(events.CREATE_SUCCESS, response.data);
    }

  } // end of createQueueService
})(); // end of IIFE
