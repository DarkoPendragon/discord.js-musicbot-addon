const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const client = new Discord.Client(); //replace client with what you want your Discord Client to be.
const token = 'bot-app-token' //You should load this from a .json file or something, just saying.
const prefix = '!'; //You could also load this from a .json file as well.

/*
 * Here would be some example code or loading in a .json file.
 * (see the settings.json example file)
 *
 * const settings = require('./settins.json');
 * const prefix = settings.prefix;
 * client.login(settings.token);
 */

client.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
});

client.on('message', message => {
  //Code to run with commands, other message events, etc, for your bot.
  //Along with the music bot.
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  if (command === 'ping') { //old basic ping command.
    message.channel.send('Pinging...').then(msg => {
      msg.edit(`Response took: \`(${msg.createdTimestamp - message.createdTimestamp}ms)\``);
    });
  };
});

const music = new Music(client, {
  prefix: prefix,       // Prefix for the commands.
  global: true,         // Non-server-specific queues.
  maxQueueSize: 25,     // Maximum queue size of 25.
  clearInvoker: true,   // If permissions applicable, allow the bot to delete the messages that invoke it.
  helpCmd: 'mhelp',     //Sets the name for the help command.
  playCmd: 'music',     //Sets the name for the 'play' command.
  volumeCmd: 'adjust',  //Sets the name for the 'volume' command.
  leaveCmd: 'begone'    //Sets the name for the 'leave' command.
});
client.login(token);
