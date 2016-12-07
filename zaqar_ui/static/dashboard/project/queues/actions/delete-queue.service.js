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
    .factory('horizon.dashboard.project.queues.actions.deleteQueueService', deleteQueueService);

  deleteQueueService.$inject = [
    '$q',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.project.queues.events',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.modal.deleteModalService',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngDoc factory
   * @name horizon.dashboard.project.queues.actions.deleteQueueService
   * @param {Object} $q
   * @param {Object} policy
   * @param {Object} zaqar
   * @param {Object} events
   * @param {Object} gettext
   * @param {Object} $qExtensions
   * @param {Object} deleteModal
   * @param {Object} toast
   * @returns {Object} delete queue service
   * @description Brings up the delete queues confirmation modal dialog.
   * On submit, delete given queues.
   * On cancel, do nothing.
   */
  function deleteQueueService(
    $q, policy, zaqar, events, gettext, $qExtensions, deleteModal, toast) {

    var context;
    var service = {
      initAction: initAction,
      allowed: allowed,
      perform: perform
    };

    return service;

    //////////////

    function initAction() {
      context = { successEvent: events.DELETE_SUCCESS };
    }

    function perform(items, $scope) {
      var queues = angular.isArray(items) ? items : [items];
      context.labels = labelize(queues.length);
      context.deleteEntity = deleteQueue;
      $qExtensions.allSettled(queues.map(checkPermission)).then(afterCheck);

      function afterCheck(result) {
        if (result.fail.length > 0) {
          toast.add('error', getMessage(result.fail));
        }
        if (result.pass.length > 0) {
          deleteModal.open($scope, result.pass.map(getEntity), context);
        }
      }
    }

    function allowed() {
      return policy.ifAllowed({ rules: [['zaqar', 'delete_queues']] });
    }

    function deleteQueue(queue) {
      return zaqar.deleteQueue(queue);
    }

    function checkPermission(queue) {
      return { promise: allowed(queue), context: queue };
    }

    function getMessage(entities) {
      var message = gettext("You are not allowed to delete queues: %s");
      return interpolate(message, [entities.map(getName).join(", ")]);
    }

    function labelize(count) {
      return {

        title: ngettext(
          'Confirm Delete Queue',
          'Confirm Delete queues', count),

        message: ngettext(
          'You have selected "%s". Deleted queue is not recoverable.',
          'You have selected "%s". Deleted queues are not recoverable.', count),

        submit: ngettext(
          'Delete Queue',
          'Delete Queues', count),

        success: ngettext(
          'Deleted Queue: %s.',
          'Deleted Queues: %s.', count),

        error: ngettext(
          'Unable to delete Queue: %s.',
          'Unable to delete Queues: %s.', count)
      };
    }

    function getName(item) {
      return getEntity(item).name;
    }

    function getEntity(item) {
      return item.context;
    }

  }
})();
