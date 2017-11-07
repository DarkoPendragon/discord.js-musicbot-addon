const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const client = new Discord.Client();
const token = 'bot-app-token' //You should load this from a .json file.

client.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
});

const music = new Music(client, {
  youtubeKey: "some-key_here"
});
client.login(token);
