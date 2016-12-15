/*
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name horizon.dashboard.admin.pools
   * @description Pools module for messaging.
   */

  angular
    .module('horizon.dashboard.admin.pools', [
      'ngRoute',
      'horizon.dashboard.admin.pools.actions'
    ])
    .constant('horizon.dashboard.admin.pools.resourceType', 'OS::Zaqar::Pools')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.admin.pools.basePath',
    'horizon.dashboard.admin.pools.resourceType',
    'horizon.dashboard.admin.pools.service',
    'horizon.framework.conf.resource-type-registry.service'
  ];

  function run(zaqar, basePath, resourceType, poolsService, registry) {
    registry.getResourceType(resourceType)
      .setNames(gettext('Pool'), gettext('Pools'))
      .setSummaryTemplateUrl(basePath + 'drawer.html')
      .setProperties(poolProperties())
      .setListFunction(poolsService.getPoolsPromise)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true
      })
      .append({
        id: 'group',
        priority: 1
      })
      .append({
        id: 'weight',
        priority: 1
      })
      .append({
        id: 'uri',
        priority: 2
      });
    // for magic-search
    registry.getResourceType(resourceType).filterFacets
      .append({
        label: gettext('Name'),
        name: 'name',
        singleton: true
      })
      .append({
        label: gettext('Group'),
        name: 'group',
        singleton: true
      })
      .append({
        label: gettext('Weight'),
        name: 'weight',
        singleton: true
      })
      .append({
        label: gettext('URI'),
        name: 'uri',
        singleton: true
      });
  }

  function poolProperties() {
    return {
      name: { label: gettext('Name'), filters: [] },
      group: { label: gettext('Group'), filters: ['noName'] },
      weight: { label: gettext('Weight'), filters: ['noValue'] },
      uri: { label: gettext('URI'), filters: ['noValue'] },
      options: { label: gettext('Options'), filters: ['noValue'] }
    };
  }

  config.$inject = [
    '$provide',
    '$windowProvider',
    '$routeProvider'
  ];

  /**
   * @ndoc config
   * @name horizon.dashboard.admin.pools.basePath
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @param {Object} $routeProvider
   * @returns {undefined} Returns nothing
   * @description Base path for the pools panel
   */
  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/admin/pools/';
    $provide.constant('horizon.dashboard.admin.pools.basePath', path);

    $routeProvider.when('/admin/pools', {
      templateUrl: path + 'panel.html'
    });
  }
}());
