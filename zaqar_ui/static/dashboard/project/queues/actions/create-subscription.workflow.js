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
    .factory('horizon.dashboard.project.queues.actions.createSubscriptionWorkflow',
      createSubscriptionWorkflow);

  createSubscriptionWorkflow.$inject = [
    'horizon.app.core.workflow.factory',
    'horizon.dashboard.project.queues.basePath',
    'horizon.framework.util.i18n.gettext'
  ];

  /**
   * @ngdoc factory
   * @name horizon.dashboard.project.queues.actions.createSubscriptionWorkflow
   * @param {Object} workflowService
   * @param {Object} basePath
   * @param {Object} gettext
   * @returns {Object} create subscription workflow service
   * @description A workflow for the create subscription action.
   */
  function createSubscriptionWorkflow(workflowService, basePath, gettext) {

    var workflow = workflowService({
      title: gettext('Create Subscription'),
      btnText: { finish: gettext('Create') },
      steps: [
        {
          title: gettext('Subscription'),
          templateUrl: basePath + 'steps/subscription/subscription.html',
          formName: 'subscriptionForm'
        }
      ]
    });

    return workflow;
  }

})();
