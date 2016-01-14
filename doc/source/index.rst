===============================
zaqar-ui
===============================

Zaqar Dashboard

* Free software: Apache license
* Source: http://git.openstack.org/cgit/openstack/zaqar-ui
* Bugs: http://bugs.launchpad.net/zaqar-ui

Installation instructions
=========================

Begin by cloning the Horizon and Zaqar UI repositories::

    git clone https://github.com/openstack/horizon
    git clone https://github.com/openstack/zaqar-ui

Create a virtual environment and install Horizon dependencies::

    cd horizon
    python tools/install_venv.py

Set up your ``local_settings.py`` file::

    cp openstack_dashboard/local/local_settings.py.example openstack_dashboard/local/local_settings.py

Open up the copied ``local_settings.py`` file in your preferred text
editor. You will want to customize several settings:

-  ``OPENSTACK_HOST`` should be configured with the hostname of your
   OpenStack server. Verify that the ``OPENSTACK_KEYSTONE_URL`` and
   ``OPENSTACK_KEYSTONE_DEFAULT_ROLE`` settings are correct for your
   environment. (They should be correct unless you modified your
   OpenStack server to change them.)


Install Zaqar UI with all dependencies in your virtual environment::

    tools/with_venv.sh pip install -e ../zaqar-ui/

And enable it in Horizon::

    cp ../zaqar-ui/enabled/_1510_messaging_panel_group.py openstack_dashboard/local/enabled
    cp ../zaqar-ui/enabled/_1520_zaqar_project_queues.py openstack_dashboard/local/enabled

Release Notes
=============

.. toctree::
  :glob:
  :maxdepth: 1

  releases/*

Source Code Reference
=====================

.. toctree::
  :glob:
  :maxdepth: 1

  sourcecode/autoindex


