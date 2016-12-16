/*
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
   * @ngname horizon.dashboard.admin.pool-flavors.actions
   *
   * @description
   * Provides all of the actions for pool flavors.
   */
  angular.module('horizon.dashboard.admin.pool-flavors.actions', [
    'horizon.framework.conf',
    'horizon.dashboard.admin.pool-flavors'
  ])
    .run(registerPoolFlavorActions);

  registerPoolFlavorActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.admin.pool-flavors.actions.create.service',
    'horizon.dashboard.admin.pool-flavors.actions.delete.service',
    'horizon.dashboard.admin.pool-flavors.actions.update.service',
    'horizon.dashboard.admin.pool-flavors.resourceType'
  ];

  function registerPoolFlavorActions(
    registry,
    createPoolFlavorService,
    deletePoolFlavorService,
    updatePoolFlavorService,
    flavorResourceType
  ) {
    var resourceType = registry.getResourceType(flavorResourceType);

    resourceType.globalActions
      .append({
        id: 'createPoolFlavorAction',
        service: createPoolFlavorService,
        template: {
          text: gettext('Create Pool Flavor'),
          type: 'create'
        }
      });

    resourceType.batchActions
      .append({
        id: 'batchDeletePoolFlavorAction',
        service: deletePoolFlavorService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Pool Flavors')
        }
      });

    resourceType.itemActions
      .append({
        id: 'updatePoolFlavorAction',
        service: updatePoolFlavorService,
        template: {
          text: gettext('Update Pool Flavor'),
          type: 'row'
        }
      })
      .append({
        id: 'deletePoolFlavorAction',
        service: deletePoolFlavorService,
        template: {
          text: gettext('Delete Pool Flavor'),
          type: 'delete'
        }
      });
  }
})();
