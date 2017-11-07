/**
 * Original code nexu-dev, https://github.com/nexu-dev/discord.js-client
 * Tweeked by Demise.
 */

// const YoutubeDL = require('youtube-dl');
// const ytdl = require('ytdl-core');

const stream = require('youtube-audio-stream');
const search = require('youtube-search');
const ypi = require('youtube-playlist-info');
// const {Client} = require('discord.js');
const Discord = require('discord.js');
const EventEmitter = require('events');

class Emitter extends EventEmitter {}
const emitter = new Emitter();

 /**
  * Takes a discord.js client and turns it into a client bot.
  * Thanks to Rodabaugh for helping with some tweaks and ideas.
  *
  * @param {Client} client - The discord.js client.
  * @param {object} options - Options to configure the client bot. Acceptable options are:
  * 							prefix: The prefix to use for the commands (default '!').
  * 							global: Whether to use a global queue instead of a server-specific queue (default false).
  * 							maxQueueSize: The maximum queue size (default 20).
  * 							anyoneCanSkip: Allow anybody to skip the song.
  *							anyoneCanAdjust: Allow anyone to adjust volume.
  * 							clearInvoker: Clear the command message.
  * 							volume: The default volume of the player.
  *							helpCmd: Name of the help command (defualt: clienthelp).
  *							playCmd: Sets the play command name.
  *							skipCmd: Sets the skip command name.
  *							queueCmd: Sets the queue command name.
  *							pauseCmd: Sets the name for the pause command.
  *							resumeCmd: Sets the name for the resume command.
  *							volumeCmd: Sets the name for the volume command.
  *							leaveCmd:  Sets the name for the leave command.
  *							clearCmd: Sets the name for the clear command.
  *							enableQueueStat: Disables or enables queue status (useful to prevent errors sometimes, defaults true).
  */
	//note that I'm too lazy to update those ^, refer to the readme.md instead.

