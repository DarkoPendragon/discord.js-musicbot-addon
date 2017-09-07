const Discord = require('discord.js');
const music = require('discord.js-musicbot-addon');
const client = new Discord.Client();
const token = 'bot-app-token' //You should load this from a .json file.

client.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
});

music(client);
client.login(token);
