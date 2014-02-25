#! /bin/bash
echo "*********  Installing required softwares ************";
sudo apt-get update
sudo apt-get install -y mysql-server
sudo mysql -h "localhost" -u "root" --password=rewq12 < db.sql
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs upstart
sudo git clone https://satyashani@bitbucket.org/satyashani/houseman.git
cd houseMan/public_html/homeApp
npm install -g express
npm install
sudo cp houseman.conf /etc/init
sudo start houseman