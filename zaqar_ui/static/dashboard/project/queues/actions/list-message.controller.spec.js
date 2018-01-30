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
  describe('horizon.dashboard.project.queues.actions.messageController', function() {
    var zaqar, ctrl, $scope, $q, deferred;

    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.dashboard.project.queues'));

    beforeEach(inject(function ($injector, $controller, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      $scope.model = {
        id: '1'
      };
      zaqar = $injector.get('horizon.app.core.openstack-service-api.zaqar');
      deferred = $q.defer();
      deferred.resolve({data: [{id: '1'}]});
      spyOn(zaqar, 'getMessages').and.returnValue(deferred.promise);

      ctrl = $controller(
        'horizon.dashboard.project.queues.actions.messageController',
        {
          '$scope': $scope,
          'horizon.app.core.openstack-service-api.zaqar': zaqar
        }
      );
    }));

    it('should queue_id is provided by scope variable', function() {
      expect(ctrl.queue).toBe('1');
    });

    it('should load messages for queue', function() {
      $scope.$apply();
      expect(zaqar.getMessages).toHaveBeenCalled();
      expect(ctrl.messages.length).toBe(1);
    });
  });
})();
