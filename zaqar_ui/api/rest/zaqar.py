#  Copyright 2015 Cisco Systems.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

from django.views import generic

from zaqar_ui.api import zaqar

from openstack_dashboard.api.rest import urls
from openstack_dashboard.api.rest import utils as rest_utils


@urls.register
class Queue(generic.View):
    """API for retrieving a single queue"""
    url_regex = r'zaqar/queue/(?P<queue_name>[^/]+)$'

    @rest_utils.ajax()
    def get(self, request, queue_name):
        """Get a specific queue"""
        return zaqar.queue_get(request, queue_name).to_dict()

    @rest_utils.ajax(data_required=True)
    def post(self, request, queue_name):
        """Update a queue.

        Returns the updated queue object on success.
        """
        queue = zaqar.queue_update(request, queue_name, **request.DATA)
        location = '/api/zaqar/queue/%s' % queue._name
        response = {'name': queue._name,
                    'metadata': queue._metadata}
        return rest_utils.CreatedResponse(location, response)


@urls.register
class Queues(generic.View):
    """API for queues"""
    url_regex = r'zaqar/queues/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Queues for a project.

        The returned result is an object with property 'items' and each
        item under this is a queue.
        """
        result = zaqar.queue_list(request)
        queues = []
        for q in result:
            stats = q.stats['messages']
            queues.append({'name': q.name,
                           'claimed': stats['claimed'],
                           'free': stats['free'],
                           'total': stats['total'],
                           'metadata': q.metadata()})
        return queues

    @rest_utils.ajax(data_required=True)
    def delete(self, request):
        """Delete one or more queue by name.

        Returns HTTP 204 (no content) on successful deletion.
        """
        for queue_name in request.DATA:
            zaqar.queue_delete(request, queue_name)

    @rest_utils.ajax(data_required=True)
    def put(self, request):
        """Create a new queue.

        Returns the new queue object on success.
        """
        new_queue = zaqar.queue_create(request, **request.DATA)
        location = '/api/zaqar/queues/%s' % new_queue.name
        response = {'name': new_queue.name,
                    'claimed': 0,
                    'free': 0,
                    'total': 0,
                    'metadata': new_queue._metadata}
        return rest_utils.CreatedResponse(location, response)
