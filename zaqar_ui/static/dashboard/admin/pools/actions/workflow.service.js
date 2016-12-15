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
   * @name horizon.dashboard.admin.pools.actions.workflow
   * @description
   * Workflow for creating/updating storage pool
   */
  angular
    .module('horizon.dashboard.admin.pools.actions')
    .factory('horizon.dashboard.admin.pools.actions.workflow', workflow);

  workflow.$inject = [
    'horizon.framework.util.i18n.gettext'
  ];

  function workflow(gettext) {
    var workflow = {
      init: init
    };

    function init(actionType, title, submitText) {
      var schema, form, model;
      var optionsPlaceholder = gettext(
        'An optional request component related to storage-specific options in YAML format.');

      // schema
      schema = {
        type: 'object',
        properties: {
          name: {
            title: gettext('Name'),
            type: 'string'
          },
          group: {
            title: gettext('Group'),
            type: 'string'
          },
          weight: {
            title: gettext('Weight'),
            type: 'number'
          },
          uri: {
            title: gettext('URI'),
            type: 'string'
          },
          options: {
            title: gettext('Options'),
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
                  placeholder: gettext('Name of the pool.'),
                  required: true,
                  "readonly": actionType === 'update'
                },
                {
                  key: 'weight',
                  placeholder: gettext('Weight of the pool.'),
                  required: true
                },
                {
                  key: 'uri',
                  placeholder: gettext('URI for storage engine of this pool.'),
                  description: gettext('e.g. mongodb://127.0.0.1:27017'),
                  required: true
                }
              ]
            },
            {
              type: 'section',
              htmlClass: 'col-sm-6',
              items: [
                {
                  key: 'group',
                  placeholder: gettext('Group of the pool.')
                },
                {
                  key: 'options',
                  type: 'textarea',
                  placeholder: optionsPlaceholder
                }
              ]
            }
          ]
        }
      ]; // form

      model = {
        name: '',
        group: '',
        weight: 0,
        uri: '',
        options: ''
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
