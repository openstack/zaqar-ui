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
      'horizon.dashboard.project.queues.actions.listMessageService', listMessageService);

  listMessageService.$inject = [
    '$q',
    'horizon.dashboard.project.queues.basePath',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService'
  ];

  /**
   * @ngdoc factory
   * @name horizon.dashboard.project.queues.actions.listMessageService
   * @param {Object} $q
   * @param {String} basePath
   * @param {Object} gettext
   * @param {Object} $qExtensions
   * @param {Object} modal
   * @returns {Object} list messages service
   * @description Brings up the polling messages modal dialog.
   * On submit, poll messages from given queues.
   * On cancel, do nothing.
   */
  function listMessageService(
    $q, basePath, gettext, $qExtensions, modal
  ) {
    // schema
    var schema = {
      type: "object",
      properties: {
        listMessages: {
          title: gettext("List Messages"),
          type: "string"
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
                type: 'template',
                templateUrl: basePath + 'actions/list-message.html'
              }
            ]
          }
        ]
      }
    ];

    // model
    var model;

    var service = {
      initAction: initAction,
      perform: perform,
      allowed: allowed
    };

    // modal config
    var config = {
      "title": gettext('List Messages'),
      "submitText": gettext('List Messages'),
      "schema": schema,
      "form": form,
      "model": model
    };

    return service;

    //////////////

    function initAction() {
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function perform(selected) {
      config.model = {
        id: selected.id,
        name: selected.name
      };
      return modal.open(config).then(submit);
    }

    function submit(context) {
      var id = context.model.id;
      var name = context.model.name;
      config.model = {
        id: id,
        name: name
      };
      // display new dialog
      modal.open(config).then(submit);
    }
  }
})();
