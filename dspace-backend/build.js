/**
 * @type {import('../src/lxcmanfile.js').LXC}
 */
var LXC;

/**
 * @type {import('../src/lxcmanfile.js').console}
 */
var console;

/**
 * @type {import('../src/lxcmanfile.js').CONTAINER}
 */
var CONTAINER;

var BUILD_CONTAINER = `${CONTAINER}-build`;
var DSPACE_SRC_DIR = "/usr/local/src/dspace";
var DSPACE_DST_DIR = "/var/lib/tomcat9/wabapps/ROOT"

LXC.create(BUILD_CONTAINER, "download", ["--dist=debian", "--release=bullseye", "--arch=amd64"])
    .then(() => LXC.start(BUILD_CONTAINER))
    .then(() => LXC
        .run(BUILD_CONTAINER, `
            #! /bin/bash
            set -e
            sleep 5
            apt-get update
            apt-get -y upgrade
            apt-get install -y git maven ant openjdk-17-jdk
            mkdir -p "${DSPACE_SRC_DIR}"
            git clone --depth 1 --branch dspace-7.4 https://github.com/DSpace/DSpace.git "${DSPACE_SRC_DIR}"
        `)
    )
    .then(() => LXC
        .cp(
            "./local.cfg",
            `${BUILD_CONTAINER}:${DSPACE_SRC_DIR}/dspace/config/local.cfg`
        )
    )
    .then(() => LXC
        .run(BUILD_CONTAINER, `
            #! /bin/bash
            set -e
            mkdir -p ${DSPACE_DST_DIR}
            cd ${DSPACE_SRC_DIR}
            mvn package
            cd ${DSPACE_SRC_DIR}/dspace/target/dspace-installer
            ant fresh_install
        `)
    )
    .then(() => LXC
        .create(
            CONTAINER,
            "download",
            ["--dist=debian", "--release=bullseye", "--arch=amd64"]
        )
    )
    .then(() => LXC
        .config(CONTAINER, "lxc.start.auto", "1")
    )
    .then(() => LXC
        .start(CONTAINER)
    )
    .then(() => LXC
        .run(CONTAINER, `
            #! /bin/bash
            set -e
            apt update
            apt upgrade -y
            apt install -y tomcat9
        `)
    )
    .then(() => LXC
        .cp(
            `${BUILD_CONTAINER}:${DSPACE_DST_DIR}`,
            `${CONTAINER}:${DSPACE_DST_DIR}`,
            true, true
        )
    )
    .then(() => LXC
        .destroy(BUILD_CONTAINER, true, true)
    )
    .then(() => LXC
        .run(CONTAINER, `
            #! /bin/bash
            set -e
            chown -R tomcat:tomcat "${DSPACE_DST_DIR}"
            systemctl enable tomcat9
            systemctl restart tomcat9
            systemctl status tomcat9
        `)
    )
    .then(() => LXC
        .reboot(CONTAINER)
    )
    .catch(() => Promise.all([
        LXC.destroy(BUILD_CONTAINER, true, true).catch(() => { }),
        LXC.destroy(CONTAINER, true, true).catch(() => { }),
    ]));
