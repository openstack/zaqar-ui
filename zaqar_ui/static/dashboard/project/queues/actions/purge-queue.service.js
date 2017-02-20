/**
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use self file except in compliance with the License. You may obtain
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
    .factory(
      'horizon.dashboard.project.queues.actions.purgeQueueService', purgeQueueService);

  purgeQueueService.$inject = [
    '$q',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.project.queues.events',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngdoc factory
   * @name horizon.dashboard.project.queues.actions.purgeQueueService
   * @param {Object} $q
   * @param {Object} policy
   * @param {Object} zaqar
   * @param {Object} events
   * @param {Object} gettext
   * @param {Object} $qExtensions
   * @param {Object} modal
   * @param {Object} toast
   * @returns {Object} purge queue service
   * @description Brings up the purge queues choices modal dialog.
   * On submit, purge given queues.
   * On cancel, do nothing.
   */
  function purgeQueueService(
    $q, policy, zaqar, events, gettext, $qExtensions, modal, toast
  ) {
    // schema
    var schema = {
      type: "object",
      properties: {
        resource_types: {
          title: gettext("Choose resource to purge"),
          type: "string",
          enum: ["messages", "subscriptions", "all"]
        }
      }
    };

    // form
    var form = [
      {
        type: 'section',
        htmlClass: 'row',
        items: [
          {
            type: 'section',
            htmlClass: 'col-sm-12',
            items: [
              {
                key: 'resource_types',
                type: 'radiobuttons',
                titleMap: [
                  {value: 'messages', name: gettext('Messages')},
                  {value: 'subscriptions', name: gettext('Subscriptions')},
                  {value: "all", name: "All"}
                ],
                required:true
              }
            ]
          }
        ]
      }
    ];

    var scope, model;

    var message = {
      success: gettext('Queue %s has been purged successfully.')
    };

    var service = {
      initAction: initAction,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function initAction() {
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function perform(selected, $scope) {
      scope = $scope;

      model = {
        id: selected.id,
        name: selected.name,
        resource_types: []
      };
      // modal config
      var config = {
        "title": gettext('Purge Queue'),
        "submitText": gettext('Purge'),
        "schema": schema,
        "form": form,
        "model": model
      };
      return modal.open(config).then(submit);
    }

    function submit(context) {
      var id = context.model.id;
      var name = context.model.name;
      delete context.model.id;
      delete context.model.name;
      context.model.resource_types = (context.model.resource_types === "all")
                                     ? [] : [context.model.resource_types];

      return zaqar.purgeQueue(id, context.model).then(function() {
        toast.add('success', interpolate(message.success, [name]));
        scope.$emit(events.PURGE_SUCCESS, name);
      });
    }
  }
})();
