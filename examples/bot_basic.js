const Discord = require('discord.js'); // Require the Discord.js library.

class Bot extends Discord.Client {
  constructor(options) {
    super(options);
    this.music = require("discord.js-musicbot-addon");
  }
}
const client = new Bot();

client.music.start({
  youtubeKey: "YouTubeAPIKeyHere" // Set the api key used for YouTube.
});

client.login("token"); // Connect the bot.
