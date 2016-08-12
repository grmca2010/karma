#!/bin/bash
sudo apt-get -y update
sudo apt-get -y install nodejs
sudo apt-get -y install nodejs-legacy

sudo apt-get -y install npm

cd /vagrant && sudo npm install

export PATH=/vagrant/node_modules/:$PATH
