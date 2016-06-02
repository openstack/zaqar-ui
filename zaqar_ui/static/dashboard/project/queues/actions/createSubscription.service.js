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
   * @Description A service to open the subscriptions wizard.
   */
  function createSubscriptionService(
    $q, meta, policy, events, createWorkflow, zaqar, wizard, toast) {

    var message = {
      success: gettext('Subscription %s was successfully created.')
    };

    var scope;
    var model = null;

    var service = {
      initScope: initScope,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    // we define initScope so that the table controller
    // will know when a new subscription has been created
    function initScope($scope) {
      scope = $scope;
      var subWatcher = $scope.$on(events.SUBSCRIPTION_CHANGED, onSubscriptionChange);
      $scope.$on('$destroy', function destroy() {
        subWatcher();
      });
    }

    function onSubscriptionChange(e, subscription) {
      angular.extend(model, subscription);
      e.stopPropagation();
    }

    function perform(queue) {
      model = { subscriber: null, ttl: null, options: {} };
      model.queueName = queue.name;
      wizard.modal({
        scope: scope,
        workflow: createWorkflow,
        submit: submit
      });
    }

    function allowed(queue) {
      return policy.ifAllowed({ rules: [['queue', 'add_subscriptions']] });;
    }

    function submit() {
      return zaqar.addSubscription(model).then(success, error);
    }

    function success(response) {
      angular.extend(model, response.data);
      toast.add('success', interpolate(message.success, [model.subscriber]));
      scope.$emit(events.SUBSCRIPTION_CREATE_SUCCESS, model);
    }

    function error(response) {
      // TODO: Currently, when server throws an error
      // close the modal dialog and display the error message
      // In the future, display the error message inside the dialog
      // and allow user to continue with workflow
      return;
    }

  } // end of createSubscriptionService
})(); // end of IIFE



