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

  /**
   * @ngdoc factory
   * @name horizon.dashboard.admin.pool-flavors.actions.workflow
   * @description
   * Workflow for creating/updating storage pool flavor
   */
  angular
    .module('horizon.dashboard.admin.pool-flavors.actions')
    .factory('horizon.dashboard.admin.pool-flavors.actions.workflow', workflow);

  workflow.$inject = [
    'horizon.framework.util.i18n.gettext'
  ];

  function workflow(gettext) {
    var workflow = {
      init: init
    };

    function init(actionType, title, submitText) {
      var schema, form, model;
      var capabilitiesPlaceholder = gettext(
        'Describes flavor-specific capabilities in YAML format.');

      // schema
      schema = {
        type: 'object',
        properties: {
          name: {
            title: gettext('Name'),
            type: 'string'
          },
          pool_group: {
            title: gettext('Pool Group'),
            type: 'string'
          },
          capabilities: {
            title: gettext('Capabilities'),
            type: 'string'
          }
        }
      };

      // form
      form = [
        {
          type: 'section',
          htmlClass: 'row',
          items: [
            {
              type: 'section',
              htmlClass: 'col-sm-6',
              items: [
                {
                  key: 'name',
                  placeholder: gettext('Name of the flavor.'),
                  required: true,
                  "readonly": actionType === 'update'
                },
                {
                  key: 'pool_group',
                  placeholder: gettext('Pool group for flavor.'),
                  /* eslint-disable max-len */
                  description: gettext('You must specify one of the pool groups that is configured in storage pools.'),
                  required: true
                }
              ]
            },
            {
              type: 'section',
              htmlClass: 'col-sm-6',
              items: [
                {
                  key: 'capabilities',
                  type: 'textarea',
                  placeholder: capabilitiesPlaceholder
                }
              ]
            }
          ]
        }
      ]; // form

      model = {
        name: '',
        pool_group: '',
        capabilities: ''
      };

      var config = {
        title: title,
        submitText: submitText,
        schema: schema,
        form: form,
        model: model
      };

      return config;
    }

    return workflow;
  }
})();
