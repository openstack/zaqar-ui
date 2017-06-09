#  Copyright 2015 Catalyst IT Ltd.
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

from __future__ import absolute_import
import logging
import six
from zaqarclient.queues import client as zaqar_client

from horizon import exceptions
from horizon.utils.memoized import memoized
from openstack_dashboard.api import base

LOG = logging.getLogger(__name__)

RESERVED_QUEUE_METADATA = ["_max_messages_post_size", "_default_message_ttl"]


@memoized
def zaqarclient(request):
    zaqar_url = ""
    service_type = 'messaging'
    try:
        zaqar_url = base.url_for(request, service_type)
    except exceptions.ServiceCatalogException:
        LOG.debug('No messaging service is configured.')
        return None

    LOG.debug('zaqarclient connection created using the token "%s" and url'
              '"%s"' % (request.user.token.id, zaqar_url))

    opts = {'os_auth_token': request.user.token.id,
            'os_auth_url': base.url_for(request, 'identity'),
            'os_project_id': request.user.tenant_id,
            'os_service_type': service_type}

    auth_opts = {'backend': 'keystone',
                 'options': opts}

    conf = {'auth_opts': auth_opts}

    return zaqar_client.Client(url=zaqar_url, version=2, conf=conf)


def queue_list(request, limit=None, marker=None):
    return zaqarclient(request).queues(limit=limit, marker=marker)


def queue_create(request, queue_name, metadata):
    # Pop up a modal form, which contains several inputbox:
    # 1. queue_name
    # 2. ttl
    # 3. max message size
    # 4. Metadata
    queue = zaqarclient(request).queue(queue_name, force_create=True)
    queue.metadata(new_meta=metadata)
    return queue


def queue_delete(request, queue_name):
    queue = zaqarclient(request).queue(queue_name, auto_create=False)
    queue.delete()


def queue_update(request, queue_name, metadata):
    # Popup a modal form, the queue name is a realonly label or inputbox.
    # user can change ttl, max message size and metadata

    queue = zaqarclient(request).queue(queue_name, auto_create=False)
    for key in RESERVED_QUEUE_METADATA:
        if (key in metadata and isinstance(metadata[key], six.string_types)):
            metadata[key] = int(metadata[key])

    queue.metadata(new_meta=metadata)
    return queue


def queue_get(request, queue_name):
    return zaqarclient(request).queue(queue_name, auto_create=False)


def queue_purge(request, queue_name, resource_types):
    queue = zaqarclient(request).queue(queue_name, auto_create=False)
    queue.purge(resource_types=resource_types)


def message_post(request, queue_name, messages_data):
    return zaqarclient(request).queue(queue_name).post(messages_data)


def message_list(request, queue_name):
    return zaqarclient(request).queue(queue_name).messages()


def queue_signed_url(request, queue_name, paths, ttl_seconds, methods):
    queue = zaqarclient(request).queue(queue_name, auto_create=False)
    return queue.signed_url(paths=paths, ttl_seconds=ttl_seconds,
                            methods=methods)


def subscription_list(request, queue_name):
    return [{'subscriber': s.subscriber,
             'id': s.id,
             'ttl': s.ttl,
             'age': s.age,
             'confirmed': s.confirmed,
             'options': s.options}
            for s in zaqarclient(request).subscriptions(queue_name)]


def subscription_create(request, queue_name, sub_data):
    subscription = zaqarclient(request).subscription(queue_name, **sub_data)
    return {'subscriber': subscription.subscriber,
            'id': subscription.id,
            'ttl': subscription.ttl,
            'age': subscription.age,
            'confirmed': subscription.confirmed,
            'options': subscription.options}


def subscription_delete(request, queue_name, sub_data):
    subscription = zaqarclient(request).subscription(queue_name, **sub_data)
    subscription.delete()


def subscription_update(request, queue_name, old_data, new_data):
    subscription = zaqarclient(request).subscription(queue_name, **old_data)
    subscription.update(new_data)
    return subscription


def pool_list(request, limit=None, marker=None):
    return zaqarclient(request).pools(limit=limit,
                                      marker=marker,
                                      detailed=True)


def pool_create(request, pool_name, params):
    pool = zaqarclient(request).pool(pool_name, **params)
    return pool


def pool_delete(request, pool_name):
    pool = zaqarclient(request).pool(pool_name, auto_create=False)
    pool.delete()


def pool_update(request, pool_name, params):
    pool = zaqarclient(request).pool(pool_name, auto_create=False)
    pool.update(params)
    return pool


def pool_get(request, pool_name):
    return zaqarclient(request).pool(pool_name, auto_create=False).get()


def flavor_list(request, limit=None, marker=None):
    return zaqarclient(request).flavors(limit=limit,
                                        marker=marker,
                                        detailed=True)


def flavor_create(request, flavor_name, params):
    flavor = zaqarclient(request).flavor(flavor_name, **params)
    return flavor


def flavor_delete(request, flavor_name):
    flavor = zaqarclient(request).flavor(flavor_name, auto_create=False)
    flavor.delete()


def flavor_update(request, flavor_name, params):
    flavor = zaqarclient(request).flavor(flavor_name, auto_create=False)
    flavor.update(params)
    return flavor


def flavor_get(request, flavor_name):
    return zaqarclient(request).flavor(flavor_name, auto_create=False).get()
