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

import json
import six
import yaml

from django.views import generic
from openstack_dashboard.api.rest import urls
from openstack_dashboard.api.rest import utils as rest_utils
from zaqar_ui.api import zaqar


def _convert_to_yaml(data, default_flow_style=False):
    if not data:
        return ''
    try:
        return yaml.safe_dump(data, default_flow_style=default_flow_style)
    except Exception:
        return ''


def _load_yaml(data):
    if not data:
        loaded_data = {}
    else:
        try:
            loaded_data = yaml.load(data)
        except Exception as ex:
            raise Exception(_('The specified input is not a valid '
                              'YAML format: %s') % six.text_type(ex))
    return loaded_data


@urls.register
class Queue(generic.View):
    """API for retrieving a single queue"""
    url_regex = r'zaqar/queues/(?P<queue_name>[^/]+)$'

    @rest_utils.ajax()
    def get(self, request, queue_name):
        """Get a specific queue"""
        queue = zaqar.queue_get(request, queue_name)
        stats = queue.stats['messages']
        queue_info = {'name': queue_name,
                      'claimed': stats['claimed'],
                      'free': stats['free'],
                      'total': stats['total'],
                      'metadata': queue.metadata()}
        return queue_info

    @rest_utils.ajax(data_required=True)
    def post(self, request, queue_name):
        """Update a queue.

        Returns the updated queue object on success.
        """
        queue = zaqar.queue_update(request, queue_name, **request.DATA)
        location = '/api/zaqars/queue/%s' % queue._name
        response = {'name': queue._name,
                    'metadata': queue._metadata}
        return rest_utils.CreatedResponse(location, response)


@urls.register
class QueueActions(generic.View):
    """API for actions on a single queue"""
    url_regex = r'zaqar/queues/(?P<queue_name>[^/]+)/(?P<action>[^/]+)$'

    @rest_utils.ajax(data_required=True)
    def post(self, request, queue_name, action):
        """Actions for a queue"""
        if action == "purge":
            resource_types = request.DATA.get("resource_types")
            zaqar.queue_purge(request, queue_name, resource_types)
        elif action == "share":
            paths = request.DATA.get("paths")
            ttl_seconds = request.DATA.get("ttl_seconds")
            methods = request.DATA.get("methods")
            return zaqar.queue_signed_url(request, queue_name, paths,
                                          ttl_seconds, methods)


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


@urls.register
class Subscriptions(generic.View):
    """API for Subscriptions"""
    url_regex = r'zaqar/queues/(?P<queue_name>[^/]+)/subscriptions/$'

    @rest_utils.ajax()
    def get(self, request, queue_name):
        """Get a list of the Subscriptions for a queue."""
        return zaqar.subscription_list(request, queue_name)

    @rest_utils.ajax(data_required=True)
    def delete(self, request, queue_name):
        """Delete one or more queue by name.

        Returns HTTP 204 (no content) on successful deletion.
        """
        zaqar.subscription_delete(request, queue_name, request.DATA)

    @rest_utils.ajax(data_required=True)
    def put(self, request, queue_name):
        """Create a new subscription.

        Returns the new queue object on success.
        """
        return zaqar.subscription_create(request, queue_name, request.DATA)


@urls.register
class Messages(generic.View):
    """API for messages"""
    url_regex = r'zaqar/queues/(?P<queue_name>[^/]+)/messages/$'

    @rest_utils.ajax()
    def get(self, request, queue_name):
        """Get a list of messages"""
        result = zaqar.message_list(request, queue_name)
        messages = []
        for m in result:
            claim_id = None
            if m.claim_id:
                claim_id = m.claim_id()
            messages.append({'age': m.age,
                             'body': m.body,
                             'claim_id': claim_id,
                             'id': m.id,
                             'href': m.href,
                             'ttl': m.ttl})
        return messages

    @rest_utils.ajax(data_required=True)
    def post(self, request, queue_name):
        """Create new messages"""
        messages = json.loads(request.DATA.get("messages"))
        return zaqar.message_post(request, queue_name, messages)


@urls.register
class Subscription(generic.View):
    """API for retrieving a single subscription"""
    url_regex = r'zaqar/queues/(?P<queue_name>[^/]+)/' \
                r'subscription/(?P<subscriber>[^/]+)/$'

    @rest_utils.ajax(data_required=True)
    def post(self, request, queue_name, subscriber):
        zaqar.subscription_update(request, queue_name,
                                  {'id': subscriber}, request.DATA)


