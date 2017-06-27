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
   * @name horizon.dashboard.admin.pool-flavors
   * @description Flavors module for messaging pool.
   */

  angular
    .module('horizon.dashboard.admin.pool-flavors', [
      'ngRoute',
      'horizon.dashboard.admin.pool-flavors.actions'
    ])
    .constant('horizon.dashboard.admin.pool-flavors.resourceType', 'OS::Zaqar::Flavors')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.admin.pool-flavors.basePath',
    'horizon.dashboard.admin.pool-flavors.resourceType',
    'horizon.dashboard.admin.pool-flavors.service',
    'horizon.framework.conf.resource-type-registry.service'
  ];

  function run(zaqar, basePath, resourceType, flavorsService, registry) {
    registry.getResourceType(resourceType)
      .setNames(gettext('Pool Flavor'), gettext('Pool Flavors'))
      .setSummaryTemplateUrl(basePath + 'drawer.html')
      .setProperties(flavorProperties())
      .setListFunction(flavorsService.getFlavorsPromise)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true
      })
      .append({
        id: 'pool_group',
        priority: 1
      });
    // for magic-search
    registry.getResourceType(resourceType).filterFacets
      .append({
        label: gettext('Name'),
        name: 'name',
        singleton: true
      })
      .append({
        label: gettext('Pool Group'),
        name: 'pool_group',
        singleton: true
      });
  }

  function flavorProperties() {
    return {
      name: { label: gettext('Name'), filters: [] },
      pool_group: { label: gettext('Pool Group'), filters: ['noName'] },
      capabilities: { label: gettext('Capabilities'), filters: ['noValue'] }
    };
  }

  config.$inject = [
    '$provide',
    '$windowProvider',
    '$routeProvider'
  ];

  /**
   * @ndoc config
   * @name horizon.dashboard.admin.pool-flavors.basePath
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @param {Object} $routeProvider
   * @returns {undefined} Returns nothing
   * @description Base path for the pool-flavors panel
   */
  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/admin/pool-flavors/';
    $provide.constant('horizon.dashboard.admin.pool-flavors.basePath', path);

    $routeProvider.when('/admin/pool_flavors', {
      templateUrl: path + 'panel.html'
    });
  }
}());
