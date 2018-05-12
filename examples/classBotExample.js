// For v11 and above only.

const Discord = require('discord.js');

class Bot extends Discord.Client {
  constructor(options) {
    super(options);
    this.music = require('discord.js-musicbot-addon');
    this.config = require('./settings.json');
  }
}

const client = new Bot();

client.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
});

Music.start(client, {
  youtubeKey: "some-key_here"
});

client.login(client.settigs.token);
