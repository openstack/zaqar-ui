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

  /**
   * @ngdoc overview
   * @ngname horizon.dashboard.project.queues.actions
   * @description Provides all of the actions for queues.
   */
  angular.module('horizon.dashboard.project.queues.actions', [
    'horizon.framework.conf',
    'horizon.app.core'])
   .run(registerActions);

  registerActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.project.queues.actions.createService',
    'horizon.dashboard.project.queues.actions.deleteService',
    'horizon.dashboard.project.queues.resourceType'
  ];

  function registerActions(
    registry,
    createService,
    deleteService,
    resourceType
  ) {

    var queueResourceType = registry.getResourceType(resourceType);
    queueResourceType.itemActions
      .append({
        id: 'queuesRowDelete',
        service: deleteService,
        template: {
          text: gettext('Delete')
        }
      });

    queueResourceType.batchActions
      .append({
        id: 'queuesBatchCreate',
        service: createService,
        template: {
          type: 'create',
          text: gettext('Create Queues')
        }
      })
      .append({
        id: 'queuesBatchDelete',
        service: deleteService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Queues')
        }
      });
  }

})();
