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
    .controller('horizon.dashboard.project.queues.steps.QueueMetadataController', controller);

  controller.$inject = [
    '$q',
    '$scope',
    'horizon.app.core.metadata.service',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.project.queues.events',
    'horizon.framework.widgets.metadata.tree.service'
  ];

  /**
   * @ngdoc controller
   * @name horizon.dashboard.project.queues.steps.QueueDetailsController
   * @param {Object} $q
   * @param {Object} $scope
   * @param {Object} metadata
   * @param {Object} zaqar
   * @param {Object} events
   * @param {Object} metaTree
   * @returns {undefined} Returns nothing
   * @description This controller is use for creating a queue.
   */
  function controller($q, $scope, metadata, zaqar, events, metaTree) {

    var ctrl = this;
    var queue = $scope.queue ? $scope.queue : {};

    ctrl.tree = new metaTree.Tree([], []);

    /* eslint-enable angular/ng_controller_as */
    $scope.$watchCollection(getTree, onMetadataChanged);
    /* eslint-enable angular/ng_controller_as */

    init();

    ////////////////////////////////

    function init() {
      $q.all({
        available: standardDefinitions(queue),
        existing: getExistingMetdataPromise(queue)
      })
      .then(onMetadataGet);
    }

    function onMetadataGet(response) {
      ctrl.tree = new metaTree.Tree(
        response.available.data.items,
        response.existing.data
      );
    }

    function getTree() {
      return ctrl.tree.getExisting();
    }

    function standardDefinitions(queue) {

      // TODO: currently, there is no standard metadefinitions
      // should add some reserved/fixed definition here
      // preferably it should come from zaqar and not hardcoded here
      // however available metadata is needed for showing to be updated,
      // so now we set existing metadata to available metadata.
      if (angular.isDefined(queue.id)) {
        return {data: queue.metadata};
      } else {
        var deferred = $q.defer();
        deferred.resolve({data: {}});
        return deferred.promise;
      }
    }

    function getExistingMetdataPromise(queue) {

      if (angular.isDefined(queue.id)) {
        $scope.stepModels.queueMetadataForm = queue.metadata;
        return {data: queue.metadata};
      } else {
        var deferred = $q.defer();
        deferred.resolve({data: {}});
        $scope.stepModels.queueMetadataForm = {};
        return deferred.promise;
      }
    }

    function onMetadataChanged(newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.stepModels.queueMetadataForm = newValue;
      }
    }

  } // end of controller

})();
