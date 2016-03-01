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

  angular
    .module('horizon.dashboard.project.queues')
    .factory('horizon.dashboard.project.queues.actions.updateWorkflow', updateWorkflow);

  updateWorkflow.$inject = [
    'horizon.dashboard.project.queues.actions.createWorkflow',
    'horizon.dashboard.project.queues.basePath',
    'horizon.framework.util.i18n.gettext'
  ];

  /**
   * @ngdoc factory
   * @name horizon.dashboard.project.queues.actions.updateWorkflow
   * @description A workflow for the update queue action.
   */
  function updateWorkflow(createWorkflow, basePath, gettext) {

    var workflow = angular.copy(createWorkflow);
    workflow.title = gettext('Update Queue');
    workflow.btnText = { finish: gettext('Update') };

    return workflow;
  }

})();