module.exports = function (client, options) {
	// Get all options.
	class Music {
		constructor(client, options) {
			this.youtubeKey = (options && options.youtubeKey);
			this.botPrefix = (options && options.prefix) || '!';
			this.global = (options && options.global) || false;
			this.maxQueueSize = parseInt((options && options.maxQueueSize) || 20);
			this.defVolume = parseInt((options && options.volume) || 50);
			this.anyoneCanSkip = (options && options.anyoneCanSkip) || false;
			this.clearInvoker = (options && options.clearInvoker) || false;
			this.helpCmd = (options && options.helpCmd) || 'musichelp';
			this.playCmd = (options && options.playCmd) || 'play';
			this.skipCmd = (options && options.skipCmd) || 'skip';
			this.queueCmd = (options && options.queueCmd) || 'queue';
			this.pauseCmd = (options && options.pauseCmd) || 'pause';
			this.resumeCmd = (options && options.resumeCmd) || 'resume';
			this.volumeCmd = (options && options.volumeCmd) || 'volume';
			this.leaveCmd = (options && options.leaveCmd) || 'leave';
			this.clearCmd = (options && options.clearCmd) || 'clearqueue';
			this.loopCmd = (options && options.loopCmd) || 'loop';
			this.enableQueueStat = (options && options.enableQueueStat) || true;
			this.anyoneCanAdjust = (options && options.anyoneCanAdjust) || false;
			this.ownerOverMember = (options && options.ownerOverMember) || false;
			this.botOwner = (options && options.botOwner) || null;
			this.logging = (options && options.logging) || false;
			this.enableAliveMessage = (options && options.enableAliveMessage) || false;
			this.aliveMessage = (options && options.aliveMessage) || "";
			this.aliveMessageTime = (options && options.aliveMessageTime) || 600000;
			this.loop = "false";
		}
	}

	var musicbot = new Music(client, options);

	//Init errors.
	function checkErrors() {
		if (process.version.slice(1).split('.')[0] < 8) console.log(new Error('Node 8.0.0 or higher was not found, 8+ is recommended. You may still use your version however.'));
		if (!musicbot.youtubeKey) {
			console.log(new Error(`youtubeKey is required but missing`));
			process.exit(1);
		};
		if (musicbot.youtubeKey && typeof musicbot.youtubeKey !== 'string') {
			console.log(new TypeError(`youtubeKey must be a string`));
			process.exit(1);
		};

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

		//aliveMessage erros.
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
		// if (typeof musicbot.enableHelp !== 'boolean') {
		// 	console.log(new TypeError(`enableHelp must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.playCmd !== 'string') {
			console.log(new TypeError(`playCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enablePlay !== 'boolean') {
		// 	console.log(new TypeError(`enablePlay must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.skipCmd !== 'string') {
			console.log(new TypeError(`skipCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enableSkip !== 'boolean') {
		// 	console.log(new TypeError(`enableSkip must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.queueCmd !== 'string') {
			console.log(new TypeError(`queueCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enableQueue !== 'boolean') {
		// 	console.log(new TypeError(`enableQueue must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.pauseCmd !== 'string') {
			console.log(new TypeError(`pauseCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enablePause !== 'boolean') {
		// 	console.log(new TypeError(`enablePause must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.resumeCmd !== 'string') {
			console.log(new TypeError(`resumeCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enableResume !== 'boolean') {
		// 	console.log(new TypeError(`enableResume must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.volumeCmd !== 'string') {
			console.log(new TypeError(`volumeCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enableVolume !== 'boolean') {
		// 	console.log(new TypeError(`enableVolume must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.leaveCmd !== 'string') {
			console.log(new TypeError(`leaveCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enableLeave !== 'boolean') {
		// 	console.log(new TypeError(`enableLeave must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.clearCmd !== 'string') {
			console.log(new TypeError(`clearCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enableClear !== 'boolean') {
		// 	console.log(new TypeError(`enableClear must be a boolean`));
		// 	process.exit(1);
		// };
		if (typeof musicbot.loopCmd !== 'string') {
			console.log(new TypeError(`loopCmd must be a string`));
			process.exit(1);
		};
		// if (typeof musicbot.enableLoop !== 'boolean') {
		// 	console.log(new TypeError(`enableLoop must be a boolean`));
		// 	process.exit(1);
		// };

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
		}

		//Misc.
		if (musicbot.global && musicbot.maxQueueSize < 50) console.warn(`global queues are enabled while maxQueueSize is below 50! Recommended to use a higher size.`);
	};
	checkErrors();

	//Set the YouTube API key.
	const opts = {
		maxResults: 1,
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
					return musicbothelp(msg, suffix);
				case musicbot.playCmd:
					return play(msg, suffix);
				case musicbot.skipCmd:
					return skip(msg, suffix);
				case musicbot.queueCmd:
					return queue(msg, suffix);
				case musicbot.pauseCmd:
					return pause(msg, suffix);
				case musicbot.resumeCmd:
					return resume(msg, suffix);
				case musicbot.volumeCmd:
					return volume(msg, suffix);
				case musicbot.leaveCmd:
					return leave(msg, suffix);
				case musicbot.clearCmd:
					return clearqueue(msg, suffix);
				case musicbot.loopCmd:
					return loop(msg, suffix);
			}
			if (musicbot.clearInvoker) {
				msg.delete();
			}
		}
	});

	/**
	 * Live message function.
	 */
	 if (musicbot.enableAliveMessage) {
		 setInterval(function liveMessage() {
			 if (musicbot.aliveMessage.length < 2) {
				 musicbot.aliveMessage = "----------------------------------\n"+client.user.username+" online since "+client.readyAt+"!"+"\n----------------------------------";
			 }

			 console.log(musicbot.aliveMessage);
		 }, musicbot.aliveMessageTime);
	 };

	/**
	 * Checks if a user is an admin.
	 *
	 * @param {GuildMember} member - The guild member
	 * @returns {boolean} -
	 */
	function isAdmin(member) {
		if (musicbot.ownerOverMember && member.id === musicbot.botOwner) return member.hasPermission("ADMINISTRATOR");
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
		 if (!suffix || suffix.includes('help')) {
			 console.log(musicbot);
			 const embed = new Discord.RichEmbed();
			 embed.setAuthor("Commands", msg.author.displayAvatarURL)
			 embed.setDescription(`Commands with a * require Admin perms. Use \`${musicbot.botPrefix}musicbothelp command\` for help on usage.`)
			 embed.addField(musicbot.helpCmd, `Displays this text.`)
			 embed.addField(musicbot.playCmd, `Queue a song by url or search.`)
			 embed.addField(musicbot.skipCmd, `Skip a song or mutli songs.`)
			 embed.addField(musicbot.queueCmd, `Shows the current queue`)
			 embed.addField(musicbot.pauseCmd, `* Pauses the queue.`)
			 embed.addField(musicbot.resumeCmd, `* Resume the queue.`)
			 embed.addField(musicbot.volumeCmd, `* Adjusts the volume of the bot.`)
			 embed.addField(musicbot.leaveCmd, `Leave and clear the queue`)
			 embed.addField(musicbot.clearCmd, `Clears the current queue.`)
			 embed.setColor(0x27e33d)
			 msg.channel.send({embed});
		 } else {
		 	if (suffix.includes(musicbot.playCmd)) {
				const embed = new Discord.RichEmbed();
				embed.setAuthor(`${musicbot.botPrefix}${musicbot.playCmd}`, musicbot.user.avatarURL);
				embed.setDescription(`Addes a song to the queue.\n**__Usage:__** ${musicbot.botPrefix}${musicbot.playCmd} Video URL | Playlist URL | search for something.`);
				embed.setColor(0x27e33d);
				msg.channel.send({embed});
			} else if (suffix.includes(musicbot.skipCmd)) {
				const embed = new Discord.RichEmbed();
	 		 embed.setAuthor(`${musicbot.botPrefix}${musicbot.skipCmd}`, musicbot.user.avatarURL);
	 		 embed.setDescription(`Skips the playing song or mutli songs. You must be the person that queued the song to skip it, or admin.\n**__Usage:__** ${musicbot.botPrefix}${musicbot.skipCmd} [numer of songs]`);
			 embed.setColor(0x27e33d);
	 		 msg.channel.send({embed});
		 } else if (suffix.includes(musicbot.queueCmd)) {
			 const embed = new Discord.RichEmbed();
			embed.setAuthor(`${musicbot.botPrefix}${musicbot.queueCmd}`, musicbot.user.avatarURL);
			embed.setDescription(`Displays the current queue.`);
			embed.setColor(0x27e33d);
			msg.channel.send({embed});
		} else if (suffix.includes(musicbot.pauseCmd)) {
			 const embed = new Discord.RichEmbed();
			embed.setAuthor(`${musicbot.botPrefix}${musicbot.pauseCmd}`, musicbot.user.avatarURL);
			embed.setDescription(`Pauses the current queue.`);
			embed.setColor(0x27e33d);
			msg.channel.send({embed});
		} else if (suffix.includes(musicbot.resumeCmd)) {
			 const embed = new Discord.RichEmbed();
			embed.setAuthor(`${musicbot.botPrefix}${musicbot.resumeCmd}`, musicbot.user.avatarURL);
			embed.setDescription(`Resumes the current queue if paused.`);
			embed.setColor(0x27e33d);
			msg.channel.send({embed});
		} else if (suffix.includes(musicbot.volumeCmd)) {
			 const embed = new Discord.RichEmbed();
			embed.setAuthor(`${musicbot.botPrefix}${musicbot.volumeCmd}`, musicbot.user.avatarURL);
			embed.setDescription(`Adjusts the streams volume. Must be admin.\n**__Usage:__** ${musicbot.botPrefix}${musicbot.volumeCmd} <1 to 200>`);
			embed.setColor(0x27e33d);
			msg.channel.send({embed});
		} else if (suffix.includes(musicbot.leaveCmd)) {
			 const embed = new Discord.RichEmbed();
			embed.setAuthor(`${musicbot.botPrefix}${musicbot.leaveCmd}`, musicbot.user.avatarURL);
			embed.setDescription(`Leaves the voice channel and clears the queue.`);
			embed.setColor(0x27e33d);
			msg.channel.send({embed});
		} else if (suffix.includes(musicbot.clearCmd)) {
			 const embed = new Discord.RichEmbed();
			embed.setAuthor(`${musicbot.botPrefix}${musicbot.clearCmd}`, musicbot.user.avatarURL);
			embed.setDescription(`Clears the current queue playing.`);
			embed.setColor(0x27e33d);
			msg.channel.send({embed});
		} else if (suffix.includes(musicbot.loopCmd)) {
			const embed = new Discord.RichEmbed();
			embed.setAuthor(`${musicbot.botPrefix}${musicbot.loopCmd}`, musicbot.user.avatarURL);
			embed.setDescription(`Enables/disables looping of the currently being played song.`);
			embed.setColor(0x27e33d);
			msg.channel.send({embed});
		} else {
			msg.channel.send(note('fail', `${suffix} is not a vlaid command!`));
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
			if (searchstring.includes('/playlist?list=')) {
				response.edit(note('note', 'Playlist detected! Fetching...')).then(response => {
					//Get the playlist ID.
					const playid = searchstring.toString().split('playlist?list=')[1];

					//Get info on the playlist.
					ypi.playlistInfo(musicbot.youtubeKey, playid, function(playlistItems) {
						const newItems = Array.from(playlistItems);
						var skippedVideos = new Array();
						var queuedVids = new Array();

						for (var i = 0; i < newItems.length; i++) {
							var results = newItems[i];
							if (queue.length > musicbot.maxQueueSize) {
								skippedVideos.push(results.title);
							} else {
								results.link = `https://www.youtube.com/watch?v=` + newItems[i].resourceId.videoId;
								results.description = " ";
								results.requester = msg.author.id;

								queue.push(results);
								queuedVids.push(results.title);
								if (queue.length === 1) executeQueue(msg, queue);
							};
						};
						function endrun() {
							var qvids = queuedVids.toString().replace(/,/g, '\n');
							var svids = skippedVideos.toString().replace(/,/g, '\n');
							if (qvids.length > 1000) qvids = 'Over character count, replaced...';
							if (svids.length > 1000) svids = 'Over character count, replaced...';

							if (svids != ""){
								msg.channel.send(note('wrap', `Queued:\n${qvids}\nSkipped: (Max Queue)\n${svids}`), {split: true});
							} else {
								msg.channel.send(note('wrap', `Queued:\n${qvids}`), {split: true});
							};
						};
						setTimeout(endrun, 5000);
					});

				})
		  } else {
		    search(searchstring, opts, function(err, results) {
					if (err) {
						if (musicbot.logging) console.log(err);
						const nerr = err.toString().split(':');
						return response.edit(note('fail', `error occoured!\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``));
					};

					// console.log(results[0]);
					results[0].requester = msg.author.id;

					response.edit(note('note', 'Queued: ' + results[0].title)).then(() => {
						queue.push(results[0]);
						// Play if only one element in the queue.
						if (queue.length === 1) executeQueue(msg, queue);
					}).catch(console.log);
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
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music being played.'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		if (!canSkip(msg.member, queue)) return msg.channel.send(note('fail', 'You cannot skip this as you didn\'t queue it.')).then((response) => {
			response.delete(5000);
		});

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
			if (musicbot.logging) console.log(new Error(`Play command error from userID ${msg.author.id} in guildID ${msg.guild.id}\n${e}`));
			return msg.channel.send(note('fail', 'An error occoured, sorry!'));
		};

		msg.channel.send(note('note', 'Skipped ' + toSkip + '!'));
	}

	/**
	 * The command for listing the queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function queue(msg, suffix) {
		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Get the queue text.
		const text = queue.map((video, index) => (
			(index + 1) + ': ' + video.title
		)).join('\n');
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

	/**
	 * The command for pausing the current song.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 * @returns {<promise>} - The response message.
	 */
	function pause(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music being played.'));

		if (!isAdmin(msg.member))
			return msg.channel.send(note('fail', 'You are not authorized to use this.'));

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
		if (isAdmin(msg.member)) {
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.send(note('fail', 'I\'m not in any channel!.'));
			// Clear the queue.
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);

			// End the stream and disconnect.
			voiceConnection.player.dispatcher.end();
			voiceConnection.disconnect();
			msg.channel.send(note('note', 'Left voice channel.'));
		} else {
			msg.channel.send(note('fail', 'You don\'t have permission to use that command!'));
		}
	}

	/**
	 * The command for clearing the song queue.
	 *
	 * @param {Message} msg - Original message.
	 * @param {string} suffix - Command suffix.
	 */
	function clearqueue(msg, suffix) {
		if (isAdmin(msg.member)) {
			const queue = getQueue(msg.guild.id);
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection === null) return msg.channel.send(note('fail', 'I\'m not in any channel!.'));

			queue.splice(0, queue.length);
			msg.channel.send(note('note', 'Queue cleared~'));

			voiceConnection.player.dispatcher.end();
			voiceConnection.disconnect();
		} else {
			msg.channel.send(note('fail', `You don't have permission to use that command! Only admins may!`));
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
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music being played.'));

		if (!isAdmin(msg.member))
			return msg.channel.send(note('fail', 'You are not authorized to use this.'));

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
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
		if (voiceConnection === null) return msg.channel.send(note('fail', 'No music being played.'));

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		if (!canAdjust(msg.member, queue))
			return msg.channel.send(note('fail', 'You are not authorized to use this. Only admins are.'));

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
				if (msg.member.voiceChannel) {
					msg.member.voiceChannel.join().then(connection => {
						resolve(connection);
					}).catch((error) => {
						console.log(error);
					});
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
			msg.channel.send(note('note', 'Now Playing: ' + video.title)).then(() => {
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
			}).catch((error) => {
				console.log(error);
			});
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
			.replace(client.token, 'REMOVEDT');

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
