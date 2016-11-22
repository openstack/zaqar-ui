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

import mock

from openstack_dashboard.test import helpers
from zaqarclient.queues.v2 import client as zaqar_client

from zaqar_ui import api
from zaqar_ui.test import test_data


class APITestCase(helpers.APITestCase):
    """Extends the base Horizon APITestCase for zaqarclient"""

    def setUp(self):
        super(APITestCase, self).setUp()
        self._original_magnumclient = api.zaqar.zaqarclient
        api.zaqar.zaqarclient = lambda request: self.stub_zaqarclient()

    def _setup_test_data(self):
        super(APITestCase, self)._setup_test_data()
        test_data.data(self)

    def tearDown(self):
        super(APITestCase, self).tearDown()
        api.zaqar.zaqarclient = self._original_zaqarclient

    def stub_zaqarclient(self):
        if not hasattr(self, "zaqarclient"):
            zaqar_client.Client = mock.Mock()
            self.zaqarclient = zaqar_client.Client
        return self.zaqarclient
