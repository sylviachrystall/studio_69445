#!/usr/bin/env bash

_USERNAME="ubuntu"
_HOME_DIR="/home/$_USERNAME"
_VAGRANT_DIR="/vagrant"
_BUILD_DIR="$_VAGRANT_DIR/build"
_DOC_ROOT_DIR="/var/www/html"

# Update before provisioning
sudo apt-get update -y

# Install essentials
sudo apt-get install python-software-properties \
                     build-essential \
                     libssl-dev \
                     libffi-dev \
                     nano \
                     curl \
                     mc \
                     -y

# Update after essentials (especially after python-software-properties)
sudo apt-get update -y

# Update git
sudo add-apt-repository ppa:git-core/ppa -y
sudo apt-get update -y
sudo apt-get install git -y

# Install & configure apache
    # Stop & disable apache
    sudo service apache2 stop

    # update apache
    sudo apt-get update -y
    sudo apt-get install apache2 -y

    # Make apache to start automatically after reboot
    sudo update-rc.d apache2 enable

    # Clear document root and link to the /build directory
    sudo rm -rf "$_DOC_ROOT_DIR"
    sudo ln -s "$_BUILD_DIR" "$_DOC_ROOT_DIR"

    # Restart apache
    sudo service apache2 restart

# Install node & update npm
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo npm install npm --global

# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update -y
sudo apt-get install yarn -y

# Install dependency version updater globally
sudo npm rm npm-check-updates --global
sudo yarn global add npm-check-updates

# Install gulp globally
sudo npm rm gulp gulp-cli --global
sudo yarn global add gulp gulp-cli
