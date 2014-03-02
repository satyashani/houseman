#! /bin/bash
echo "*********  Installing required softwares ************";
sudo apt-get update
sudo apt-get install -y mysql-server git
sudo git clone https://satyashani:rewq12@bitbucket.org/satyashani/houseman.git
cd houseman/public_html/homeApp
sudo mysql -h "localhost" -u "root" --password=rewq12 < db.sql
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs
sudo npm install -g express
sudo npm install