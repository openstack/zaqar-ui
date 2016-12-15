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
   * @ngname horizon.dashboard.admin.pools.actions
   *
   * @description
   * Provides all of the actions for pools.
   */
  angular.module('horizon.dashboard.admin.pools.actions', [
    'horizon.framework.conf',
    'horizon.dashboard.admin.pools'
  ])
    .run(registerPoolActions);

  registerPoolActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.admin.pools.actions.create.service',
    'horizon.dashboard.admin.pools.actions.delete.service',
    'horizon.dashboard.admin.pools.actions.update.service',
    'horizon.dashboard.admin.pools.resourceType'
  ];

  function registerPoolActions(
    registry,
    createPoolService,
    deletePoolService,
    updatePoolService,
    poolResourceType
  ) {
    var resourceType = registry.getResourceType(poolResourceType);

    resourceType.globalActions
      .append({
        id: 'createPoolAction',
        service: createPoolService,
        template: {
          text: gettext('Create Pool'),
          type: 'create'
        }
      });

    resourceType.batchActions
      .append({
        id: 'batchDeletePoolAction',
        service: deletePoolService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Pools')
        }
      });

    resourceType.itemActions
      .append({
        id: 'updatePoolAction',
        service: updatePoolService,
        template: {
          text: gettext('Update Pool'),
          type: 'row'
        }
      })
      .append({
        id: 'deletePoolAction',
        service: deletePoolService,
        template: {
          text: gettext('Delete Pool'),
          type: 'delete'
        }
      });
  }
})();
