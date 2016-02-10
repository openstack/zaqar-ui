# Copyright 2015 IBM Corp.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

PANEL = 'queues'
PANEL_GROUP = 'messaging'
PANEL_DASHBOARD = 'project'

ADD_PANEL = ('zaqar_ui.content.queues.panel.Queues')

# ADD_INSTALLED_APPS enables using html templates from within the plugin
ADD_INSTALLED_APPS = ['zaqar_ui']

ADD_ANGULAR_MODULES = [
    'horizon.dashboard.project.queues'
]

ADD_JS_FILES = [
    'app/core/openstack-service-api/zaqar.service.js',
    'dashboard/project/queues/queues.module.js',
    'dashboard/project/queues/actions/create.action.service.js',
    'dashboard/project/queues/actions/create.workflow.service.js',
    'dashboard/project/queues/steps/queue-details/queue-details.controller.js',
    'dashboard/project/queues/steps/queue-metadata/'
    'queue-metadata.controller.js',
    'dashboard/project/queues/table/batch-actions.service.js',
    'dashboard/project/queues/table/table.controller.js',
]

ADD_JS_SPEC_FILES = [
    'dashboard/project/queues/queues.module.spec.js',
    'dashboard/project/queues/table/table.controller.spec.js',
]

ADD_SCSS_FILES = [
    'dashboard/project/queues/queues.scss'
]

# AUTO_DISCOVER_STATIC_FILES = True
