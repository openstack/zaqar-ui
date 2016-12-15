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
   * @ngdoc factory
   * @name horizon.dashboard.admin.pools.actions.update.service
   * @description
   * Service for the storage pool update modal
   */
  angular
    .module('horizon.dashboard.admin.pools.actions')
    .factory('horizon.dashboard.admin.pools.actions.update.service', updateService);

  updateService.$inject = [
    'horizon.app.core.openstack-service-api.policy',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.admin.pools.actions.workflow',
    'horizon.dashboard.admin.pools.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service'
  ];

  function updateService(
    policy, zaqar, workflow, resourceType,
    actionResult, gettext, $qExtensions, modal, toast
  ) {

    var message = {
      success: gettext('Pool %s was successfully updated.')
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

    function perform(selected) {
      var title, submitText;
      title = gettext('Update Pool');
      submitText = gettext('Update');
      var config = workflow.init('update', title, submitText);

      // load current data
      zaqar.getPool(selected.name).then(onLoad);
      function onLoad(response) {
        config.model.name = response.data.name;
        config.model.group = response.data.group;
        config.model.weight = response.data.weight;
        config.model.uri = response.data.uri;
        config.model.options = response.data.options;
      }

      return modal.open(config).then(submit);
    }

    function allowed() {
      return policy.ifAllowed({ rules: [['pool', 'update_pool']] });
    }

    function submit(context) {
      return zaqar.updatePool(context.model, true).then(success, true);
    }

    function success(response) {
      toast.add('success', interpolate(message.success, [response.data.name]));
      var result = actionResult.getActionResult().updated(resourceType, response.data.name);
      return result.result;
    }
  }
})();
