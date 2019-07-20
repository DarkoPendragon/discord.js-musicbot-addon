#!/bin/bash
sudo zypper install nodejs10 nodejs10-devl nodejs-common
sudo zypper install ffmpeg 
npm uninstall discord.js node-opus opusscript discord.js-musicbot-addon
npm install discord.js
npm install opusscript
npm install discord.js-musicbot-addon
echo "Done"
