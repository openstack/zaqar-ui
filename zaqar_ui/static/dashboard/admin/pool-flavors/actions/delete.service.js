/**
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use self file except in compliance with the License. You may obtain
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
   * @ngdoc factory
   * @name horizon.dashboard.admin.pool-flavors.actions.delete.service
   * @Description
   * Brings up the delete pool flavors confirmation modal dialog.
   * On submit, delete given pool flavors.
   * On cancel, do nothing.
   */
  angular
    .module('horizon.dashboard.admin.pool-flavors.actions')
    .factory('horizon.dashboard.admin.pool-flavors.actions.delete.service', deleteService);

  deleteService.$inject = [
    '$q',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.admin.pool-flavors.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.modal.deleteModalService',
    'horizon.framework.widgets.toast.service'
  ];

  function deleteService(
    $q, policy, zaqar, resourceType, actionResult, gettext, $qExtensions,
    deleteModal, toast
  ) {
    var scope, context;
    var notAllowedMessage = gettext("You are not allowed to delete pool flavors: %s");

    var service = {
      initAction: initAction,
      allowed: allowed,
      perform: perform
    };

    return service;

    //////////////

    function initAction() {
      context = { };
    }

    function perform(items, newScope) {
      scope = newScope;
      var flavors = angular.isArray(items) ? items : [items];
      context.labels = labelize(flavors.length);
      context.deleteEntity = deleteFlavor;
      return $qExtensions.allSettled(flavors.map(checkPermission)).then(afterCheck);
    }

    function allowed() {
      return policy.ifAllowed({ rules: [['pool_flavor', 'delete_flavor']] });
    }

    function checkPermission(flavor) {
      return {promise: allowed(), context: flavor};
    }

    function afterCheck(result) {
      var outcome = $q.reject();  // Reject the promise by default
      if (result.fail.length > 0) {
        toast.add('error', getMessage(notAllowedMessage, result.fail));
        outcome = $q.reject(result.fail);
      }
      if (result.pass.length > 0) {
        outcome = deleteModal.open(scope, result.pass.map(getEntity), context).then(createResult);
      }
      return outcome;
    }

    function createResult(deleteModalResult) {
      var result = actionResult.getActionResult();
      deleteModalResult.pass.forEach(function markDeleted(item) {
        result.deleted(resourceType, getEntity(item).name);
      });
      deleteModalResult.fail.forEach(function markFailed(item) {
        result.failed(resourceType, getEntity(item).name);
      });
      return result.result;
    }

    function labelize(count) {
      return {
        title: ngettext(
          'Confirm Delete Pool Flavor',
          'Confirm Delete Pool Flavors', count),
        message: ngettext(
          'You have selected "%s". Deleted Pool Flavor is not recoverable.',
          'You have selected "%s". Deleted Pool Flavors are not recoverable.', count),
        submit: ngettext(
          'Delete Pool Flavor',
          'Delete Pool Flavors', count),
        success: ngettext(
          'Deleted Pool Flavor: %s.',
          'Deleted Pool Flavors: %s.', count),
        error: ngettext(
          'Unable to delete Pool Flavor: %s.',
          'Unable to delete Pool Flavors: %s.', count)
      };
    }

    function deleteFlavor(flavor) {
      return zaqar.deleteFlavor(flavor, true);
    }

    function getMessage(message, entities) {
      return interpolate(message, [entities.map(getName).join(", ")]);
    }

    function getName(result) {
      return getEntity(result).name;
    }

    function getEntity(result) {
      return result.context;
    }
  }
})();
