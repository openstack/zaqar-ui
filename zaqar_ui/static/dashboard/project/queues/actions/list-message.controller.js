/**
 * Copyright 2017 Catalyst IT Ltd.
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
   * @name messageController
   * @ngController
   *
   * @description
   * Controller for the messages table
   */
  angular
    .module('horizon.dashboard.project.queues')
    .controller('horizon.dashboard.project.queues.actions.messageController',
        messageController);

  messageController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.zaqar'
  ];

  function messageController($scope, zaqar) {

    var ctrl = this;
    ctrl.queue = $scope.model.id;
    ctrl.messages = [];
    /* TODO: actions will be implemented later.
    ctrl.claimMessage = claimMessage;
    ctrl.deleteMessage = deleteMessage;
    */

    zaqar.getMessages(ctrl.queue).then(function (response) {
      ctrl.messages = response.data;
    });

    //////////

    /* TODO: actions will be implemented later.
    function claimMessage(message) {
      console.info(message);
    }

    function deleteMessage(message) {
      console.info(message);
    }
    */
  }
})();
