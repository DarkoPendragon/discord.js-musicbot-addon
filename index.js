/**
 * Original code nexu-dev, https://github.com/nexu-dev/discord.js-client
 * Tweaked by Demise.
 * Other contributors: Rodabaugh, mcao.
 */

const stream = require('youtube-audio-stream');
const search = require('youtube-search');
const ypi = require('youtube-playlist-info');
const Discord = require('discord.js');

 /**
  * Takes a discord.js client and turns it into a client bot.
  * Thanks to Rodabaugh for helping with some tweaks and ideas.
  *
  * @param {Client} client - The discord.js client.
  * @param {object} options - Options to configure the client bot. Acceptable options are:
	* 	youtubeKey: *Required*, string, a YouTube API3 key.
	* 	botPrefix: String, the prefix of the bot. Defaults to "!".
	* 	global: Boolean, whether to use one global queue or server specific ones. Defaults false.
	* 	maxQueueSize: Number, max queue size allowed. Defaults 20.
	* 	defVolume: Number, the default volume of music. 1 - 200, defaults 50.
	* 	anyoneCanSkip: Boolean, whether or not anyone can skip. Defaults false.
	* 	clearInvoker: Boolean, whether to delete command messages. Defaults false.
	* 	helpCmd: String, name of the help command.
	* 	disableHelp: Boolean, disable the help command.
	* 	playCmd: String, name of the play command.
	* 	disablePlay: Boolean, disable the play command.
	* 	skipCmd: String, name of the skip command.
	* 	disableSkip: Boolean, disable the skip command.
	* 	queueCmd: String, name of the queue command.
	* 	disableQueue: Boolean, disable the queue command.
	* 	pauseCmd: String, name of the pause command.
	* 	disablePause: Boolean, disable the pause command.
	* 	resumeCmd: String, name of the resume command.
	* 	disableResume: Boolean, disable the resume command.
	* 	volumeCmd: String, name of the volume command.
	* 	disableVolume: Boolean, disable the volume command.
	* 	leaveCmd: String, name of the leave command.
	* 	disableLeave: Boolean, disable the leave command.
	* 	clearCmd: String, name of the clear command.
	* 	disableClear: Boolean, disable the clear command.
	* 	loopCmd: String, name of the loop command.
	* 	disableLoop: Boolean, disable the loop command.
	* 	enableQueueStat: Boolean, whether to enable the queue status, old fix for an error that probably won't occur.
	* 	anyoneCanAdjust: Boolean, whether anyone can adjust volume. Defaults false.
	* 	ownerOverMember: Boolean, whether the owner over-rides CanAdjust and CanSkip. Defaults false.
	* 	botOwner: String, the ID of the Discord user to be seen as the owner. Required if using ownerOverMember.
	* 	logging: Boolean, some extra none needed logging (such as caught errors that didn't crash the bot, etc). Defaults false.
	* 	enableAliveMessage: Boolean, enables the bot to log a message in the console every x milliseconds.
	* 	aliveMessage: String, the message to be logged.\*_note_
	* 	aliveMessageTime: Number, time in _**milliseconds**_ the bot logs the message. Defaults to 600000 (5 minutes).
	* 	requesterName: Boolean, whether or not to display the username of the song requester.
	* 	inlineEmbeds: Boolean, whether or not to make embed fields inline (help command and some fields are excluded).
  */

