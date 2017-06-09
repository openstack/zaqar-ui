/**
 * Copyright 2015 Catalyst IT Ltd
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
   * @name horizon.dashboard.project.queues
   * @description Dashboard module to host various queues panels.
   */
  angular
    .module('horizon.dashboard.project.queues', [
      'horizon.dashboard.project.queues.actions'])
    .constant('horizon.dashboard.project.queues.events', events())
    .constant('horizon.dashboard.project.queues.resourceType', 'OS::Zaqar::Queues')
    .config(config);

  config.$inject = [
    '$provide',
    '$windowProvider',
    '$routeProvider'
  ];

  /**
   * @ngdoc value
   * @name horizon.dashboard.project.queues.events
   * @returns {Object} The event object
   * @description a list of events for queues
   */
  function events() {
    return {
      CREATE_SUCCESS: 'horizon.dashboard.project.queues.CREATE_SUCCESS',
      DETAILS_CHANGED: 'horizon.dashboard.project.queues.DETAILS_CHANGED',
      METADATA_CHANGED: 'horizon.dashboard.project.queues.METADATA_CHANGED',
      DELETE_SUCCESS: 'horizon.dashboard.project.queues.DELETE_SUCCESS',
      UPDATE_SUCCESS: 'horizon.dashboard.project.queues.UPDATE_SUCCESS',
      PURGE_SUCCESS: 'horizon.dashboard.project.queues.PURGE_SUCCESS',
      POST_MESSAGE_SUCCESS: 'horizon.dashboard.project.queues.POST_MESSAGE_SUCCESS',
      SUBSCRIPTION_CREATE_SUCCESS: 'horizon.dashboard.project.queues.SUBSCRIPTION_CREATE_SUCCESS'
    };
  }

  /**
   * @ndoc config
   * @name horizon.dashboard.project.queues.basePath
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @param {Object} $routeProvider
   * @returns {undefined} Returns nothing
   * @description Base path for the queues panel
   */
  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/project/queues/';
    $provide.constant('horizon.dashboard.project.queues.basePath', path);
    $routeProvider.when('/project/queues', {
      templateUrl: path + 'table/queue.html'
    });
  }

})();
