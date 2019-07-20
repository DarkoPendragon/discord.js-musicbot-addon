#!/bin/bash
sudo apt-get install curl software-properties-common
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
sudo apt-get install nodejs ffmpeg -y
npm uninstall discord.js node-opus opusscript discord.js-musicbot-addon
npm install discord.js
npm install opusscript
npm install discord.js-musicbot-addon
echo "Done"
