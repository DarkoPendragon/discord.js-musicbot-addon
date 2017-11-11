const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const client = new Discord.Client(); //replace client with what you want your Discord Client to be.
const settings = require('./settings.json'); //Load the token, prefix, and other info from a JSON file.

client.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
});

client.on('message', message => {
  //Code to run with commands, other message events, etc, for your bot.
  if (!message.content.startsWith(settings.prefix)) return;
  let command = message.content.split(' ')[0].slice(settings.prefix.length);
  if (command === 'ping') { //old basic ping command.
    message.channel.send('Pinging...').then(msg => {
      msg.edit(`Response took: \`(${msg.createdTimestamp - message.createdTimestamp}ms)\``);
    });
  };
});

const music = new Music(client, {
  prefix: settings.prefix,       // Prefix for the commands.
  global: true,         // Non-server-specific queues.
  maxQueueSize: 25,     // Maximum queue size of 25.
  clearInvoker: true,   // If permissions applicable, allow the bot to delete the messages that invoke it.
  helpCmd: 'mhelp',     //Sets the name for the help command.
  playCmd: 'music',     //Sets the name for the 'play' command.
  volumeCmd: 'adjust',  //Sets the name for the 'volume' command.
  leaveCmd: 'begone'    //Sets the name for the 'leave' command.
  disableLoop: true
});
client.login(settings.token);
