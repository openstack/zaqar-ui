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
    .factory('horizon.dashboard.project.queues.actions.updateQueueService', updateQueueService);

  updateQueueService.$inject = [
    'horizon.app.core.metadata.service',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.dashboard.project.queues.events',
    'horizon.dashboard.project.queues.actions.updateQueueWorkflow',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.framework.widgets.modal.wizard-modal.service',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngDoc factory
   * @name horizon.dashboard.project.queues.actions.updateQueueService
   * @param {Object} meta
   * @param {Object} policy
   * @param {Object} events
   * @param {Object} updateQueueWorkflow
   * @param {Object} zaqar
   * @param {Object} wizard
   * @param {Object} toast
   * @returns {Object} update queue service
   * @description A service to open the queues wizard.
   */
  function updateQueueService(meta, policy, events, updateQueueWorkflow, zaqar, wizard, toast) {

    var message = {
      success: gettext('Queue %s was successfully updated.')
    };

    var scope;
    var model = {
      queue_name: null,
      metadata: {}
    };

    var service = {
      initAction: initAction,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function initAction() {
    }

    function perform(queue, $scope) {
      scope = $scope;

      model = queue;
      model.queue_name = queue.name;
      wizard.modal({
        data: {queue: model},
        workflow: updateQueueWorkflow,
        submit: submit
      });
    }

    function allowed() {
      return policy.ifAllowed({ rules: [['queue', 'update_queue']] });
    }

    function submit(stepModels) {
      model = stepModels.queueDetailsForm;
      model.metadata = stepModels.queueMetadataForm;
      return zaqar.updateQueue(model).then(success);
    }

    function success(response) {
      toast.add('success', interpolate(message.success, [response.data.name]));
      scope.$emit(events.UPDATE_SUCCESS, response.data);
    }

  } // end of updateQueueService
})(); // end of IIFE
