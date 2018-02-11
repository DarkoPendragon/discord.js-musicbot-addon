const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
});

const music = new Music(client, {
  youtubeKey: "some-key_here"
});

client.login("discord_AppToKEn");
