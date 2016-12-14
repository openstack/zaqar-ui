/**
 * Copyright 2015 Catalyst IT Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {
  'use strict';

  angular
    .module('horizon.app.core.openstack-service-api')
    .factory('horizon.app.core.openstack-service-api.zaqar', ZaqarAPI);

  ZaqarAPI.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service'
  ];

  function ZaqarAPI(apiService, toast) {

    var queuePath = '/api/zaqar/queues/';
    var subPath = '/api/zaqar/queues/%s/subscriptions/';
    var poolPath = '/api/zaqar/pools/';
    var flavorPath = '/api/zaqar/flavors/';

    var service = {
      getQueues: getQueues,
      createQueue: createQueue,
      deleteQueue: deleteQueue,
      updateQueue: updateQueue,
      getSubscriptions: getSubscriptions,
      addSubscription: addSubscription,
      deleteSubscription: deleteSubscription,
      getPools: getPools,
      getPool: getPool,
      createPool: createPool,
      deletePool: deletePool,
      updatePool: updatePool,
      getFlavors: getFlavors,
      getFlavor: getFlavor,
      createFlavor: createFlavor,
      deleteFlavor: deleteFlavor,
      updateFlavor: updateFlavor
    };

    return service;

    //////////

    function getQueues() {
      var msg = gettext('Unable to retrieve the Queues.');
      return apiService.get(queuePath).error(error(msg));
    }

    function createQueue(newQueue) {
      var msg = gettext('Unable to create the queue.');
      return apiService.put(queuePath, newQueue).error(error(msg));
    }

    function deleteQueue(queueName) {
      return apiService.delete(queuePath, [queueName]);
    }

    function updateQueue(queue) {
      var msg = gettext('Unable to update the queue.');
      var url = '/api/zaqar/queue/' + queue.queue_name;
      var form = { metadata: queue.metadata };
      return apiService.post(url, form).error(error(msg));
    }

    function getSubscriptions(queue) {
      var url = interpolate(subPath, [queue.name]);
      return apiService.get(url);
    }

    function addSubscription(sub) {
      var msg = gettext('Unable to add subscription.');
      var url = interpolate(subPath, [sub.queueName]);
      return apiService.put(url, sub).error(error(msg));
    }

    function deleteSubscription(queue, subscription) {
      var msg = gettext('Unable to delete subscription.');
      var url = interpolate(subPath, [queue.name]);
      return apiService.delete(url, subscription).error(error(msg));
    }

    function getPools() {
      var msg = gettext('Unable to retrieve the pools.');
      return apiService.get(poolPath).error(error(msg));
    }

    function getPool(poolName) {
      var msg = gettext('Unable to retrieve the pool.');
      var url = poolPath + poolName;
      return apiService.get(url).error(error(msg));
    }

    function createPool(newPool) {
      var msg = gettext('Unable to create the pool.');
      return apiService.put(poolPath, newPool).error(error(msg));
    }

    function deletePool(poolName) {
      return apiService.delete(poolPath, [poolName]);
    }

    function updatePool(pool) {
      var msg = gettext('Unable to update the pool.');
      var url = poolPath + pool.name;
      return apiService.post(url, pool).error(error(msg));
    }

    function getFlavors() {
      var msg = gettext('Unable to retrieve the flavors.');
      return apiService.get(flavorPath).error(error(msg));
    }

    function getFlavor(flavorName) {
      var msg = gettext('Unable to retrieve the flavor.');
      var url = flavorPath + flavorName;
      return apiService.get(url).error(error(msg));
    }

    function createFlavor(newFlavor) {
      var msg = gettext('Unable to create the flavor.');
      return apiService.put(flavorPath, newFlavor).error(error(msg));
    }

    function deleteFlavor(flavorName) {
      return apiService.delete(flavorPath, [flavorName]);
    }

    function updateFlavor(flavor) {
      var msg = gettext('Unable to update the flavor.');
      var url = flavorPath + flavor.name;
      return apiService.post(url, flavor).error(error(msg));
    }

    function error(message) {
      return function() {
        toast.add('error', message);
      };
    }
  }
}());
