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
    .factory('horizon.dashboard.project.queues.actions.createQueueWorkflow', createQueueWorkflow);

  createQueueWorkflow.$inject = [
    'horizon.app.core.workflow.factory',
    'horizon.dashboard.project.queues.basePath',
    'horizon.framework.util.i18n.gettext'
  ];

  /**
   * @ngdoc factory
   * @name horizon.dashboard.project.queues.actions.createQueueWorkflow
   * @param {Object} workflowService
   * @param {Object} basePath
   * @param {Object} gettext
   * @returns {Object} create queue workflow service
   * @description A workflow for the create queue action.
   */
  function createQueueWorkflow(workflowService, basePath, gettext) {

    var workflow = workflowService({
      title: gettext('Create Queue'),
      btnText: { finish: gettext('Create') },
      steps: [{
        title: gettext('Queue Details'),
        templateUrl: basePath + 'steps/queue-details/queue-details.html',
        formName: 'queueDetailsForm'
      }, {
        title: gettext('Queue Metadata'),
        templateUrl: basePath + 'steps/queue-metadata/queue-metadata.html',
        formName: 'queueMetadataForm'
      }]
    });

    return workflow;
  }

})();
