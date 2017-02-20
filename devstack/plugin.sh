# plugin.sh - DevStack plugin.sh dispatch script zaqar-ui

ZAQAR_UI_DIR=$(cd $(dirname $BASH_SOURCE)/.. && pwd)

function install_zaqar_ui {
    # NOTE(shu-mutou): workaround for devstack bug: 1540328
    # where devstack install 'test-requirements' but should not do it
    # for zaqar-ui project as it installs Horizon from url.
    # Remove following two 'mv' commands when mentioned bug is fixed.
    mv $ZAQAR_UI_DIR/test-requirements.txt $ZAQAR_UI_DIR/_test-requirements.txt

    setup_develop ${ZAQAR_UI_DIR}

    mv $ZAQAR_UI_DIR/_test-requirements.txt $ZAQAR_UI_DIR/test-requirements.txt
}

function configure_zaqar_ui {
    #cp -a ${ZAQAR_UI_DIR}/zaqar_ui/enabled/* ${DEST}/horizon/openstack_dashboard/local/enabled/
    # NOTE: If locale directory does not exist, compilemessages will fail,
    # so check for an existence of locale directory is required.
    if [ -d ${ZAQAR_UI_DIR}/zaqar_ui/locale ]; then
        (cd ${ZAQAR_UI_DIR}/zaqar_ui; DJANGO_SETTINGS_MODULE=openstack_dashboard.settings ../manage.py compilemessages)
    fi
}

# check for service enabled
if is_service_enabled zaqar-ui; then

    if [[ "$1" == "stack" && "$2" == "pre-install"  ]]; then
        # Set up system services
        # no-op
        :

    elif [[ "$1" == "stack" && "$2" == "install"  ]]; then
        # Perform installation of service source
        echo_summary "Installing Zaqar UI"
        install_zaqar_ui

    elif [[ "$1" == "stack" && "$2" == "post-config"  ]]; then
        # Configure after the other layer 1 and 2 services have been configured
        echo_summary "Configuring Zaqar UI"
        configure_zaqar_ui

    elif [[ "$1" == "stack" && "$2" == "extra"  ]]; then
        # no-op
        :
    fi

    if [[ "$1" == "unstack"  ]]; then
        # no-op
        :
    fi

    if [[ "$1" == "clean"  ]]; then
        # Remove state and transient data
        # Remember clean.sh first calls unstack.sh
        # no-op
        :
    fi
fi
