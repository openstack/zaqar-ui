/*
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
(function() {
  "use strict";

  angular
    .module('horizon.dashboard.admin.pool-flavors')
    .factory('horizon.dashboard.admin.pool-flavors.service', flavorsService);

  flavorsService.$inject = [
    'horizon.app.core.openstack-service-api.zaqar'
  ];

  /*
   * @ngdoc factory
   * @name horizon.dashboard.admin.pool-flavors.service
   *
   * @description
   * This service provides functions that are used through
   * the Pool Flavors features.
   */
  function flavorsService(zaqar) {
    return {
      getFlavorsPromise: getFlavorsPromise
    };

    /*
     * @ngdoc function
     * @name getFlavorsPromise
     * @description
     * Given filter/query parameters, returns a promise for the matching
     * flavors.  This is used in displaying lists of Pool Flavors.
     */
    function getFlavorsPromise(params) {
      return zaqar.getFlavors(params).then(modifyResponse);
    }

    function modifyResponse(response) {
      return {data: {items: response.data.items.map(modifyItem)}};

      function modifyItem(item) {
        // we should set 'trackBy' as follows ideally.
        // item.trackBy = item.id + item.updated_at;
        var timestamp = new Date();
        item.trackBy = item.name.concat(timestamp.getTime());
        return item;
      }
    }
  }
})();
