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
    'horizon.dashboard.project.queues.actions.createQueueService',
    'horizon.dashboard.project.queues.actions.deleteQueueService',
    'horizon.dashboard.project.queues.actions.updateQueueService',
    'horizon.dashboard.project.queues.actions.purgeQueueService',
    'horizon.dashboard.project.queues.actions.postMessageService',
    'horizon.dashboard.project.queues.actions.listMessageService',
    'horizon.dashboard.project.queues.actions.signedUrlService',
    'horizon.dashboard.project.queues.actions.createSubscriptionService',
    'horizon.dashboard.project.queues.resourceType'
  ];

  function registerActions(
    registry,
    createQueueService,
    deleteQueueService,
    updateQueueService,
    purgeQueueService,
    postMessageService,
    listMessageService,
    signedUrlService,
    createSubscriptionService,
    resourceType
  ) {

    var queueResourceType = registry.getResourceType(resourceType);
    queueResourceType.itemActions
      .append({
        id: 'messagesPost',
        service: postMessageService,
        template: {
          text: gettext('Post Messages')
        }
      })
      .append({
        id: 'messagesList',
        service: listMessageService,
        template: {
          text: gettext('View Messages')
        }
      })
      .append({
        id: 'queuesSignedUrl',
        service: signedUrlService,
        template: {
          text: gettext('Signed URL')
        }
      })
      .append({
        id: 'queuesItemUpdate',
        service: updateQueueService,
        template: {
          text: gettext('Update')
        }
      })
      .append({
        id: 'queuesItemPurge',
        service: purgeQueueService,
        template: {
          text: gettext('Purge')
        }
      })
      .append({
        id: 'subscriptionsCreate',
        service: createSubscriptionService,
        template: {
          text: gettext('Create Subscription')
        }
      })
      .append({
        id: 'queuesItemDelete',
        service: deleteQueueService,
        template: {
          type: 'delete',
          text: gettext('Delete')
        }
      });

    queueResourceType.batchActions
      .append({
        id: 'queuesBatchCreate',
        service: createQueueService,
        template: {
          type: 'create',
          text: gettext('Create Queues')
        }
      })
      .append({
        id: 'queuesBatchDelete',
        service: deleteQueueService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Queues')
        }
      });
  }

})();