@urls.register
class Pool(generic.View):
    """API for retrieving a single pool"""
    url_regex = r'zaqar/pools/(?P<pool_name>[^/]+)$'

    @rest_utils.ajax()
    def get(self, request, pool_name):
        """Get a specific pool"""
        pool = zaqar.pool_get(request, pool_name)
        pool['id'] = pool.get('name')
        pool['options'] = _convert_to_yaml(pool.get('options'))
        return pool

    @rest_utils.ajax(data_required=True)
    def post(self, request, pool_name):
        """Update a pool.

        Returns the updated pool object on success.
        """
        request.DATA["options"] = _load_yaml(request.DATA.get("options"))
        params = request.DATA
        pool_name = params.pop('name')
        new_pool = zaqar.pool_update(request, pool_name, params)
        location = '/api/zaqar/pools/%s' % new_pool.name
        response = {'name': new_pool.name,
                    'uri': new_pool.uri,
                    'weight': new_pool.weight,
                    'group': new_pool.group,
                    'options': new_pool.options}
        return rest_utils.CreatedResponse(location, response)


@urls.register
class Pools(generic.View):
    """API for pools"""
    url_regex = r'zaqar/pools/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Pools for admin.

        The returned result is an object with property 'items' and each
        item under this is a pool.
        """
        result = zaqar.pool_list(request)
        pools = []
        for p in result:
            options = _convert_to_yaml(p.options)
            pools.append({'id': p.name,
                          'name': p.name,
                          'uri': p.uri,
                          'weight': p.weight,
                          'group': p.group,
                          'options': options})
        return {'items': pools}

    @rest_utils.ajax(data_required=True)
    def delete(self, request):
        """Delete one or more pool by name.

        Returns HTTP 204 (no content) on successful deletion.
        """
        for pool_name in request.DATA:
            zaqar.pool_delete(request, pool_name)

    @rest_utils.ajax(data_required=True)
    def put(self, request):
        """Create a new pool.

        Returns the new pool object on success.
        """
        request.DATA['options'] = _load_yaml(request.DATA.get('options'))
        params = request.DATA
        pool_name = params.pop('name')
        new_pool = zaqar.pool_create(request, pool_name, params)
        location = '/api/zaqar/pools/%s' % new_pool.name
        response = {'name': new_pool.name,
                    'uri': new_pool.uri,
                    'weight': new_pool.weight,
                    'group': new_pool.group,
                    'options': new_pool.options}
        return rest_utils.CreatedResponse(location, response)


@urls.register
class Flavor(generic.View):
    """API for retrieving a single flavor"""
    url_regex = r'zaqar/flavors/(?P<flavor_name>[^/]+)$'

    @rest_utils.ajax()
    def get(self, request, flavor_name):
        """Get a specific flavor"""
        flavor = zaqar.flavor_get(request, flavor_name)
        flavor['id'] = flavor.get('name')
        flavor['capabilities'] = _convert_to_yaml(flavor.get('capabilities'))
        return flavor

    @rest_utils.ajax(data_required=True)
    def post(self, request, flavor_name):
        """Update a flavor.

        Returns the updated flavor object on success.
        """
        capabilities = request.DATA.get('capabilities')
        request.DATA['capabilities'] = _load_yaml(capabilities)
        params = request.DATA
        flavor_name = params.pop('name')
        new_flavor = zaqar.flavor_update(request, flavor_name, params)
        location = '/api/zaqar/flavors/%s' % new_flavor.name
        response = {'name': new_flavor.name,
                    'pool_group': new_flavor.pool_group,
                    'capabilities': new_flavor.capabilities}
        return rest_utils.CreatedResponse(location, response)


@urls.register
class Flavors(generic.View):
    """API for flavors"""
    url_regex = r'zaqar/flavors/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Flavors for admin.

        The returned result is an object with property 'items' and each
        item under this is a flavor.
        """
        result = zaqar.flavor_list(request)
        flavors = []
        for f in result:
            capabilities = _convert_to_yaml(f.capabilities)
            flavors.append({'id': f.name,
                            'name': f.name,
                            'pool_group': f.pool_group,
                            'capabilities': capabilities})
        return {'items': flavors}

    @rest_utils.ajax(data_required=True)
    def delete(self, request):
        """Delete one or more flavor by name.

        Returns HTTP 204 (no content) on successful deletion.
        """
        for flavor_name in request.DATA:
            zaqar.flavor_delete(request, flavor_name)

    @rest_utils.ajax(data_required=True)
    def put(self, request):
        """Create a new flavor.

        Returns the new flavor object on success.
        """
        capabilities = request.DATA.get('capabilities')
        request.DATA['capabilities'] = _load_yaml(capabilities)
        params = request.DATA
        flavor_name = params.pop('name')
        new_flavor = zaqar.flavor_create(request, flavor_name, params)
        location = '/api/zaqar/flavors/%s' % new_flavor.name
        response = {'name': new_flavor.name,
                    'pool_group': new_flavor.pool_group,
                    'capabilities': new_flavor.capabilities}
        return rest_utils.CreatedResponse(location, response)
