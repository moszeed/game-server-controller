# -*- mode: ruby -*-
# vi: set ft=ruby :

#original: https://gist.github.com/lmakarov/54302df8ecfc87b36320
$install_docker_compose = <<EOF

    DOCKER_COMPOSE_VERSION=1.17.0

    # Download docker-compose to the permanent storage
    echo 'Downloading docker-compose to the permanent VM storage...'
    sudo mkdir -p /var/lib/boot2docker/bin
    sudo curl -sL https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` -o /var/lib/boot2docker/bin/docker-compose
    sudo chmod +x /var/lib/boot2docker/bin/docker-compose
    sudo ln -sf /var/lib/boot2docker/bin/docker-compose /usr/local/bin/docker-compose

    # Making the symlink persistent via bootlocal.sh
    echo 'Writing to bootlocal.sh to make docker-compose available on every boot...'
    cat <<SCRIPT | sudo tee -a /var/lib/boot2docker/bootlocal.sh > /dev/null
        # docker-compose
        sudo ln -sf /var/lib/boot2docker/bin/docker-compose /usr/local/bin/docker-compose
    SCRIPT

    sudo chmod +x /var/lib/boot2docker/bootlocal.sh

    echo "wait 10 seconds, to let docker-compose boot up ....... "
    sleep 10
EOF

$configure_project = <<EOF

    echo "----------- configure project -----------"

    #set hostname, same as host os
    #sudo sethostname #{`hostname`[0..-2]}-vm
    sudo sethostname schiessbude

    echo "wait 10 seconds, to let docker boot up ....... "
    sleep 10
EOF

$build_project = <<EOF

    echo "Build Project";

    export HOSTNAME_VALUE=`hostname`

    cd /game-server-controller/
    # docker-compose build --no-cache
EOF

$run_docker_compose = <<EOF

    echo "----------- run project -----------"

    export HOSTNAME_VALUE=`hostname`

    # show used docker & nodejs version
    echo "\n"
    echo "------------------------------------------"
    docker --version
    echo "------------------------------------------"
    echo "Node.js version"
    docker run gameservercontroller_dev node -v
    echo "------------------------------------------"
    echo "NPM version"
    docker run gameservercontroller_dev npm -v
    echo "------------------------------------------"
    echo "NPM outdated (global)"
    docker run gameservercontroller_dev npm outdated -g
    echo "------------------------------------------"
    echo "NPM outdated (project)"
    docker run gameservercontroller_dev npm outdated
    echo "------------------------------------------"
    echo "\n"

    # remove all untagged/dangling/none images
    DOCKER_DANGLING_IMAGES=$(docker images -q -f dangling=true)
    if [ -n "$DOCKER_DANGLING_IMAGES" ]; then
        docker rmi -f $DOCKER_DANGLING_IMAGES
    fi

    cd /game-server-controller/
    docker-compose up -d
EOF

#
# vagrant configuration
#
Vagrant.configure(2) do |config|

    config.vm.box = "moszeed/boot2docker"

    #config for app
    config.vm.define :gameservercontroller do |gameservercontroller|

        #network
        gameservercontroller.vm.network "public_network", type: "dhcp"
        gameservercontroller.vm.network "forwarded_port", guest: 8686, host: 8686, auto_correct: true

        #shared folders
        gameservercontroller.vm.synced_folder ".", "/game-server-controller/"
        gameservercontroller.vm.synced_folder ".", "/vagrant", disabled: true

        #scripts
        gameservercontroller.vm.provision :shell, :inline => $configure_project, :privileged => false, run: "always"
        gameservercontroller.vm.provision :shell, :inline => $install_docker_compose, :privileged => false
        gameservercontroller.vm.provision :shell, :inline => $build_project, :privileged => false
        gameservercontroller.vm.provision :shell, :inline => $run_docker_compose, :privileged => false, run: "always"
    end

    #set name for vm
    config.vm.provider "virtualbox" do |v|
        v.name = "gameservercontroller"
        v.customize [
            "modifyvm", 
            :id, 
            "--memory", "1024",
            # all for Quake3
            "--natpf1", "udp27960,udp,,27960,,27960",
            "--natpf1", "tcp27960,tcp,,27960,,27960",
            "--natpf1", "udp27965,udp,,27965,,27965",
            "--natpf1", "tcp27965,tcp,,27965,,27965",
            "--natpf1", "udp27952,udp,,27952,,27952",
            "--natpf1", "tcp27952,tcp,,27952,,27952",
            "--natpf1", "udp27950,udp,,27950,,27950",
            "--natpf1", "tcp27950,tcp,,27950,,27950",

            # all for call of duty
            "--natpf1", "tcp28969,tcp,,28969,,28969", 
            "--natpf1", "udp28969,udp,,28969,,28969",
            "--natpf1", "tcp20800,tcp,,20800,,20800",
            "--natpf1", "udp20800,udp,,20800,,20800",
            "--natpf1", "tcp20810,tcp,,20810,,20810",
            "--natpf1", "udp20810,udp,,20810,,20810",

            # all for steam
            "--natpf1", "tcp27015,tcp,,27015,,27015",
            "--natpf1", "udp27015,udp,,27015,,27015"
        ]
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        v.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
        v.customize ["sharedfolder", "add", :id, "--name", "www", "--hostpath", (("//?/" + File.dirname(__FILE__) + "/www").gsub("/","\\"))]
        v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
    end

end
