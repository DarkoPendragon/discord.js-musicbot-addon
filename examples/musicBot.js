const Discord = require('discord.js');
const music = require('discord.js-musicbot-addon');
const <client> = new Discord.Client(); //replace <client> with what you want your Discord Client to be.

<client>.on('ready', () => {
    console.log(`[Start] ${new Date()}`);
});

music(<client>, {
	prefix: '-',     // Prefix for the commands.
	global: false,   // Server-specific queues.
	maxQueueSize: 10, // Maximum queue size of 10.
	clearInvoker: true // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix).
});
<client>.login(token);
