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

  /**
   * @ngdoc factory
   * @name horizon.dashboard.project.queues.signed-url.service
   * @description
   * Service for the signed url for the queue
   */
  angular
    .module('horizon.dashboard.project.queues')
    .factory(
      'horizon.dashboard.project.queues.actions.signedUrlService',
      signedUrlService);

  signedUrlService.$inject = [
    'horizon.app.core.openstack-service-api.policy',
    'horizon.app.core.openstack-service-api.zaqar',
    'horizon.dashboard.project.queues.basePath',
    'horizon.dashboard.project.queues.events',
    'horizon.dashboard.project.queues.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.framework.widgets.toast.service'
  ];

  function signedUrlService(
    policy, zaqar, basePath, events, resourceType, actionResult, gettext,
    $qExtensions, modal, waitSpinner, toast
  ) {
    // schema
    var schema = {
      type: "object",
      properties: {
        name: {
        },
        paths: {
        },
        ttl_seconds: {
          type: "number",
          minimum: 1
        },
        methods: {
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
            type: "section",
            htmlClass: "col-sm-12",
            items: [
              { // for result message
                type: "help",
                helpvalue: "",
                condition: true
              },
              {
                key: "paths",
                type: "checkboxes",
                title: gettext("Paths"),
                titleMap: [
                  {value: "messages", name: gettext("Messages")},
                  {value: "subscriptions", name: gettext("Subscriptions")},
                  {value: "claims", name: gettext("Claims")}
                ],
                htmlClass: "horizontal-checkboxes"
              },
              {
                key: "ttl_seconds",
                title: gettext("TTL Seconds")
              },
              {
                key: "methods",
                title: gettext("Methods"),
                type: "checkboxes",
                titleMap: [
                  {value: "GET", name: gettext("GET")},
                  {value: "HEAD", name: gettext("HEAD")},
                  {value: "OPTIONS", name: gettext("OPTIONS")},
                  {value: "POST", name: gettext("POST")},
                  {value: "PUT", name: gettext("PUT")},
                  {value: "DELETE", name: gettext("DELETE")}
                ],
                htmlClass: "horizontal-checkboxes"
              }
            ]
          }
        ]
      }
    ];

    // model
    var model = {
      id: '',
      name: '',
      paths: '',
      ttl_seconds: '',
      methods: ''
    };

    // modal config
    var config = {
      title: gettext("Signed URL for %s"),
      schema: schema,
      form: angular.copy(form),
      model: model
    };

    var message = {
      success: gettext("Signed URL was successfully created for the queue %s with expires %s " +
                       "and signature %s.")
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
      return policy.ifAllowed({ rules: [['queue', 'signed_url']] });
    }

    function perform(selected) {
      config.model.id = selected.name;
      config.model.name = selected.name;
      config.model.paths = '';
      config.form = angular.copy(form);
      config.title = interpolate(config.title, [selected.name]);
      modal.open(config).then(submit);
    }

    function submit(context) {
      var name = context.model.name;
      delete context.model.id;
      delete context.model.name;
      delete context.model.output;
      if (!context.model.ttl_seconds) {
        delete context.model.ttl_seconds;
      }
      waitSpinner.showModalSpinner(gettext('Creating Signed URL'));
      return zaqar.signedUrl(name, context.model).then(function(response) {
        config.model = {
          paths: context.model.paths,
          ttl_seconds: context.model.ttl_seconds,
          methods: context.model.methods
        };
        config.form = angular.copy(form);

        // for result message
        config.form[0].items[0].items[0].helpvalue = "<div class='alert alert-success'>" +
          interpolate(message.success,
                      [name, response.data.expires, response.data.signature]
          ) + "</div>";
        config.form[0].items[0].items[0].condition = false;

        // display new dialog
        waitSpinner.hideModalSpinner();
        modal.open(config).then(submit);

        var result = actionResult.getActionResult().updated(resourceType, name);
        return result.results;
      }, function(response) {
        // close spinner and display toast
        waitSpinner.hideModalSpinner();
        toast.add('error', response.data.split("(")[0].trim() + ".");
        var result = actionResult.getActionResult().failed(resourceType, name);
        return result.results;
      });
    }
  }
})();
