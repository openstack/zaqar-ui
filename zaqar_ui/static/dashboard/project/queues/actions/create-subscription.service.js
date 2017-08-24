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
    .factory('horizon.dashboard.project.queues.actions.createSubscriptionService',
      createSubscriptionService);

  createSubscriptionService.$inject = [
    '$q',
    'horizon.app.core.metadata.service',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.dashboard.project.queues.events',
    'horizon.dashboard.project.queues.actions.createSubscriptionWorkflow',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.framework.widgets.modal.wizard-modal.service',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngDoc factory
   * @name horizon.dashboard.project.queues.actions.createSubscriptionService
   * @param {Object} $q
   * @param {Object} meta
   * @param {Object} policy
   * @param {Object} events
   * @param {Object} createSubWorkflow
   * @param {Object} zaqar
   * @param {Object} wizard
   * @param {Object} toast
   * @returns {Object} create subscription service
   * @description A service to open the subscriptions wizard.
   */
  function createSubscriptionService(
    $q, meta, policy, events, createSubWorkflow, zaqar, wizard, toast) {

    var message = {
      success: gettext('Subscription %s was successfully created.')
    };

    var scope;
    var model = null;

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

      model = { subscriber: null, ttl: null, options: {} };
      model.queueName = queue.name;
      wizard.modal({
        workflow: createSubWorkflow,
        submit: submit
      });
    }

    function allowed() {
      return policy.ifAllowed({ rules: [['queue', 'add_subscriptions']] });
    }

    function submit(stepModels) {
      angular.extend(model, stepModels.subscriptionForm);
      return zaqar.addSubscription(model).then(success, error);
    }

    function success(response) {
      angular.extend(model, response.data);
      toast.add('success', interpolate(message.success, [model.subscriber]));
      scope.$emit(events.SUBSCRIPTION_CREATE_SUCCESS, model);
    }

    function error() {
      // TODO: Currently, when server throws an error
      // close the modal dialog and display the error message
      // In the future, display the error message inside the dialog
      // and allow user to continue with workflow
      return;
    }

  } // end of createSubscriptionService
})(); // end of IIFE
