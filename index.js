/**
 * Original code nexu-dev, https://github.com/nexu-dev/discord.js-music
 * Tweeked by Demise.
 */

const YoutubeDL = require('youtube-dl');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const EventEmitter = require('events');

class Emitter extends EventEmitter {}
const emitter = new Emitter();

/**
 * Takes a discord.js client and turns it into a music bot.
 * Thanks to 'derekmartinez18' for helping.
 *
 * @param {Client} client - The discord.js client.
 * @param {object} options - (All Are Optional) Options to configure the music bot. Acceptable options are:
 * 							prefix: The prefix to use for the commands (default '!').
 * 							global: Whether to use a global queue instead of a server-specific queue (default false).
 * 							maxQueueSize: The maximum queue size (default 20).
 * 							anyoneCanSkip: Allow anybody to skip the song.
 *							anyoneCanAdjust: Allow anyone to adjust volume.
 * 							clearInvoker: Clear the command message.
 * 							volume: The default volume of the player.
 *							helpCmd: Name of the help command (defualt: musichelp).
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
module.exports = function (client, options) {
	// Get all options.
	const PREFIX = (options && options.prefix) || '!';
	const GLOBAL = (options && options.global) || false;
	const MAX_QUEUE_SIZE = parseInt((options && options.maxQueueSize) || 20);
	const DEFAULT_VOLUME = parseInt((options && options.volume) || 50);
	const ALLOW_ALL_SKIP = (options && options.anyoneCanSkip) || false;
	const CLEAR_INVOKER = (options && options.clearInvoker) || false;
	const HELP_CMD = (options && options.helpCmd) || 'musichelp';
	const PLAY_CMD = (options && options.playCmd) || 'play';
	const SKIP_CMD = (options && options.skipCmd) || 'skip';
	const QUEUE_CMD = (options && options.queueCmd) || 'queue';
	const PAUSE_CMD = (options && options.pauseCmd) || 'pause';
	const RESUME_CMD = (options && options.resumeCmd) || 'resume';
	const VOLUME_CMD = (options && options.volumeCmd) || 'volume';
	const LEAVE_CMD = (options && options.leaveCmd) || 'leave';
	const CLEAR_CMD = (options && options.clearCmd) || 'clearqueue';
	const ENABLE_Q_STAT = (options && options.enableQueueStat) || true;
	const ALLOW_ALL_VOL = (options && options.anyoneCanAdjust) || false;

	//PREFIX errors.
	if (typeof PREFIX !== 'string') {
		console.log(new TypeError(`prefix must be a string`));
		process.exit(1);
	};
	if (PREFIX.length < 1 || PREFIX.length > 10) {
		console.log(new RangeError(`prefix length must be between 1 and 10`));
		process.exit(1);
	};

	//GLOBAL errors.
	if (typeof GLOBAL !== 'boolean') {
		console.log(new TypeError(`global must be a boolean`));
		process.exit(1);
	};

	//MAX_QUEUE_SIZE errors.
	if (typeof MAX_QUEUE_SIZE !== 'number') {
		console.log(new TypeError(`maxQueueSize must be a number`));
		process.exit(1);
	};
	if (!Number.isInteger(MAX_QUEUE_SIZE) || MAX_QUEUE_SIZE < 1) {
		console.log(new TypeError(`maxQueueSize must be an integer more than 0`));
		process.exit(1);
	};

	//DEFAULT_VOLUME errors.
	if (typeof DEFAULT_VOLUME !== 'number') {
		console.log(new TypeError(`defaultVolume must be a number`));
		process.exit(1);
	}
	if (!Number.isInteger(DEFAULT_VOLUME) || DEFAULT_VOLUME < 1 || DEFAULT_VOLUME > 200) {
		console.log(new TypeError(`defaultVolume must be an integer between 1 and 200`));
		process.exit(1);
	}
	//ALLOW_ALL_SKIP errors.
	if (typeof ALLOW_ALL_SKIP !== 'boolean') {
		console.log(new TypeError(`anyoneCanSkip must be a boolean`));
		process.exit(1);
	}

	//CLEAR_INVOKER errors.
	if (typeof CLEAR_INVOKER !== 'boolean') {
		console.log(new TypeError(`clearInvoker must be a boolean`));
		process.exit(1);
	}

	//Command name errors.
	if (typeof HELP_CMD !== 'string') {
		console.log(new TypeError(`helpCmd must be a string`));
		process.exit(1);
	}
	if (typeof PLAY_CMD !== 'string') {
		console.log(new TypeError(`playCmd must be a string`));
		process.exit(1);
	}
	if (typeof SKIP_CMD !== 'string') {
		console.log(new TypeError(`skipCmd must be a string`));
		process.exit(1);
	}
	if (typeof QUEUE_CMD !== 'string') {
		console.log(new TypeError(`queueCmd must be a string`));
		process.exit(1);
	}
	if (typeof PAUSE_CMD !== 'string') {
		console.log(new TypeError(`pauseCmd must be a string`));
		process.exit(1);
	}
	if (typeof RESUME_CMD !== 'string') {
		console.log(new TypeError(`resumeCmd must be a string`));
		process.exit(1);
	}
	if (typeof VOLUME_CMD !== 'string') {
		console.log(new TypeError(`volumeCmd must be a string`));
		process.exit(1);
	}
	if (typeof LEAVE_CMD !== 'string') {
		console.log(new TypeError(`leaveCmd must be a string`));
		process.exit(1);
	}
	if (typeof CLEAR_CMD !== 'string') {
		console.log(new TypeError(`clearCmd must be a string`));
		process.exit(1);
	}

	//ENABLE_Q_STAT errors.
	if (typeof ENABLE_Q_STAT !== 'boolean') {
		console.log(new TypeError(`enableQueueStat must be a boolean`));
		process.exit(1);
	}

	//ALLOW_ALL_VOL errors.
	if (typeof ALLOW_ALL_VOL !== 'boolean') {
		console.log(new TypeError(`anyoneCanAdjust must be a boolean`));
		process.exit(1);
	}

	//Misc.
	if (GLOBAL && MAX_QUEUE_SIZE < 50) console.warn(`global queues are enabled while maxQueueSize is below 50! Recommended to use a higher size.`);
	

	// Create an object of queues.
	let queues = {};

	// Catch message events.
	client.on('message', msg => {
		const message = msg.content.trim();

		// Check if the message is a command.
		if (message.toLowerCase().startsWith(PREFIX.toLowerCase())) {
			// Get the command and suffix.
			const command = message.substring(PREFIX.length).split(/[ \n]/)[0].toLowerCase().trim();
			const suffix = message.substring(PREFIX.length + command.length).trim();

			// Process the commands.
			switch (command) {
				case HELP_CMD:
					return musichelp(msg, suffix);
				case PLAY_CMD:
					return play(msg, suffix);
				case SKIP_CMD:
					return skip(msg, suffix);
				case QUEUE_CMD:
					return queue(msg, suffix);
				case PAUSE_CMD:
					return pause(msg, suffix);
				case RESUME_CMD:
					return resume(msg, suffix);
				case VOLUME_CMD:
					return volume(msg, suffix);
				case LEAVE_CMD:
					return leave(msg, suffix);
				case CLEAR_CMD:
					return clearqueue(msg, suffix);
			}
			if (CLEAR_INVOKER) {
				msg.delete();
			}
		}
	});

	/**
	 * Checks if a user is an admin.
	 *
	 * @param {GuildMember} member - The guild member
	 * @returns {boolean} -
	 */
	function isAdmin(member) {
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
		if (ALLOW_ALL_SKIP) return true;
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
		if (ALLOW_ALL_VOL) return true;
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
		if (GLOBAL) server = '_'; // Change to global queue.

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
	 function musichelp(msg, suffix) {
		 if (!suffix) {
			 const embed = new Discord.RichEmbed()
			 .setAuthor("Commands", msg.author.displayAvatarURL)
			 .setDescription(`Commands with a * require Admin perms. Use \`${PREFIX}musichelp command\` for help on usage.`)
			 .addField(HELP_CMD, `Displays this text.`)
			 .addField(PLAY_CMD, `Queue a song by url or search.`)
			 .addField(SKIP_CMD, `Skip a song or mutli songs.`)
			 .addField(QUEUE_CMD, `Shows the current queue`)
			 .addField(PAUSE_CMD, `* Pauses the queue.`)
			 .addField(RESUME_CMD, `* Resume the queue.`)
			 .addField(VOLUME_CMD, `* Adjusts the volume of the bot.`)
			 .addField(LEAVE_CMD, `Leave and clear the queue`)
			 .addField(CLEAR_CMD, `Clears the current queue.`)
			 .setColor(0x27e33d)
			 msg.channel.send({embed});
		 } else {
		 	if (suffix.includes(PLAY_CMD)) {
				const embed = new Discord.RichEmbed()
				.setAuthor(`${PREFIX}${PLAY_CMD}`, client.user.avatarURL)
				.setDescription(`Addes a song to the queue.\n**__Usage:__** ${PREFIX}${PLAY_CMD} URL|search for something.`)
				.setColor(0x27e33d)
				msg.channel.send({embed});
			} else if (suffix.includes(SKIP_CMD)) {
				const embed = new Discord.RichEmbed()
	 		 .setAuthor(`${PREFIX}${SKIP_CMD}`, client.user.avatarURL)
	 		 .setDescription(`Skips the playing song or mutli songs. You must be the person that queued the song to skip it, or admin.\n**__Usage:__** ${PREFIX}${SKIP_CMD} [numer of songs]`)
			 .setColor(0x27e33d)
	 		 msg.channel.send({embed});
		 } else if (suffix.includes(QUEUE_CMD)) {
			 const embed = new Discord.RichEmbed()
			.setAuthor(`${PREFIX}${QUEUE_CMD}`, client.user.avatarURL)
			.setDescription(`Displays the current queue.`)
			.setColor(0x27e33d)
			msg.channel.send({embed});
		} else if (suffix.includes(PAUSE_CMD)) {
			 const embed = new Discord.RichEmbed()
			.setAuthor(`${PREFIX}${PAUSE_CMD}`, client.user.avatarURL)
			.setDescription(`Pauses the current queue.`)
			.setColor(0x27e33d)
			msg.channel.send({embed});
		} else if (suffix.includes(RESUME_CMD)) {
			 const embed = new Discord.RichEmbed()
			.setAuthor(`${PREFIX}${RESUME_CMD}`, client.user.avatarURL)
			.setDescription(`Resumes the current queue if paused.`)
			.setColor(0x27e33d)
			msg.channel.send({embed});
		} else if (suffix.includes(VOLUME_CMD)) {
			 const embed = new Discord.RichEmbed()
			.setAuthor(`${PREFIX}${VOLUME_CMD}`, client.user.avatarURL)
			.setDescription(`Adjusts the streams volume. Must be admin.\n**__Usage:__** ${PREFIX}${VOLUME_CMD} <1 to 200>`)
			.setColor(0x27e33d)
			msg.channel.send({embed});
		} else if (suffix.includes(LEAVE_CMD)) {
			 const embed = new Discord.RichEmbed()
			.setAuthor(`${PREFIX}${LEAVE_CMD}`, client.user.avatarURL)
			.setDescription(`Leaves the voice channel and clears the queue.`)
			.setColor(0x27e33d)
			msg.channel.send({embed});
		} else if (suffix.includes(CLEAR_CMD)) {
			 const embed = new Discord.RichEmbed()
			.setAuthor(`${PREFIX}${CLEAR_CMD}`, client.user.avatarURL)
			.setDescription(`Clears the current queue playing.`)
			.setColor(0x27e33d)
			msg.channel.send({embed});
			} else {
				msg.reply(`${suffix} is not a vlaid command!`)
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
		if (msg.member.voiceChannel === undefined) return msg.channel.send(':musical_note: | You\'re not in a voice channel~');

		// Make sure the suffix exists.
		if (!suffix) return msg.channel.send(':musical_note: | No video specified!');

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		// Check if the queue has reached its maximum size.
		if (queue.length >= MAX_QUEUE_SIZE) {
			return msg.channel.send(':musical_note: | Maximum queue size reached!');
		}

		// Get the video information.
		msg.channel.send(':musical_note: | Searching...').then(response => {
			var searchstring = suffix
			if (!suffix.toLowerCase().startsWith('http')) {
				searchstring = 'gvsearch1:' + suffix;
			}

			YoutubeDL.getInfo(searchstring, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
				// Verify the info.
				if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
					return response.edit(':musical_note: | Invalid video!');
				}

				info.requester = msg.author.id;

				// Queue the video.
				response.edit(':musical_note: | Queued: ' + info.title).then(() => {
					queue.push(info);
					// Play if only one element in the queue.
					if (queue.length === 1) executeQueue(msg, queue);
				}).catch(console.log);
			});
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
		if (voiceConnection === null) return msg.channel.send(':musical_note: | No music being played.');

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		if (!canSkip(msg.member, queue)) return msg.channel.send(':musical_note: | You cannot skip this as you didn\'t queue it.').then((response) => {
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
		const dispatcher = voiceConnection.player.dispatcher;
		if (voiceConnection.paused) dispatcher.resume();
		dispatcher.end();

		msg.channel.send(':musical_note: | Skipped ' + toSkip + '!');
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

		if (ENABLE_Q_STAT) {
			//Get the status of the queue.
			let queueStatus = 'Stopped';
			const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
			if (voiceConnection !== null) {
				const dispatcher = voiceConnection.player.dispatcher;
				queueStatus = dispatcher.paused ? 'Paused' : 'Playing';
			}

			// Send the queue and status.
			msg.channel.send(':musical_note: | Queue ('+ queueStatus +'):\n' + text);
		} else {
			msg.channel.send(':musical_note: | Queue:\n' + text);
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
		if (voiceConnection === null) return msg.channel.send(':musical_note: | No music being played.');

		if (!isAdmin(msg.member))
			return msg.channel.send(':musical_note: | You are not authorized to use this.');

		// Pause.
		msg.channel.send(':musical_note: | Playback paused.');
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
			if (voiceConnection === null) return msg.channel.send(':musical_note: | I\'m not in any channel!.');
			// Clear the queue.
			const queue = getQueue(msg.guild.id);
			queue.splice(0, queue.length);

			// End the stream and disconnect.
			voiceConnection.player.dispatcher.end();
			voiceConnection.disconnect();
		} else {
			msg.channel.send(':musical_note: | You don\'t have permission to use that command!');
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

			queue.splice(0, queue.length);
			msg.channel.send(':musical_note: | Queue cleared~');
		} else {
			msg.channel.send(':musical_note: | You don\'t have permission to use that command! Only admins may!');
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
		if (voiceConnection === null) return msg.channel.send(':musical_note: | No music being played.');

		if (!isAdmin(msg.member))
			return msg.channel.send(':musical_note: | You are not authorized to use this.');

		// Resume.
		msg.channel.send(':musical_note: | Playback resumed.');
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
		if (voiceConnection === null) return msg.channel.send(':musical_note: | No music being played.');

		// Get the queue.
		const queue = getQueue(msg.guild.id);

		if (!canAdjust(msg.member, queue))
			return msg.channel.send(':musical_note: | You are not authorized to use this. Only admins are.');

		// Get the dispatcher
		const dispatcher = voiceConnection.player.dispatcher;

		if (suffix > 200 || suffix < 0) return msg.channel.send(':musical_note: | Volume out of range!').then((response) => {
			response.delete(5000);
		});

		msg.channel.send(":musical_note: | Volume set to " + suffix);
		dispatcher.setVolume((suffix/100));
	}

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
			msg.channel.send(':musical_note: | Playback finished.');

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
			msg.channel.send(':musical_note: | Now Playing: ' + video.title).then(() => {

				// const stream = require('youtube-audio-stream')
				// let dispatcher = connection.playStream(stream(video.webpage_url))
				// let volumeNum = DEFAULT_VOLUME / 100;
				// let dispatcher = connection.playStream(ytdl(video.webpage_url, {filter: 'audioonly'}));
				// let dispatcher = connection.playStream(ytdl(video.webpage_url), {highWaterMark: 163840, retries: 100}, {seek: 1, volume: (DEFAULT_VOLUME/100)});
				// let dispatcher = connection.playStream(ytdl(video.webpage_url), {seek: 0, volume: (DEFAULT_VOLUME/100)});
				//The above is me trying to fix the issue of stopping in the middle of a song.
				//Removing the "aduioonly" filter and changing seek to 1 seemed to fix it.

				let dispatcher = connection.playStream(ytdl(video.webpage_url), {seek: 1, volume: (DEFAULT_VOLUME/100)});

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
						if (queue.length > 0) {
							// Remove the song from the queue.
							queue.shift();
							// Play the next song in the queue.
							executeQueue(msg, queue);
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
}