module.exports = function (client, options) {
	// Get all options.
	class Music {
		constructor(client, options) {
			this.package = require('./package.json');
			this.youtubeKey = (options && options.youtubeKey);
			this.botPrefix = (options && options.prefix) || '!';
			this.global = (options && options.global) || false;
			this.maxQueueSize = parseInt((options && options.maxQueueSize) || 20);
			this.defVolume = parseInt((options && options.volume) || 50);
			this.anyoneCanSkip = (options && options.anyoneCanSkip) || false;
			this.clearInvoker = (options && options.clearInvoker) || false;
			this.helpCmd = (options && options.helpCmd) || 'musichelp';
			this.disableHelp = (options && options.disableHelp) || false;
			this.playCmd = (options && options.playCmd) || 'play';
			this.disablePlay = (options && options.disablePlay) || false;
			this.skipCmd = (options && options.skipCmd) || 'skip';
			this.disableSkip = (options && options.disableSkip) || false;
			this.queueCmd = (options && options.queueCmd) || 'queue';
			this.disableQueue = (options && options.disableQueue) || false;
			this.pauseCmd = (options && options.pauseCmd) || 'pause';
			this.disablePause = (options && options.disablePause) || false;
			this.resumeCmd = (options && options.resumeCmd) || 'resume';
			this.disableResume = (options && options.disableResume) || false;
			this.volumeCmd = (options && options.volumeCmd) || 'volume';
			this.disableVolume = (options && options.disableVolume) || false;
			this.leaveCmd = (options && options.leaveCmd) || 'leave';
			this.disableLeave = (options && options.disableLeave) || false;
			this.clearCmd = (options && options.clearCmd) || 'clearqueue';
			this.disableClear = (options && options.disableClear) || false;
			this.loopCmd = (options && options.loopCmd) || 'loop';
			this.disableLoop = (options && options.disableLoop) || false;
			this.npCmd = (options && options.npCmd) || 'np';
			this.disableNp = (options && options.disableNp) || false;
			this.enableQueueStat = (options && options.enableQueueStat) || false;
			this.anyoneCanAdjust = (options && options.anyoneCanAdjust) || false;
			this.ownerOverMember = (options && options.ownerOverMember) || false;
			this.botOwner = (options && options.botOwner) || null;
			this.logging = (options && options.logging) || false;
			this.enableAliveMessage = (options && options.enableAliveMessage) || false;
			this.aliveMessage = (options && options.aliveMessage) || "";
			this.aliveMessageTime = (options && options.aliveMessageTime) || 600000;
			this.requesterName = (options && options.requesterName) || false;
			this.inlineEmbeds = (options && options.inlineEmbeds) || false;
			this.maxChecks = parseInt((options && options.maxChecks) || 3);
			this.loop = "false";
		}
	}

	var musicbot = new Music(client, options);

	//Init errors.
	function checkErrors() {
		if (!musicbot.youtubeKey) {
			console.log(new Error(`youtubeKey is required but missing`));
			process.exit(1);
		};
		if (musicbot.youtubeKey && typeof musicbot.youtubeKey !== 'string') {
			console.log(new TypeError(`youtubeKey must be a string`));
			process.exit(1);
		};

		//Disable commands erros.
		if (typeof musicbot.disableHelp !== 'boolean') {
			console.log(new TypeError(`disableHelp must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disablePlay !== 'boolean') {
			console.log(new TypeError(`disablePlay must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disableSkip !== 'boolean') {
			console.log(new TypeError(`disableSkip must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disableQueue !== 'boolean') {
			console.log(new TypeError(`disableQueue must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disablePause !== 'boolean') {
			console.log(new TypeError(`disablePause must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disableResume !== 'boolean') {
			console.log(new TypeError(`disableResume must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disableLeave !== 'boolean') {
			console.log(new TypeError(`disableLeave must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disableClear !== 'boolean') {
			console.log(new TypeError(`disableClear must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disableLoop !== 'boolean') {
			console.log(new TypeError(`disableLoop must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.disableNp !== 'boolean') {
			console.log(new TypeError(`disableNp must be a boolean`));
			process.exit(1);
		}

		//Owner errors.
		if (typeof musicbot.ownerOverMember !== 'boolean') {
			console.log(new TypeError(`ownerOverMember must be a boolean`));
			process.exit(1);
		};
		if (musicbot.ownerOverMember && typeof musicbot.botOwner !== 'string') {
			console.log(new TypeError(`botOwner must be a string`));
			process.exit(1);
		};

		//musicbot.botPrefix errors.
		if (typeof musicbot.botPrefix !== 'string') {
			console.log(new TypeError(`prefix must be a string`));
			process.exit(1);
		};
		if (musicbot.botPrefix.length < 1 || musicbot.botPrefix.length > 10) {
			console.log(new RangeError(`prefix length must be between 1 and 10`));
			process.exit(1);
		};

		//musicbot.global errors.
		if (typeof musicbot.global !== 'boolean') {
			console.log(new TypeError(`global must be a boolean`));
			process.exit(1);
		};

		//musicbot.maxQueueSize errors.
		if (typeof musicbot.maxQueueSize !== 'number') {
			console.log(new TypeError(`maxQueueSize must be a number`));
			process.exit(1);
		};
		if (!Number.isInteger(musicbot.maxQueueSize) || musicbot.maxQueueSize < 1) {
			console.log(new TypeError(`maxQueueSize must be an integer more than 0`));
			process.exit(1);
		};

		//DEFAULT_VOLUME errors.
		if (typeof musicbot.defVolume !== 'number') {
			console.log(new TypeError(`defaultVolume must be a number`));
			process.exit(1);
		};
		if (!Number.isInteger(musicbot.defVolume) || musicbot.defVolume < 1 || musicbot.defVolume > 200) {
			console.log(new TypeError(`defaultVolume must be an integer between 1 and 200`));
			process.exit(1);
		};

		//musicbot.anyoneCanSkip errors.
		if (typeof musicbot.anyoneCanSkip !== 'boolean') {
			console.log(new TypeError(`anyoneCanSkip must be a boolean`));
			process.exit(1);
		};

		//CLEAR_INVOKER errors.
		if (typeof musicbot.clearInvoker !== 'boolean') {
			console.log(new TypeError(`clearInvoker must be a boolean`));
			process.exit(1);
		};

		//aliveMessage errors.
		if (typeof musicbot.enableAliveMessage !== 'boolean') {
			console.log(new TypeError(`enableAliveMessage must be a boolean`));
			process.exit(1);
		}
		if (typeof musicbot.aliveMessage !== 'string') {
			console.log(new TypeError(`aliveMessage must be a string`));
			process.exit(1);
		}
		if (typeof musicbot.aliveMessageTime !== 'number') {
			console.log(new TypeError(`aliveMessageTime must be a number`));
			process.exit(1);
		}

		//Command name errors.
		if (typeof musicbot.helpCmd !== 'string') {
			console.log(new TypeError(`helpCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.playCmd !== 'string') {
			console.log(new TypeError(`playCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.skipCmd !== 'string') {
			console.log(new TypeError(`skipCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.queueCmd !== 'string') {
			console.log(new TypeError(`queueCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.pauseCmd !== 'string') {
			console.log(new TypeError(`pauseCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.npCmd !== 'string') {
			console.log(new TypeError(`npCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.resumeCmd !== 'string') {
			console.log(new TypeError(`resumeCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.volumeCmd !== 'string') {
			console.log(new TypeError(`volumeCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.leaveCmd !== 'string') {
			console.log(new TypeError(`leaveCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.clearCmd !== 'string') {
			console.log(new TypeError(`clearCmd must be a string`));
			process.exit(1);
		};
		if (typeof musicbot.loopCmd !== 'string') {
			console.log(new TypeError(`loopCmd must be a string`));
			process.exit(1);
		};

		//musicbot.enableQueueStat errors.
		if (typeof musicbot.enableQueueStat !== 'boolean') {
			console.log(new TypeError(`enableQueueStat must be a boolean`));
			process.exit(1);
		};

		//musicbot.anyoneCanAdjust errors.
		if (typeof musicbot.anyoneCanAdjust !== 'boolean') {
			console.log(new TypeError(`anyoneCanAdjust must be a boolean`));
			process.exit(1);
		};

		if (typeof musicbot.logging !== 'boolean') {
			console.log(new TypeError(`logging must be a boolean`));
			process.exit(1);
		};

		//Misc.
		if (typeof musicbot.maxChecks !== 'number') {
			console.log(new TypeError(`maxChecks must be a number`));
			process.exit(1);
		};
		if (musicbot.maxChecks < 2) {
			console.log(new TypeError(`maxChecks must be an integer 3 or more`));
			process.exit(1);
		};
		if (typeof musicbot.requesterName !== 'boolean') {
			console.log(new TypeError(`requesterName must be a boolean`));
			process.exit(1);
		};
		if (typeof musicbot.inlineEmbeds !== 'boolean') {
			console.log(new TypeError(`inlineEmbeds must be a boolean`));
			process.exit(1);
		};
		if (musicbot.global && musicbot.maxQueueSize < 50) console.warn(`global queues are enabled while maxQueueSize is below 50! Recommended to use a higher size.`);
	};
	checkErrors();

	//Set the YouTube API key.
	const opts = {
		maxResults: 50,
		key: musicbot.youtubeKey
	};

	// Create an object of queues.
	let queues = {};

	// Catch message events.
	client.on('message', msg => {
		const message = msg.content.trim();

		// Check if the message is a command.
		if (message.toLowerCase().startsWith(musicbot.botPrefix.toLowerCase())) {
			// Get the command, suffix and bot.
			const command = message.substring(musicbot.botPrefix.length).split(/[ \n]/)[0].toLowerCase().trim();
			const suffix = message.substring(musicbot.botPrefix.length + command.length).trim();

			// Process the commands.
			switch (command) {
				case musicbot.helpCmd:
					if (musicbot.disableHelp) return;
					return musicbothelp(msg, suffix);
				case musicbot.playCmd:
					if (musicbot.disablePlay) return;
					return play(msg, suffix);
				case musicbot.skipCmd:
					if (musicbot.disableSkip) return;
					return skip(msg, suffix);
				case musicbot.queueCmd:
					if (musicbot.disableQueue) return;
					return queue(msg, suffix);
				case musicbot.pauseCmd:
					if (musicbot.disablePause) return;
					return pause(msg, suffix);
				case musicbot.resumeCmd:
					if (musicbot.disableResume) return;
					return resume(msg, suffix);
				case musicbot.npCmd:
					if (musicbot.disableNp) return;
					return np(msg, suffix);
				case musicbot.volumeCmd:
					if (musicbot.disableVolume) return;
					return volume(msg, suffix);
				case musicbot.leaveCmd:
					if (musicbot.disableLeave) return;
					return leave(msg, suffix);
				case musicbot.clearCmd:
					if (musicbot.disableClear) return;
					return clearqueue(msg, suffix);
				case musicbot.loopCmd:
					if (musicbot.disableLoop) return;
					return loop(msg, suffix);
			}
		}
	});

	// Client ready event for some extra stuff.
	client.on("ready", () => {
		 if (musicbot.enableAliveMessage) {
			 setInterval(function liveMessage() {
				 if (musicbot.aliveMessage.length < 2) {
					 musicbot.aliveMessage = "----------------------------------\n"+client.user.username+" online since "+client.readyAt+"!"+"\n----------------------------------";
				 }
				 console.log(musicbot.aliveMessage);
			 }, musicbot.aliveMessageTime);
		 };
		 console.log(`------- Music Bot -------\n> version: 1.7.0\n> logging: ${musicbot.logging}\n> global queues: ${musicbot.global}\n> node: ${process.version}\n------- Music Bot -------`);
		 if (!musicbot.enableQueueStat) console.log(`[NOTICE] enableQueueStat is 'false'. Queue will not have a Playing/Paused indicator.`);
		 if (process.version.slice(1).split('.')[0] < 8) console.log('[NOTICE] Node 8.0.0 or higher was not found, 8+ is recommended. You may still use your version however.');
		 if (musicbot.disableLeave &&
			 musicbot.disableSkip &&
			 musicbot.disablePlay &&
			 musicbot.disableQueue &&
			 musicbot.disableHelp &&
			 musicbot.disableResume &&
			 musicbot.disablePause &&
			 musicbot.disableLoop &&
			 musicbot.disableClear &&
			 musicbot.disableNp &&
			 musicbot.disableVolume) console.log(`[NOTICE] Hey, if you wanna run it with no commands, you do you and I'll do me.`);
	});

	/**
	 * Checks if a user is an admin.
	 *
	 * @param {GuildMember} member - The guild member
	 * @returns {boolean} -
	 */
	function isAdmin(member) {
		if (musicbot.ownerOverMember && member.id === musicbot.botOwner) return true;
		return member.hasPermission("ADMINISTRATOR");
	}

	/**
	 * Checks if the user can skip the song.
	 *
	 * @param {GuildMember} member - The guild member
	 * @param {array} queue - The current queue
	 * @returns {boolean} - If the user can skip
	 */
	function canSkip(member, queue) {
		if (musicbot.ownerOverMember && member.id === musicbot.botOwner) return true;
		if (musicbot.anyoneCanSkip) return true;
		else if (queue[0].requester === member.id) return true;
		else if (isAdmin(member)) return true;
		else return false;
	}

	/**
	 * Checks if the user can adjust volume.
	 *
	 * @param {GuildMember} member - The guild member
	 * @param {array} queue - The current queue
	 * @returns {boolean} - If the user can adjust
	 */
	function canAdjust(member, queue) {
		if (musicbot.anyoneCanAdjust) return true;
		else if (queue[0].requester === member.id) return true;
		else if (isAdmin(member)) return true;
		else return false;
	}

	/**
	 * Deletes the command message if invoker is on.
	 *
	 * @param {Message} msg - the message of the command.
	 */
	function dInvoker(msg) {
		if (musicbot.clearInvoker) {
			if (!msg || msg.length >= 0) return;
			msg.delete();
		}
	};

	/**
	 * Gets the song queue of the server.
	 *
	 * @param {integer} server - The server id.
	 * @returns {object} - The song queue.
	 */
	function getQueue(server) {
		// Check if global queues are enabled.
		if (musicbot.global) server = '_'; // Change to global queue.

		// Return the queue.
		if (!queues[server]) queues[server] = [];
		return queues[server];
	}

	/**
	 * The help command.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response edit.
	 */
	 function musicbothelp(msg, suffix) {
		 dInvoker(msg)
		 if (!msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) return msg.channel.send(note('fail', 'The music help command **requires** embed message permissions.'));
		 if (!suffix || suffix.includes('help')) {
			 const embed = new Discord.RichEmbed();
			 embed.setAuthor("Commands", msg.author.displayAvatarURL)
			 embed.setDescription(`Commands with a * require Admin perms. Use \`${musicbot.botPrefix}${musicbot.helpCmd} command\` for help on usage.`)
			 embed.addField(musicbot.helpCmd, `Displays this text.`)
			 if (!musicbot.disablePlay) embed.addField(musicbot.playCmd, `Queue a song/playlist by URL or search for a song.`)
			 if (!musicbot.disableSkip) embed.addField(musicbot.skipCmd, `Skip a song or multi songs.`)
			 if (!musicbot.disableQueue) embed.addField(musicbot.queueCmd, `Shows the current queue`)
			 if (!musicbot.disablePause) embed.addField(musicbot.pauseCmd, `* Pauses the queue.`)
			 if (!musicbot.disableResume) embed.addField(musicbot.resumeCmd, `* Resume the queue.`)
			 if (!musicbot.disableVolume) embed.addField(musicbot.volumeCmd, `* Adjusts the volume of the bot.`)
			 if (!musicbot.disableLeave) embed.addField(musicbot.leaveCmd, `Leave and clear the queue`)
			 if (!musicbot.disableClear) embed.addField(musicbot.clearCmd, `Clears the current queue.`)
			 if (!musicbot.disableNp) embed.addField(musicbot.npCmd, `Shows the currenlty playing song.`)
			 embed.setColor(0x27e33d)
			 msg.channel.send({embed});
		 } else {
		 	if (suffix.includes(musicbot.playCmd)) {
				if (musicbot.disablePlay) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.playCmd}`, client.user.displayAvatarURL);
				embed.setDescription(`Addes a song to the queue.\n**__Usage:__** ${musicbot.botPrefix}${musicbot.playCmd} Video URL | Playlist URL | search for something.`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
			} else if (suffix.includes(musicbot.skipCmd)) {
				if (musicbot.disableSkip) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
	 			embed.setAuthor(`${musicbot.botPrefix}${musicbot.skipCmd}`, client.user.displayAvatarURL);
	 			embed.setDescription(`Skips the playing song or multi songs. You must be the person that queued the song to skip it, or admin.\n**__Usage:__** ${musicbot.botPrefix}${musicbot.skipCmd} [numer of songs]`);
				embed.setColor(0x27e33d);
	 			msg.channel.send({embed});
		 } else if (suffix.includes(musicbot.queueCmd)) {
				if (musicbot.disableQueue) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.queueCmd}`, client.user.displayAvatarURL);
				embed.setDescription(`(**Requires** Embed Perms) Shows the first 25 songs in the queue or a song from the queue.\n**__Usage:__** ${musicbot.botPrefix}${musicbot.queueCmd} [songNumber]`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
		} else if (suffix.includes(musicbot.pauseCmd)) {
				if (musicbot.disablePause) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.pauseCmd}`, client.user.displayAvatarURL);
				embed.setDescription(`Pauses the current queue.`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
		} else if (suffix.includes(musicbot.resumeCmd)) {
				if (musicbot.disableResume) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.resumeCmd}`, client.user.displayAvatarURL);
				embed.setDescription(`Resumes the current queue if paused.`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
		} else if (suffix.includes(musicbot.volumeCmd)) {
				if (musicbot.disableVolume) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.volumeCmd}`, client.user.displayAvatarURL);
				embed.setDescription(`Adjusts the streams volume. Must be admin.\n**__Usage:__** ${musicbot.botPrefix}${musicbot.volumeCmd} <1 to 200>`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
		} else if (suffix.includes(musicbot.leaveCmd)) {
				if (musicbot.disableLeave) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.leaveCmd}`, client.user.displayAvatarURL);
				embed.setDescription(`Leaves the voice channel and clears the queue.`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
		} else if (suffix.includes(musicbot.clearCmd)) {
				if (musicbot.disableClear) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.clearCmd}`, client.user.displayAvatarURL);
				embed.setDescription(`Clears the current queue playing.`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
		} else if (suffix.includes(musicbot.loopCmd)) {
				if (musicbot.disableLoop) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.loopCmd}`, client.user.displayAvatarURL);
				embed.setDescription(`Enables/disables looping of the currently being played song.`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
		} else if (suffix.includes(musicbot.npCmd)) {
			if (musicbot.disableNp) return msg.channel.send(note('fail', `${suffix} is not a valid command!`));
			const embed = new Discord.RichEmbed();
			embed.setAuthor(`${musicbot.botPrefix}${musicbot.npCmd}`, client.user.displayAvatarURL);
			embed.setDescription(`Shows the currently playing song (first song in the queue), with a link to it and the thumbnail as well.`);
			embed.setColor(0x27e33d);
			msg.channel.send({embed});
		} else {
			msg.channel.send(note('fail', `${suffix} is not a valid command!`));
		};
	};
};

	/**
	 * The command for adding a song to the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response edit.
	 */
	function play(msg, suffix) {
		dInvoker(msg);
		// Make sure the user is in a voice channel.
		if (msg.member.voiceChannel === undefined) return msg.channel.send(note('fail', 'You\'re not in a voice channel~'));

		// Make sure the suffix exists.
		if (!suffix) return msg.channel.send(note('fail', 'No video specified!'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Check if the queue has reached its maximum size.
		if (queue.length >= musicbot.maxQueueSize) {
			return msg.channel.send(note('fail', 'Maximum queue size reached!'));
		}

		// Get the video information.
		msg.channel.send(note('note', 'Searching...')).then(response => {
			var searchstring = suffix
			if (searchstring.includes('list=')) {
				response.edit(note('note', 'Playlist detected! Fetching...')).then(response => {
					//Get the playlist ID.

					//Make sure it's only the ID.
					var playid = searchstring.toString().split('list=')[1];
					if (playid.toString().includes('?')) {
						let new_playid = playid.split('?')[0];
						playid = new_playid;
					};

					if (playid.toString().includes('&t=')) {
						let newplayid = playid.split('&t=')[0];
						playid = newplayid;
					};

					//Get info on the playlist.
					ypi.playlistInfo(musicbot.youtubeKey, playid, function(playlistItems) {
						const newItems = Array.from(playlistItems);
						var skippedVideos = new Array();
						var queuedVids = new Array();

						for (var i = 0; i < newItems.length; i++) {
							var results = newItems[i];
							if (queue.length > musicbot.maxQueueSize) {
								skippedVideos.push(results.title);
							} else if (results.kind !== 'youtube#video') {
								skippedVideos.push("[Channel] "+results.title);
							} else {
								results.link = `https://www.youtube.com/watch?v=` + newItems[i].resourceId.videoId;
								results.channel = results.channelTitle;
								results.description = " ";
								if (musicbot.requesterName) results.requester = msg.author.id;
								if (musicbot.requesterName) results.requesterAvatarURL = msg.author.displayAvatarURL;
								if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
									queuedVids.push(results);
								} else {
									queuedVids.push(results.title);
								}
								queue.push(results);
								if (queue.length === 1) executeQueue(msg, queue);
							};
						};
						function endrun() {
							if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
								const embed = new Discord.RichEmbed();
								embed.setAuthor(`Song Queue`, client.user.avatarURL);
								embed.setTitle(`Queued ${queuedVids.length} | Skipped ${skippedVideos.length}`);
								if (queuedVids.length >= 1) embed.addField(`1) ${queuedVids[0].channel}`, `[${queuedVids[0].title}](${queuedVids[0].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 2) embed.addField(`2) ${queuedVids[1].channel}`, `[${queuedVids[1].title}](${queuedVids[1].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 3) embed.addField(`3) ${queuedVids[2].channel}`, `[${queuedVids[2].title}](${queuedVids[2].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 4) embed.addField(`4) ${queuedVids[3].channel}`, `[${queuedVids[3].title}](${queuedVids[3].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 5) embed.addField(`5) ${queuedVids[4].channel}`, `[${queuedVids[4].title}](${queuedVids[4].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 6) embed.addField(`6) ${queuedVids[5].channel}`, `[${queuedVids[5].title}](${queuedVids[5].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 7) embed.addField(`7) ${queuedVids[6].channel}`, `[${queuedVids[6].title}](${queuedVids[6].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 8) embed.addField(`8) ${queuedVids[7].channel}`, `[${queuedVids[7].title}](${queuedVids[7].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 9) embed.addField(`9) ${queuedVids[8].channel}`, `[${queuedVids[8].title}](${queuedVids[8].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 10) embed.addField(`10) ${queuedVids[9].channel}`, `[${queuedVids[9].title}](${queuedVids[9].link})`, musicbot.inlineEmbeds);
								if (queuedVids.length >= 11) embed.addField(`And...`, `${queuedVids.length - 10} more songs`);
								embed.setColor(0x27e33d);
								msg.channel.send({embed});
							} else {
								var qvids = queuedVids.toString().replace(/,/g, '\n');
								var svids = skippedVideos.toString().replace(/,/g, '\n');
								if (qvids.length > 1000) qvids = 'Over character count, replaced...';
								if (svids.length > 1000) svids = 'Over character count, replaced...';

								if (svids != ""){
									msg.channel.send(note('wrap', `Queued:\n${qvids}\nSkipped: (Max Queue)\n${svids}`), {split: true});
								} else {
									msg.channel.send(note('wrap', `Queued:\n${qvids}`), {split: true});
								};
							}
						};
						setTimeout(endrun, 1250);
					});

				})
		  } else {
		    search(searchstring, opts, function(err, results) {
					if (err) {
						console.log(`Error on [PlayCmd] from [${msg.guild.name}]\n` + err.stack);
						const nerr = err.toString().split(':');
						return response.edit(note('fail', `Error occoured!\n\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``));
					};

					function playStart(videos) {
						const text = videos.map((video, index) => (
							(index + 1) + ': ' + video.title
						)).join('\n');

						response.delete();
						msg.channel.send(`\`\`\`\nPlease enter the song number, or type cancel to cancel.\n${text}\n\`\`\``).then(imsg => {
							const filter = m => m.author.id === msg.author.id
							&& m.content.includes('1')
							|| m.content.includes('2')
							|| m.content.includes('3')
							|| m.content.includes('4')
							|| m.content.includes('5')
							|| m.content.includes('6')
							|| m.content.includes('7')
							|| m.content.includes('8')
							|| m.content.includes('9')
							|| m.content.includes('10')
							|| m.content.includes('cancel');
							msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
							.then(collected => {
								const newColl = Array.from(collected);
								const mcon = newColl[0][1].content;

								if (mcon.includes(`cancel`)) return imsg.edit(note('note', 'Searching canceled.'));
								const song_number = parseInt(mcon) - 1;
								if (song_number >= 0) {
									videos[song_number].requester = msg.author.id;
									let editMess;

									if (videos[song_number].title.includes('*')) {
										const newTitle = videos[song_number].title.toString().replace(/\*/g, "\\*");
										editMess = note('note', `Queued **${newTitle}**`);
									} else {
										editMess = note('note', `Queued **${videos[song_number].title}**`);
									};

									return imsg.edit(editMess).then(() => {
										queue.push(videos[song_number]);
										if (queue.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) executeQueue(msg, queue);
									}).catch(console.log);
								};
							})
							.catch(collected => {
								imsg.edit(`\`\`\`\nSearching canceled, timed out after 60 seconds.\n\`\`\``);
								return;
							});
						});
					};

					var videos = new Array();
					for (var i = 0; i < 50; i++) {
						if (videos.length >= 10) {
							playStart(videos);
							i = 51;
						} else {
							if (results[i].kind === 'youtube#video') {
								if (musicbot.requesterName) results.requester = msg.author.id;
								if (musicbot.requesterName) results.requesterAvatarURL = msg.author.displayAvatarURL;
								videos.push(results[i]);
							};
						}
					};

		    });
		  };
		}).catch(console.log);
	}


	/**
	 * The command for skipping a song.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function skip(msg, suffix) {
		dInvoker(msg)
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music being played.'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		if (!canSkip(msg.member, queue)) return msg.channel.send(note('fail', 'You cannot skip this as you didn\'t queue it.')).then((response) => {
			response.delete(5000);
		});

		let first;

		if (musicbot.loop === "false") first = false;

		if (musicbot.loop === "true") {
			first = true;
			musicbot.loop = "false";
		};

		// Get the number to skip.
		let toSkip = 1; // Default 1.
		if (!isNaN(suffix) && parseInt(suffix) > 0) {
			toSkip = parseInt(suffix);
		}
		toSkip = Math.min(toSkip, queue.length);

		// Skip.
		queue.splice(0, toSkip - 1);

		// Resume and stop playing.
		try {
			const dispatcher = voiceConnection.player.dispatcher;
			if (!dispatcher || dispatcher === null) {
				if (musicbot.logging) console.log(`-----------------------------------\ndispatcher fail (testing alert)\n-----------------------------------`);
				return;
			};
			if (voiceConnection.paused) dispatcher.resume();
			dispatcher.end();
		} catch (e) {
			if (musicbot.logging) console.log(new Error(`Play command error from userID ${msg.author.id} in guildID ${msg.guild.id}\n${e.stack}`));
			const nerr = e.toString().split(':');
			return msg.channel.send(note('fail', `Error occoured!\n\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``));
		};

		if (first) {
			msg.channel.send(note('note', 'Skipped **' + toSkip + '**! (Disabled Looping)'));
		} else {
			msg.channel.send(note('note', 'Skipped **' + toSkip + '**!'));
		}
	}

	/**
	 * The command for listing the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function queue(msg, suffix) {
		dInvoker(msg)
		// Get the queue.
		const queue = getQueue(msg.guild.id);
		let text;
		// Get the queue text.
		//Choice added for names to shorten the text a bit if wanted.
		if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
			const songNum = parseInt(suffix) || 0;
			let maxRes = queue.length;

			if (songNum > 0) {
				if (songNum > queue.length) return msg.channel.send(note('fail', 'Not a valid song number.'));
				const embed = new Discord.RichEmbed();
				const reqMem = client.users.get(queue[songNum].requester);
				embed.setAuthor(`Queued Song #${suffix}`, client.user.avatarURL);
				embed.addField(queue[songNum].channelTitle, `[${queue[songNum].title}](${queue[songNum].link})`, musicbot.inlineEmbeds);
				embed.setThumbnail(queue[songNum].thumbnails.high.url);
				embed.setColor(0x27e33d);
				if (musicbot.requesterName && reqMem) embed.setFooter(`Queued by: ${reqMem.username}`, queue[songNum].requesterAvatarURL);
				if (musicbot.requesterName && !reqMem) embed.setFooter(`Queued by: \`UnknownUser (id: queue[songNum].requester)\``, queue[songNum].requesterAvatarURL)
				msg.channel.send({embed});
			} else {
				const embed = new Discord.RichEmbed();
				if (queue.length > 25) maxRes = 25;
				if (musicbot.enableQueueStat) {
					//Get the status of the queue.
					let queueStatus = 'Stopped';
					const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
					if (voiceConnection !== null) {
						const dispatcher = voiceConnection.player.dispatcher;
						queueStatus = dispatcher.paused ? 'Paused' : 'Playing';

						embed.setAuthor(`Song Queue (${queueStatus})`, client.user.avatarURL);
					} else {
						embed.setAuthor(`Song Queue`, client.user.avatarURL);
					}
				}

				try {
					for (var i = 0; i < maxRes; i++) {
						embed.addField(`${queue[i].channelTitle}`, `[${queue[i].title}](${queue[i].link})`, musicbot.inlineEmbeds);
					};
					embed.setColor(0x27e33d);
					embed.setFooter(`Total songs: ${queue.length}`, msg.author.displayAvatarURL);
				} catch (e) {
					console.log(e.stack);
				};

				setTimeout(() => {
					msg.channel.send({embed});
				}, 1500);
			}
		} else {
			try {
				if (musicbot.requesterName) {
					text = queue.map((video, index) => (
						(index + 1) + ': ' + video.title + ' | Requested by ' + client.users.get(video.requester).username
					)).join('\n');
				} else {
					text = queue.map((video, index) => (
						(index + 1) + ': ' + video.title
					)).join('\n');
				};
			} catch (e) {
				console.log(`[${msg.guild.name}] [queueCmd] ` + e.stack);
				const nerr = e.toString().split(':');
				return msg.channel.send(note('fail', `Error occoured!\n\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``));

			} finally {

				if (text.length > 1900) {
					const newText = text.substr(0, 1899);
					const otherText = text.substr(1900, text.length);
					if (otherText.length > 1900) {
						msg.channel.send(note('wrap', 'Queue ('+ queueStatus +'):\n' + "Past character limit..."));
					} else {
						if (musicbot.enableQueueStat) {
							//Get the status of the queue.
							let queueStatus = 'Stopped';
							const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
							if (voiceConnection !== null) {
								const dispatcher = voiceConnection.player.dispatcher;
								queueStatus = dispatcher.paused ? 'Paused' : 'Playing';
							}

							// Send the queue and status.
							msg.channel.send(note('wrap', 'Queue ('+ queueStatus +'):\n' + newText));
							msg.channel.send(note('wrap', 'Queue (2) ('+ queueStatus +'):\n' + otherText));
						} else {
							msg.channel.send(note('wrap', 'Queue:\n' + newText));
							msg.channel.send(note('wrap', 'Queue (2):\n' + otherText));
						}
					};
				} else {
					if (musicbot.enableQueueStat) {
						//Get the status of the queue.
						let queueStatus = 'Stopped';
						const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
						if (voiceConnection !== null) {
							const dispatcher = voiceConnection.player.dispatcher;
							queueStatus = dispatcher.paused ? 'Paused' : 'Playing';
						}

						// Send the queue and status.
						msg.channel.send(note('wrap', 'Queue ('+ queueStatus +'):\n' + text));
					} else {
						msg.channel.send(note('wrap', 'Queue:\n' + text));
					}
				}
			}
		}
	}

	/**
	 * The command for information about the current song.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function np(msg, suffix) {
		dInvoker(msg)
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music is being played.'));
		const dispatcher = voiceConnection.player.dispatcher;
		const queue = getQueue(msg.guild.id);
		if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
			const embed = new Discord.RichEmbed();
			try {
				embed.setAuthor('Now Playing', client.user.avatarURL);
				var songTitle = queue[0].title;
				if (songTitle.includes('*') || songTitle.includes('_') || songTitle.includes('~')) {
					songTitle = songTitle.toString().replace(/\*/g, '\\*');
					songTitle = songTitle.toString().replace(/_/g, '\\_');
					songTitle = songTitle.toString().replace(/~/g, '\\~');
				};
				embed.setColor(0x27e33d);
				embed.addField(queue[0].channelTitle, `[${songTitle}](${queue[0].link})`, musicbot.inlineEmbeds);
				embed.setImage(queue[0].thumbnails.high.url);
				const resMem = client.users.get(queue[0].requester);
				if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(queue[0].requester).username}`, queue[0].requesterAvatarURL);
				if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${queue[0].requester})\``, queue[0].requesterAvatarURL);
				msg.channel.send({embed});
			} catch (e) {
				console.log(`[${msg.guild.name}] [npCmd] ` + e.stack);
			};
		} else {
			try {
				var songTitle = queue[0].title;
				if (songTitle.includes('*') || songTitle.includes('_') || songTitle.includes('~')) {
					songTitle = songTitle.toString().replace(/\*/g, '\\*');
					songTitle = songTitle.toString().replace(/_/g, '\\_');
					songTitle = songTitle.toString().replace(/~/g, '\\~');
				};

				msg.channel.send(`Now Playing: **${songTitle}**\nRequested By: ${client.users.get(queue[0].requester).username}`)
			} catch (e) {
				console.log(`[${msg.guild.name}] [npCmd] ` + e.stack);
			};
		}
	}

	/**
	 * The command for pausing the current song.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function pause(msg, suffix) {
		dInvoker(msg)
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music being played.'));

		if (!isAdmin(msg.member))
			return msg.channel.send(note('fail', 'Only Admins are allowed to use this command.'));

		// Pause.
		msg.channel.send(note('note', 'Playback paused.'));
		const dispatcher = voiceConnection.player.dispatcher;
		if (!dispatcher.paused) dispatcher.pause();
	}

	/**
	 * The command for leaving the channel and clearing the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function leave(msg, suffix) {
		dInvoker(msg)
		if (isAdmin(msg.member)) {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.send(note('fail', 'I\'m not in a voice channel!.'));
			// Clear the queue.
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);

			// End the stream and disconnect.
			voiceConnection.player.dispatcher.end();
			voiceConnection.disconnect();
			musicbot.loop = "false";
			msg.channel.send(note('note', 'Successfully left your voice channel!'));
		} else {
			msg.channel.send(note('fail', 'Only Admins are allowed to use this command.'));
		}
	}

	/**
	 * The command for clearing the song queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function clearqueue(msg, suffix) {
		dInvoker(msg)
		if (isAdmin(msg.member)) {
			const queue = getQueue(msg.guild.id);
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.send(note('fail', 'I\'m not in a channel!'));

			queue.splice(0, queue.length);
			msg.channel.send(note('note', 'Queue cleared~'));

			voiceConnection.player.dispatcher.end();
			voiceConnection.disconnect();
			musicbot.loop = "false";
		} else {
			msg.channel.send(note('fail', `Only Admins are allowed to use this command.`));
		}
	}

	/**
	 * The command for resuming the current song.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function resume(msg, suffix) {
		dInvoker(msg)
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music is being played.'));

		if (!isAdmin(msg.member))
			return msg.channel.send(note('fail', 'Only Admins are allowed to use this command.'));

		// Resume.
		msg.channel.send(note('note', 'Playback resumed.'));
		const dispatcher = voiceConnection.player.dispatcher;
		if (dispatcher.paused) dispatcher.resume();
	}

	/**
	 * The command for changing the song volume.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function volume(msg, suffix) {
		dInvoker(msg)
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music is being played.'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		if (!canAdjust(msg.member, queue))
			return msg.channel.send(note('fail', 'Only Admins are allowed to use this command.'));

		// Get the dispatcher
		const dispatcher = voiceConnection.player.dispatcher;

		if (suffix > 200 || suffix < 0) return msg.channel.send(note('fail', 'Volume out of range!')).then((response) => {
			response.delete(5000);
		});

		msg.channel.send(note('note', 'Volume set to ' + suffix));
		dispatcher.setVolume((suffix/100));
	}

	/**
	 * Looping command/option.
	 *
	 * @param {Message} msg - Original message.
	 * @param {object} queue - The song queue for this server.
	 * @param {string} suffix - Command suffix.
	 */
	function loop(msg, suffix) {
		dInvoker(msg)
		if (musicbot.loop === "true") {
			musicbot.loop = "false";
			msg.channel.send(note('note', 'Looping disabled! :arrow_forward:'));
		} else if (musicbot.loop === "false") {
			musicbot.loop = "true";
			msg.channel.send(note('note', 'Looping enabled! :repeat_one:'));
		}
	};

	/**
	 * Executes the next song in the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {object} queue - The song queue for this server.
	 * @returns {<promise>} - The voice channel.
	 */
	function executeQueue(msg, queue) {
		// If the queue is empty, finish.
		if (queue.length === 0) {
			msg.channel.send(note('note', 'Playback finished.'));

			// Leave the voice channel.
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection !== null) return voiceConnection.disconnect();
		}

		new Promise((resolve, reject) => {
			// Join the voice channel if not already in one.
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) {
				// Check if the user is in a voice channel.
				if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
					msg.member.voiceChannel.join().then(connection => {
						resolve(connection);
					}).catch((error) => {
						console.log(error);
					});
				} else if(!msg.member.voiceChannel.joinable) {
					msg.channel.send(note('fail', 'I do not have permission to join your voice channel!'))
					reject();
				} else {
					// Otherwise, clear the queue and do nothing.
					queue.splice(0, queue.length);
					reject();
				}
			} else {
				resolve(voiceConnection);
			}
		}).then(connection => {
			// Get the first item in the queue.
			const video = queue[0];

			// console.log(video.webpage_url);
			//removed currently.

			// Play the video.
			try {
				np(msg, queue)
				let dispatcher = connection.playStream(stream(video.link), {seek: 0, volume: (musicbot.defVolume/100)});

				connection.on('error', (error) => {
					// Skip to the next song.
					console.log(error);
					queue.shift();
					executeQueue(msg, queue);
				});

				dispatcher.on('error', (error) => {
					// Skip to the next song.
					console.log(error);
					queue.shift();
					executeQueue(msg, queue);
				});

				dispatcher.on('end', () => {
					// Wait a second.
					setTimeout(() => {
						if (musicbot.loop === "true") {
							executeQueue(msg, queue);
						} else {
							if (queue.length > 0) {
								// Remove the song from the queue.
								queue.shift();
								// Play the next song in the queue.
								executeQueue(msg, queue);
							}
						}
					}, 1000);
				});
			} catch(error) {
				console.log(error);
			}
		}).catch((error) => {
			console.log(error);
		});
	}

	//Text wrapping and cleaning.
	 function note(type, text) {
		if (type === 'wrap') {
			ntext = text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203))
			.replace(client.token, 'REMOVED');

			return '```\n' + ntext + '\n```';
		} else if (type === 'note') {
			return ':musical_note: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
		} else if (type === 'fail') {
			return ':no_entry_sign: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
		} else {
			const harp = new Error(`${type} was an invalid type; note function`);
			console.log(harp);
		}
  };
}
