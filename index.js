/*
 * Original code from nexu-dev, https://github.com/nexu-dev/discord.js-client
 * Newly edited by Darko Pendragon (Demise).
 * Other Credits:
 * - Erik Rodabaugh.
 * - mcao.
 * - Naz (BluSpring).
 * - MatthewJ217.
 */

const ytdl = require('ytdl-core');
const {YTSearcher} = require('ytsearcher');
const ypi = require('youtube-playlist-info');
const Discord = require('discord.js');
const PACKAGE = require('./package.json');

/*
 * Takes a discord.js client and turns it into a music bot.
 * Extra thanks to Rodabaugh (Erik) for helping with some tweaks and ideas.
 *
 * @param {Client} client - The discord.js client.
 * @param {object} options - Options to configure the client bot.
 */

exports.start = (client, options) => {
  class Music {
    constructor(client, options) {
      this.commands = new Map();
      this.aliases = new Map();
      this.youtubeKey = (options && options.youtubeKey);
      this.botPrefix = (options && options.prefix) || '!';
      this.embedColor = (options && options.embedColor) || 'GREEN';
      this.thumbnailType = (options && options.thumbnailType) || "high";
      this.anyoneCanLeave = Boolean((options && options.anyoneCanLeave) || false);
      this.global = (options && options.global) || false;
      this.maxQueueSize = parseInt((options && options.maxQueueSize) || 100);
      this.defVolume = parseInt((options && options.defVolume) || 50);
      this.anyoneCanSkip = Boolean((options && options.anyoneCanSkip) || false);
      this.clearInvoker = Boolean((options && options.clearInvoker) || false);
      this.helpCmd = (options && options.helpCmd) || 'musichelp';
      this.disableHelp = Boolean((options && options.disableHelp) || false);
      this.helpHelp = (options && options.helpHelp) || "Shows help for commands.";
      this.helpAlt = (options && options.helpAlt) || [];
      this.playCmd = (options && options.playCmd) || 'play';
      this.disablePlay = Boolean((options && options.disablePlay) || false);
      this.playHelp = (options && options.playHelp) || "Queue a song/playlist by URL or search for a song.";
      this.playAlt = (options && options.playAlt) || [];
      this.skipCmd = (options && options.skipCmd) || 'skip';
      this.disableSkip = Boolean((options && options.disableSkip) || false);
      this.skipHelp = (options && options.skipHelp) || "Skip a song or multi songs.";
      this.skipAlt = (options && options.skipAlt) || [];
      this.joinCmd = (options && options.joinCmd) || 'join';
      this.disableJoin = Boolean((options && options.disableJoin) || false);
      this.joinHelp = (options && options.joinHelp) || "Join your current voice channel.";
      this.joinAlt = (options && options.joinAlt) || [];
      this.queueCmd = (options && options.queueCmd) || 'queue';
      this.disableQueue = Boolean((options && options.disableQueue) || false);
      this.queueHelp = (options && options.queueHelp) || "Shows the current queue.";
      this.queueAlt = (options && options.queueAlt) || [];
      this.pauseCmd = (options && options.pauseCmd) || 'pause';
      this.pauseHelp = (options && options.pauseHelp) || "Pauses the queue.";
      this.disablePause = Boolean((options && options.disablePause) || false);
      this.pauseAlt = (options && options.pauseAlt) || [];
      this.resumeCmd = (options && options.resumeCmd) || 'resume';
      this.disableResume = Boolean((options && options.disableResume) || false);
      this.resumeHelp = (options && options.resumeHelp) || "Resume the queue.";
      this.resumeAlt = (options && options.resumeAlt) || [];
      this.volumeCmd = (options && options.volumeCmd) || 'volume';
      this.disableVolume = Boolean((options && options.disableVolume) || false);
      this.volumeHelp = (options && options.volumeHelp) || "Adjusts the volume of the bot.";
      this.volumeAlt = (options && options.volumeAlt) || [];
      this.leaveCmd = (options && options.leaveCmd) || 'leave';
      this.disableLeave = Boolean((options && options.disableLeave) || false);
      this.leaveHelp = (options && options.leaveHelp) || "Leave and clear the queue.";
      this.leaveAlt = (options && options.leaveAlt) || [];
      this.clearCmd = (options && options.clearCmd) || 'clearqueue';
      this.disableClear = Boolean((options && options.disableClear) || false);
      this.clearHelp = (options && options.clearHelp) || "Clears the current queue.";
      this.clearAlt = (options && options.clearAlt) || [];
      this.searchCmd = (options && options.searchCmd) || 'search';
      this.disableSearch = Boolean((options && options.disableSearch) || false);
      this.searchHelp = (options && options.searchHelp) || "Searchs for up to 10 results.";
      this.searchAlt = (options && options.searchAlt) || [];
      this.loopCmd = (options && options.loopCmd) || 'loop';
      this.disableLoop = Boolean((options && options.disableLoop) || false);
      this.loopHelp = (options && options.loopHelp) || "Changes the loop state.";
      this.loopAlt = (options && options.loopAlt) || [];
      this.setCmd = (options && options.setCmd) || 'set';
      this.disableSet = Boolean((options && options.disableSet) || false);
      this.setHelp = (options && options.setHelp) || "Changes settings for the server. Use without specifing a setting to see valid settings.";
      this.setAlt = (options && options.setAlt) || [];
      this.ownerCmd = (options && options.ownerCmd) || 'owner';
      this.disableOwnerCmd = Boolean((options && options.disableOwnerCmd) || false);
      this.ownerHelp = (options && options.ownerHelp) || "Owner commands and functions.";
      this.ownerAlt = (options && options.ownerAlt) || [];
      this.npCmd = (options && options.npCmd) || 'np';
      this.disableNp = Boolean((options && options.disableNp) || false);
      this.npHelp = (options && options.npHelp) || "Shows the currently playing song.";
      this.npAlt = (options && options.npAlt) || [];
      this.enableQueueStat = Boolean((options && options.enableQueueStat) || false);
      this.anyoneCanAdjust = Boolean((options && options.anyoneCanAdjust) || false);
      this.ownerOverMember = Boolean((options && options.ownerOverMember) || false);
      this.botOwner = (options && options.botOwner) || null;
      this.logging = Boolean((options && options.logging) || false);
      this.enableAliveMessage = Boolean((options && options.enableAliveMessage) || false);
      this.aliveMessage = (options && options.aliveMessage) || "";
      this.aliveMessageTime = parseInt((options && options.aliveMessageTime) || 600000);
      this.requesterName = Boolean((options && options.requesterName) || false);
      this.inlineEmbeds = Boolean((options && options.inlineEmbeds) || false);
      this.maxWait = parseInt((options && options.maxWait) || 15000);
      this.anyoneCanPause = Boolean((options && options.anyoneCanPause) || true);
      this.dateLocal = (options && options.dateLocal) || 'en-US';
      this.clearOnLeave = (options && options.clearOnLeave) || false;
      this.checkQueues = (options && options.checkQueues) || false;
      this.queues = new Map();
      this.botPrefixs = new Map();
      this.advancedMode = (options && options.advancedMode) || {};
      this.botAdmins = (options && options.botAdmins) || [];
    }

    logger(cmd, msg, text) {
      console.log(`[${cmd}] [${msg.guild.name}] ${text}`);
    }
  }

  var musicbot = new Music(client, options);
  exports.bot = musicbot;

  if (musicbot.advancedMode && musicbot.advancedMode.enabled) {
    musicbot.advancedMode = {
      enabled: Boolean((options && options.advancedMode.enabled) || false),
      multiPrefix: Boolean((options && options.advancedMode.multiPrefix) || false),
      serverPrefixs: (options && options.advancedMode.serverPrefixs) || {}
    };
  };

  async function musicBotStart() {
		if (process.version.slice(1)
	    .split('.')[0] < 8) {
	    console.error(new Error(`[MusicBot] node 8 or higher is needed, please update`));
	    process.exit(1);
	  }

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
      musicbot.disableSearch &&
      musicbot.disableVolume) {
      console.error(new Error(`all commands disabled`));
      process.exit(1);
    }

    if (typeof musicbot.embedColor !== 'object' && typeof musicbot.embedColor !== 'number' && typeof musicbot.embedColor !== 'string') {
      console.error(new TypeError(`embedColor must be an object (array), number, or a string`));
      process.exit(1);
    }

    if (typeof musicbot.botAdmins !== 'object') {
      console.error(new TypeError(`botAdmins must be an object (array)`));
      process.exit(1);
    }
    if (typeof musicbot.clearOnLeave !== 'boolean') {
      console.error(new TypeError(`clearOnLeave must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.checkQueues !== 'boolean') {
      console.error(new TypeError(`checkQueues must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.dateLocal !== 'string') {
      console.error(new TypeError(`dateLocal must be a string`));
      process.exit(1);
    }
    if (typeof musicbot.advancedMode !== 'object') {
      console.error(new TypeError(`advancedMode must be an object`));
      process.exit(1);
    }
    if (musicbot.advancedMode.enabled && typeof musicbot.advancedMode.enabled !== 'boolean') {
      console.error(new TypeError(`advancedMode.enabled must be a boolean`));
      process.exit(1);
    }
    if (musicbot.advancedMode.multiPrefix && typeof musicbot.advancedMode.multiPrefix !== 'boolean') {
      console.error(new TypeError(`advancedMode.multiPrefix must be a boolean`));
      process.exit(1);
    }
    if (musicbot.advancedMode.serverPrefixs && typeof musicbot.advancedMode.serverPrefixs !== 'object') {
      console.error(new TypeError(`advancedMode.serverPrefixs must be an object`));
      process.exit(1);
    }

    if (typeof musicbot.thumbnailType !== 'string') {
      console.error(new TypeError(`thumbnailType must be a string`));
      process.exit(1);
    };
    if (!musicbot.thumbnailType.match(/default|medium|high/)) {
      console.error(new Error(`thumbnailType must be one of the following: default, medium, high`));
      process.exit(1);
    };
    if (typeof musicbot.helpHelp !== 'string') {
      console.error(new TypeError(`helpHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.helpAlt !== 'object') {
      console.error(new TypeError(`helpAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.playHelp !== 'string') {
      console.error(new TypeError(`playHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.playAlt !== 'object') {
      console.error(new TypeError(`playAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.queueHelp !== 'string') {
      console.error(new TypeError(`queueHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.queueAlt !== 'object') {
      console.error(new TypeError(`queueAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.pauseHelp !== 'string') {
      console.error(new TypeError(`pauseHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.pauseAlt !== 'object') {
      console.error(new TypeError(`pauseAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.resumeHelp !== 'string') {
      console.error(new TypeError(`resumeHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.resumeAlt !== 'object') {
      console.error(new TypeError(`resumeAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.volumeHelp !== 'string') {
      console.error(new TypeError(`volumeHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.volumeAlt !== 'object') {
      console.error(new TypeError(`volumeAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.leaveHelp !== 'string') {
      console.error(new TypeError(`leaveHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.leaveAlt !== 'object') {
      console.error(new TypeError(`leaveAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.clearHelp !== 'string') {
      console.error(new TypeError(`clearHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.clearAlt !== 'object') {
      console.error(new TypeError(`clearAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.loopHelp !== 'string') {
      console.error(new TypeError(`loopHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.loopAlt !== 'object') {
      console.error(new TypeError(`loopAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.npHelp !== 'string') {
      console.error(new TypeError(`npHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.npAlt !== 'object') {
      console.error(new TypeError(`npAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.ownerHelp !== 'string') {
      console.error(new TypeError(`ownerHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.ownerAlt !== 'object') {
      console.error(new TypeError(`ownerAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.skipHelp !== 'string') {
      console.error(new TypeError(`skipHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.skipAlt !== 'object') {
      console.error(new TypeError(`skipAlt must be an array`));
      process.exit(1);
    };
    if (!musicbot.youtubeKey) {
      console.error(new Error(`youtubeKey is required but missing`));
      process.exit(1);
    };
    if (musicbot.youtubeKey && typeof musicbot.youtubeKey !== 'string') {
      console.error(new TypeError(`youtubeKey must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.disableHelp !== 'boolean') {
      console.error(new TypeError(`disableHelp must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disablePlay !== 'boolean') {
      console.error(new TypeError(`disablePlay must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disableSkip !== 'boolean') {
      console.error(new TypeError(`disableSkip must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disableQueue !== 'boolean') {
      console.error(new TypeError(`disableQueue must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disablePause !== 'boolean') {
      console.error(new TypeError(`disablePause must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disableResume !== 'boolean') {
      console.error(new TypeError(`disableResume must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disableLeave !== 'boolean') {
      console.error(new TypeError(`disableLeave must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disableClear !== 'boolean') {
      console.error(new TypeError(`disableClear must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disableLoop !== 'boolean') {
      console.error(new TypeError(`disableLoop must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disableNp !== 'boolean') {
      console.error(new TypeError(`disableNp must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.disableOwnerCmd !== 'boolean') {
      console.error(new TypeError(`disableOwnerCmd must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.ownerCmd !== 'string') {
      console.error(new TypeError(`ownerCmd must be a string`));
      process.exit(1);
    }
    if (typeof musicbot.ownerOverMember !== 'boolean') {
      console.error(new TypeError(`ownerOverMember must be a boolean`));
      process.exit(1);
    };
    if (musicbot.ownerOverMember && typeof musicbot.botOwner !== 'string') {
      console.error(new TypeError(`botOwner must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.botPrefix !== 'string') {
      console.error(new TypeError(`prefix must be a string`));
      process.exit(1);
    };
    if (musicbot.botPrefix.length < 1 || musicbot.botPrefix.length > 10) {
      console.error(new RangeError(`prefix length must be between 1 and 10`));
      process.exit(1);
    };
    if (typeof musicbot.global !== 'boolean') {
      console.error(new TypeError(`global must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.maxQueueSize !== 'number') {
      console.error(new TypeError(`maxQueueSize must be a number`));
      process.exit(1);
    };
    if (!Number.isInteger(musicbot.maxQueueSize)) {
      console.error(new TypeError(`maxQueueSize must be an integer`));
      process.exit(1);
    };
    if (typeof musicbot.defVolume !== 'number') {
      console.error(new TypeError(`defaultVolume must be a number`));
      process.exit(1);
    };
    if (!Number.isInteger(musicbot.defVolume) || musicbot.defVolume < 1 || musicbot.defVolume > 200) {
      console.error(new TypeError(`defaultVolume must be an integer between 1 and 200`));
      process.exit(1);
    };
    if (typeof musicbot.anyoneCanSkip !== 'boolean') {
      console.error(new TypeError(`anyoneCanSkip must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.clearInvoker !== 'boolean') {
      console.error(new TypeError(`clearInvoker must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.enableAliveMessage !== 'boolean') {
      console.error(new TypeError(`enableAliveMessage must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.aliveMessage !== 'string') {
      console.error(new TypeError(`aliveMessage must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.aliveMessageTime !== 'number') {
      console.error(new TypeError(`aliveMessageTime must be a number`));
      process.exit(1);
    };
    if (typeof musicbot.helpCmd !== 'string') {
      console.error(new TypeError(`helpCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.playCmd !== 'string') {
      console.error(new TypeError(`playCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.searchCmd !== 'string') {
      console.error(new TypeError(`searchCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.disableSearch !== 'boolean') {
      console.error(new TypeError(`disableSearch must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.skipCmd !== 'string') {
      console.error(new TypeError(`skipCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.queueCmd !== 'string') {
      console.error(new TypeError(`queueCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.pauseCmd !== 'string') {
      console.error(new TypeError(`pauseCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.npCmd !== 'string') {
      console.error(new TypeError(`npCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.resumeCmd !== 'string') {
      console.error(new TypeError(`resumeCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.volumeCmd !== 'string') {
      console.error(new TypeError(`volumeCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.leaveCmd !== 'string') {
      console.error(new TypeError(`leaveCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.clearCmd !== 'string') {
      console.error(new TypeError(`clearCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.loopCmd !== 'string') {
      console.error(new TypeError(`loopCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.enableQueueStat !== 'boolean') {
      console.error(new TypeError(`enableQueueStat must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.anyoneCanAdjust !== 'boolean') {
      console.error(new TypeError(`anyoneCanAdjust must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.logging !== 'boolean') {
      console.error(new TypeError(`logging must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.requesterName !== 'boolean') {
      console.error(new TypeError(`requesterName must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.inlineEmbeds !== 'boolean') {
      console.error(new TypeError(`inlineEmbeds must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.joinCmd !== "string") {
      console.error(new TypeError(`joinCmd must be a string`));
      process.exit(1);
    }
    if (typeof musicbot.disableJoin !== "boolean") {
      console.error(new TypeError(`disableJoin must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.joinAlt !== "object") {
      console.error(new TypeError(`joinAlt must be an object (array)`));
      process.exit(1);
    }
    if (typeof musicbot.joinHelp !== "string") {
      console.error(new TypeError(`joinHelp must be a string`));
      process.exit(1);
    }
    if (musicbot.global && musicbot.maxQueueSize < 50) console.warn(`global queues are enabled while maxQueueSize is below 50! Recommended to use a higher size.`);

    // Set those commands, baby.
    try {
      if (!musicbot.commands.has(musicbot.helpCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.helpCmd} command.`);
        const help_props = {
          name: musicbot.helpCmd,
          usage: `${musicbot.botPrefix}${musicbot.helpCmd} [command]`,
          disabled: musicbot.disableHelp,
          help: musicbot.helpHelp,
          aliases: musicbot.helpAlt,
          admin: false,
          run: "musichelp"
        };
        musicbot.commands.set(musicbot.helpCmd, help_props);

        if (musicbot.helpAlt.length > 0) {
          musicbot.helpAlt.forEach(alt => {
            musicbot.aliases.set(alt, help_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.searchCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.searchCmd} command.`);
        const search_props = {
          name: musicbot.searchCmd,
          usage: `${musicbot.botPrefix}${musicbot.searchCmd} <query>`,
          disabled: musicbot.disableSearch,
          help: musicbot.searchHelp,
          aliases: musicbot.searchAlt,
          admin: false,
          run: "search"
        };
        musicbot.commands.set(musicbot.searchCmd, search_props);

        if (musicbot.searchAlt.length > 0) {
          musicbot.searchAlt.forEach(alt => {
            musicbot.aliases.set(alt, search_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.playCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.playCmd} command.`);
        const play_props = {
          name: musicbot.playCmd,
          usage: `${musicbot.botPrefix}${musicbot.playCmd} <song to queue>`,
          disabled: musicbot.disablePlay,
          help: musicbot.playHelp,
          aliases: musicbot.playAlt,
          admin: false,
          run: "play"
        };
        musicbot.commands.set(musicbot.playCmd, play_props);

        if (musicbot.playAlt.length > 0) {
          musicbot.playAlt.forEach(alt => {
            musicbot.aliases.set(alt, play_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.skipCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.skipCmd} command.`);
        const skip_props = {
          name: musicbot.skipCmd,
          usage: `${musicbot.botPrefix}${musicbot.skipCmd} [numberOfSongs]`,
          disabled: musicbot.disableSkip,
          help: musicbot.skipHelp,
          aliases: musicbot.skipAlt,
          admin: true,
          run: "skip"
        };
        musicbot.commands.set(musicbot.skipCmd, skip_props);

        if (musicbot.skipAlt.length > 0) {
          musicbot.skipAlt.forEach(alt => {
            musicbot.aliases.set(alt, skip_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.queueCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.queueCmd} command.`);
        const queue_props = {
          name: musicbot.queueCmd,
          usage: `${musicbot.botPrefix}${musicbot.queueCmd} [songNumber]`,
          disabled: musicbot.disableQueue,
          help: musicbot.queueHelp,
          aliases: musicbot.queueAlt,
          admin: false,
          run: "queue"
        };
        musicbot.commands.set(musicbot.queueCmd, queue_props);

        if (musicbot.queueAlt.length > 0) {
          musicbot.queueAlt.forEach(alt => {
            musicbot.aliases.set(alt, queue_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.pauseCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.pauseCmd} command.`);
        const pause_props = {
          name: musicbot.pauseCmd,
          usage: null,
          disabled: musicbot.disablePause,
          help: musicbot.pauseHelp,
          aliases: musicbot.pauseAlt,
          admin: false,
          run: "pause"
        };
        musicbot.commands.set(musicbot.pauseCmd, pause_props);

        if (musicbot.pauseAlt.length > 0) {
          musicbot.pauseAlt.forEach(alt => {
            musicbot.aliases.set(alt, pause_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.resumeCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.resumeCmd} command.`);
        const resume_props = {
          name: musicbot.resumeCmd,
          usage: null,
          disabled: musicbot.disableResume,
          help: musicbot.resumeHelp,
          aliases: musicbot.resumeAlt,
          admin: false,
          run: "resume"
        };
        musicbot.commands.set(musicbot.resumeCmd, resume_props);

        if (musicbot.resumeAlt.length > 0) {
          musicbot.resumeAlt.forEach(alt => {
            musicbot.aliases.set(alt, resume_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.volumeCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.volumeCmd} command.`);
        const volume_props = {
          name: musicbot.volumeCmd,
          usage: `${musicbot.botPrefix}${musicbot.volumeCmd} <1 - 200>`,
          disabled: musicbot.disableVolume,
          help: musicbot.volumeHelp,
          aliases: musicbot.volumeAlt,
          admin: false,
          run: "volume"
        };
        musicbot.commands.set(musicbot.volumeCmd, volume_props);

        if (musicbot.volumeAlt.length > 0) {
          musicbot.volumeAlt.forEach(alt => {
            musicbot.aliases.set(alt, volume_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.clearCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.clearCmd} command.`);
        const clear_props = {
          name: musicbot.clearCmd,
          usage: null,
          disabled: musicbot.disableClear,
          help: musicbot.clearHelp,
          aliases: musicbot.clearAlt,
          admin: false,
          run: "clearqueue"
        };
        musicbot.commands.set(musicbot.clearCmd, clear_props);

        if (musicbot.clearAlt.length > 0) {
          musicbot.clearAlt.forEach(alt => {
            musicbot.aliases.set(alt, clear_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.npCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.npCmd} command.`);
        const np_props = {
          name: musicbot.npCmd,
          usage: null,
          disabled: musicbot.disableNp,
          help: musicbot.npHelp,
          aliases: musicbot.npAlt,
          admin: false,
          run: "np"
        };
        musicbot.commands.set(musicbot.npCmd, np_props);

        if (musicbot.npAlt.length > 0) {
          musicbot.npAlt.forEach(alt => {
            musicbot.aliases.set(alt, np_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.leaveCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.leaveCmd} command.`);
        const leave_props = {
          name: musicbot.leaveCmd,
          usage: null,
          disabled: musicbot.disableLeave,
          help: musicbot.leaveHelp,
          aliases: musicbot.leaveAlt,
          admin: false,
          run: "leave"
        };
        musicbot.commands.set(musicbot.leaveCmd, leave_props);

        if (musicbot.leaveAlt.length > 0) {
          musicbot.leaveAlt.forEach(alt => {
            musicbot.aliases.set(alt, leave_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.loopCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.loopCmd} command.`);
        const loop_props = {
          name: musicbot.loopCmd,
          usage: null,
          disabled: musicbot.disableLoop,
          help: musicbot.loopHelp,
          aliases: musicbot.loopAlt,
          admin: false,
          run: "loop"
        };
        musicbot.commands.set(musicbot.loopCmd, loop_props);

        if (musicbot.loopAlt.length > 0) {
          musicbot.loopAlt.forEach(alt => {
            musicbot.aliases.set(alt, loop_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.setCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.setCmd} command.`);
        const set_props = {
          name: musicbot.setCmd,
          usage: `${musicbot.botPrefix}${musicbot.setCmd} <setting>`,
          disabled: musicbot.disableSet,
          help: musicbot.setHelp,
          aliases: musicbot.setAlt,
          admin: false,
          run: "set"
        };
        musicbot.commands.set(musicbot.setCmd, set_props);

        if (musicbot.setAlt.length > 0) {
          musicbot.setAlt.forEach(alt => {
            musicbot.aliases.set(alt, set_props);
          });
        };

      };
      if (!musicbot.commands.has(musicbot.joinCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.joinCmd} command.`);
        const join_props = {
          name: musicbot.joinCmd,
          usage: `${musicbot.botPrefix}${musicbot.joinCmd}`,
          disabled: musicbot.disableJoin,
          help: musicbot.joinHelp,
          aliases: musicbot.joinAlt,
          admin: false,
          run: "join"
        };
        musicbot.commands.set(musicbot.joinCmd, join_props);

        if (musicbot.joinAlt.length > 0) {
          musicbot.setAlt.forEach(alt => {
            musicbot.aliases.set(alt, join_props);
          });
        };

      };
    } catch (e) {
      console.error(e.stack);
      process.exit(1);
    };
  };
  musicBotStart();

  //Set the YouTube API key.
  musicbot.searcher = new YTSearcher({
    key: musicbot.youtubeKey,
    revealkey: true
  });

  exports.changeKey = (key) => {
    return new Promise((resolve, reject) => {
      if (!key || typeof key !== "string") reject("invalid key provided");
      musicbot.youtubeKey = key;
      musicbot.searcher = new YTSearcher({
        key: key,
        revealkey: true
      });
      resolve(musicbot);
    });
  };

  // Catch message events.
  client.on('message', msg => {
    const message = msg.content.trim();

    if (musicbot.advancedMode.enabled && musicbot.advancedMode.multiPrefix) {
      if (musicbot.botPrefixs.has(msg.guild.id)) {
        // Get the custom prefix.
        const prefix = musicbot.botPrefixs.get(msg.guild.id)
          .prefix;
        if (!message.startsWith(prefix)) return;

        // Get the command, suffix.
        const command = message.substring(prefix.toString()
            .length)
          .split(/[ \n]/)[0].trim();
        const suffix = message.substring(prefix.toString()
            .length + command.length)
          .trim();
        const args = message.slice(prefix.toString()
            .length + command.length)
          .trim()
          .split(/ +/g);

        // Process the commands.
        if (musicbot.commands.has(command)) {
          let tCmd = musicbot.commands.get(command);
          if (!tCmd.disabled) return musicbot[tCmd.run](msg, suffix, args);
        } else if (musicbot.aliases.has(command)) {
          let aCmd = musicbot.aliases.get(command);
          if (!aCmd.disabled) return musicbot[aCmd.run](msg, suffix, args);
        };
      } else if (message.startsWith(musicbot.botPrefix)) {
        // Get the command, suffix.
        const command = message.substring(musicbot.botPrefix.length)
          .split(/[ \n]/)[0].trim();
        const suffix = message.substring(musicbot.botPrefix.length + command.length)
          .trim();
        const args = message.slice(musicbot.botPrefix.length + command.length)
          .trim()
          .split(/ +/g);

        // Process the commands.
        if (musicbot.commands.has(command)) {
          let tCmd = musicbot.commands.get(command);
          if (!tCmd.disabled) return musicbot[tCmd.run](msg, suffix, args);
        } else if (musicbot.aliases.has(command)) {
          let aCmd = musicbot.aliases.get(command);
          if (!aCmd.disabled) return musicbot[aCmd.run](msg, suffix, args);
        };
      };
    } else if (message.startsWith(musicbot.botPrefix)) {
      // Get the command, suffix.
      const command = message.substring(musicbot.botPrefix.length)
        .split(/[ \n]/)[0].trim();
      const suffix = message.substring(musicbot.botPrefix.length + command.length)
        .trim();
      const args = message.slice(musicbot.botPrefix.length + command.length)
        .trim()
        .split(/ +/g);

      // Process the commands.
      if (musicbot.commands.has(command)) {
        let tCmd = musicbot.commands.get(command);
        if (!tCmd.disabled) return musicbot[tCmd.run](msg, suffix, args);
      } else if (musicbot.aliases.has(command)) {
        let aCmd = musicbot.aliases.get(command);
        if (!aCmd.disabled) return musicbot[aCmd.run](msg, suffix, args);
      };
    };
  });

  // Client ready event for some extra stuff.
  client.on("ready", () => {

    if (musicbot.advancedMode && musicbot.advancedMode.enabled === true) {
      if (musicbot.advancedMode && musicbot.advancedMode.multiPrefix === true) {
        if (typeof musicbot.advancedMode.serverPrefixs === 'object') {
          client.guilds.forEach(server => {
            if (musicbot.advancedMode.serverPrefixs.has(server.id)) {
              var thisServer = musicbot.advancedMode.serverPrefixs.get(server.id)
              let props = {
                id: server.id,
                prefix: thisServer.prefix
              };
              musicbot.botPrefixs.set(server.id, props);
            } else {
              let props = {
                id: server.id,
                prefix: musicbot.botPrefix
              };
              musicbot.botPrefixs.set(server.id, props);
            };
          });
        };
      };
    };

    if (musicbot.enableAliveMessage) {
      setInterval(function liveMessage() {
        if (musicbot.aliveMessage.length < 3) {
          musicbot.aliveMessage = `----------------------------------\n${client.user.username} online since ${client.readyAt}!\n----------------------------------`;
        } else {
          musicbot.aliveMessage = musicbot.aliveMessage.replace(/{{username}}/g, `${client.user.username}`)
            .replace(/{{starttime}}/g, `${client.readyAt}`);
        }
        console.log(musicbot.aliveMessage);
      }, musicbot.aliveMessageTime);
    };
    console.log(`------- ${client.user.username} -------\n> Version: ${PACKAGE.version}\n> Extra Logging: ${musicbot.logging}.\n> Using Global Queue: ${musicbot.global}.\n> Node.js Version: ${process.version}\n------- ${client.user.username} -------`);
    if (!musicbot.enableQueueStat) console.log(`[MUSIC] enableQueueStat is 'false'. Queue will not have a Playing/Paused indicator.`);

    if (musicbot.checkQueues == true) {
      console.warn(`[MUSIC] checkQueues is enabled.`);

      musicbot.verify = (q) => {
        return new Promise((resolve, reject) => {
          if (!q) reject(0);
          else if (q && q.songs == null) reject(1);
          else if (q && q.songs.length > musicbot.maxQueueSize && musicbot.maxQueueSize !== 0) reject(1);
          else if (q && q.songs.length < 0) reject(1);
          else if (q && typeof q.loop !== "string") reject(2);
          else if (q && !q.id) reject(3);

          q.songs.forEach(song => {
            if (!song.title || !song.url || !song.queuedOn || !song.requester) reject(4);
          })

          resolve("pass");
        });
      };
      exports.verifyQueue = musicbot.verify;
      setInterval(() => {

        musicbot.queues.forEach(queue => {
          musicbot.verify(queue).then((res) => {
            if (musicbot.logging) console.log(`[Check Queues Music] Queue ${queue.id} passed verification.`);
          }).catch((res) => {
            if (res >= 0) {
              let prop = {
                songs: [],
                last: null,
                loop: "none",
                id: `${queue.toString()}`
              };
              musicbot.queues.set(queue.id, prop)
            };

            try {
              const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == `${queue.toString()}`);
              if (voiceConnection !== null) {
                voiceConnection.player.dispatcher.end();
                voiceConnection.disconnect();
              };
            } catch (e) {
              console.error(e);
            };
          })
        })
      }, 3600000)
    }
  });

  musicbot.updatePrefix = (server, prefix) => {
    if (musicbot && musicbot.advancedMode.enabled && musicbot.advancedMode.multiPrefix) {
      return new Promise((resolve, reject) => {
        if (typeof server !== 'string') reject(`server was not a string`);
        if (typeof prefix !== 'string') reject(`prefix was not a string`);

        let props;
        if (musicbot.botPrefixs.has(server)) {
          props = musicbot.botPrefixs.get(server);
          props.prefix = prefix;
          musicbot.botPrefixs.set(server, props);
          resolve(`Prefix updated to \`${prefix}\`!`);
        } else {
          let props = {
            id: server,
            prefix: prefix
          };
          musicbot.botPrefixs.set(server, props);
          resolve(`Prefix updated to \`${prefix}\`!`);
        }
      })
    };
  };
  exports.updatePrefix = musicbot.updatePrefix;

  /**
   * Checks if a user is an admin.
   *
   * @param {GuildMember} member - The guild member
   * @returns {boolean} - If the user is admin.
   */
  musicbot.isAdmin = (member) => {
    if (musicbot.ownerOverMember && member.id === musicbot.botOwner) return true;
    if (musicbot.botAdmins.includes(member.id)) return true;
    return member.hasPermission("ADMINISTRATOR");
  };

  /**
   * Checks if the user can skip the song.
   *
   * @param {GuildMember} member - The guild member
   * @param {array} queue - The current queue
   * @returns {boolean} - If the user can skip
   */
  musicbot.canSkip = (member, queue) => {
    if (musicbot.anyoneCanSkip) return true;
    else if (musicbot.botAdmins.includes(member.id)) return true;
    else if (musicbot.ownerOverMember && member.id === musicbot.botOwner) return true;
    else if (queue[0].requester === member.id) return true;
    else if (musicbot.isAdmin(member)) return true;
    else return false;
  };

  /**
   * Checks if the user can adjust volume.
   *
   * @param {GuildMember} member - The guild member
   * @param {array} queue - The current queue
   * @returns {boolean} - If the user can adjust
   */
  musicbot.canAdjust = (member, queue) => {
    if (musicbot.anyoneCanAdjust) return true;
    else if (musicbot.botAdmins.includes(member.id)) return true;
    else if (musicbot.ownerOverMember && member.id === musicbot.botOwner) return true;
    else if (queue[0].requester === member.id) return true;
    else if (musicbot.isAdmin(member)) return true;
    else return false;
  };

  /**
   * Deletes the command message if invoker is on.
   *
   * @param {Message} msg - the message of the command.
   */
  musicbot.dInvoker = (msg) => {
    if (musicbot.clearInvoker) {
      if (!msg) return;
      msg.delete();
    }
  };

  /**
   * Gets the song queue of the server.
   *
   * @param {string} server - The server id.
   * @param {boolean} state - Whether or not to just return songs.
   * @returns {object} - The song queue.
   */
  musicbot.getQueue = (server, state) => {
    // Check if global queues are enabled.
    if (musicbot.global) server = '_'; // Change to global queue.

    if (!musicbot.queues.has(server)) { // Event if no queue is found.
      // The new queue object/data.
       let q = {
         songs: [],
         last: null,
         loop: "none",
         id: server
       };
       musicbot.queues.set(server, q); // Set the data.
    };

    if (state == true) return musicbot.queues.get(server).songs; // Return the queue songs.
    else if (!state || state == false) return musicbot.queues.get(server); // Return the queue.
  };

  /**
   * Sets the last played song of the server.
   *
   * @param {string} server - The server id.
   * @param {object} last - Video to be set for last.
   * @returns {Promise} - Returns the queue once last is set.
   */
  musicbot.setLast = (server, last) => {
    return new Promise((resolve, reject) => {
      // if (musicbot.global) reject("Global Enabled");
      let q;

      if (musicbot.queues.has(server)) { // Check if a queue exists.
        q = musicbot.queues.get(server); // Fetch queue.
        q.last = last; // Set last.
        musicbot.queues.set(server, q); // Set new queue data.
        resolve(musicbot.queues.get(server)); // Resolve the queue.
      } else {
        reject("no server queue"); // Reject if no queue is found.
      };
    });
  };

  /**
   * Gets the last played song of the server.
   *
   * @param {integer} server - The server id.
   * @returns {Promise} - Retunrs the queues last.
   */
  musicbot.getLast = (server) => {
    return new Promise((resolve, reject) => {
      // if (musicbot.global) reject("Global Enabled");
      let q = musicbot.queues.has(server) ? musicbot.queues.get(server).last : null; // Fetch/check for queue last.
      if (!q || !q.last) resolve(null) // Resolve null if no queue or no last.
      else if (q.last) resolve(q.last); // Resolve the 'last' object.
    });
  };

  /**
   * Verifies if the queue is empty or not.
   *
   * @param {object} queue - Queue to check if empty.
   * @returns {Promise} - If empty or not.
   */
  musicbot.isQueueEmpty = (queue) => {
    return new Promise((resolve, reject) => {
      if (!queue) reject("no queue passed"); // Reject if no queue passed.

      // Check if it's songs passed, instead of an entire queue.
      // If it equals and object (array), check for length instead of songs.
      if (typeof queue == "object") {
        if (queue.length > 0) resolve(false)
        else if (queue.length <= 0) resolve(true);
      } else {
        if (queue && queue.songs) { // Check songs in an entire queue object.
          if (queue.songs.length > 0) resolve(false) // Resolve false for a queue with songs.
          else if (queue.songs.length <= 0) resolve(true); // Resolve true for an empty queue.
        } else {
          reject("no queue/songs found");
        };
      };

    });
  };
  exports.isQueueEmpty = musicbot.isQueueEmpty;

  /**
   * Makes a servers queue and related data empty.
   *
   * @param {string} server - Server id.
   * @returns {Promise} - Retruns queue or error.
   */
  musicbot.emptyQueue = (server) => {
    return new Promise((resolve, reject) => {
      let q = musicbot.queues.has(server) ? musicbot.queues.get(server) : null; // Fetch/check for queue.
      if (!q) reject(new Error(`[emptyQueue] no queue found for ${server}`)); // Error if there's no queue.

      // Blank queue object.
      let blank = {
        songs: [],
        last: null,
        loop: "none",
        id: server
      };

      musicbot.queues.set(server, blank); // Set the queue data to the blank object.

      resolve(musicbot.queues.get(server)); // Resolve once done.
    });
  };

  /**
   * The help command.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   */
  musicbot.musichelp = (msg, suffix) => {
    musicbot.dInvoker(msg);
    let command = suffix.trim();
    if (!suffix) {
      if (msg.channel.permissionsFor(msg.guild.me)
        .has('EMBED_LINKS')) {
        const embed = new Discord.RichEmbed();
        embed.setAuthor("Commands", msg.author.displayAvatarURL);
        embed.setDescription(`Use \`${musicbot.botPrefix}${musicbot.helpCmd} command name\` for help on usage.`);
        // embed.addField(musicbot.helpCmd, musicbot.helpHelp);
        const newCmds = Array.from(musicbot.commands);
        for (var i = 0; i < newCmds.length; i++) {
          let thisCmd = newCmds[i][1];
          if (!thisCmd.disabled) {
            embed.addField(thisCmd.name, thisCmd.help);
          };
        };
        embed.setColor(musicbot.embedColor);
        setTimeout(() => {
          if (musicbot.messageHelp) {
            let sent = false;
            msg.author.send({
                embed
              })
              .then(() => {
                sent = true;
              });
            setTimeout(() => {
              if (!sent) return msg.channel.send({
                embed
              });
            }, 1200);
          } else {
            return msg.channel.send({
              embed
            });
          };
        }, 1500);
      } else {
        var cmdmsg = `= Music Commands =\nUse ${musicbot.botPrefix}${musicbot.helpCmd} [command] for help on a command.\n`;
        const newCmds = Array.from(musicbot.commands);
        for (var i = 0; i < newCmds.length; i++) {
          let thisCmd = newCmds[i][1];
          if (!thisCmd.disabled) {
            cmdmsg = cmdmsg + `\n• ${thisCmd.name}: ${thisCmd.help}`;
          };
        };
        setTimeout(() => {
          if (musicbot.messageHelp) {
            let sent = false;
            msg.author.send(cmdmsg, {
                code: 'asciidoc'
              })
              .then(() => {
                sent = true;
              });
            setTimeout(() => {
              if (!sent) return msg.channel.send(cmdmsg, {
                code: 'asciidoc'
              });
            }, 500);
          } else {
            return msg.channel.send(cmdmsg, {
              code: 'asciidoc'
            });
          };
        }, 1500);
      };
    } else if (musicbot.commands.has(command) || musicbot.aliases.has(command)) {
      if (msg.channel.permissionsFor(msg.guild.me)
        .has('EMBED_LINKS')) {
        const embed = new Discord.RichEmbed();
        command = musicbot.commands.get(command) || musicbot.aliases.get(command);
        embed.setAuthor(command.name, msg.client.user.avatarURL);
        embed.setDescription(command.help);
        if (command.aliases.length > 0) embed.addField(`Aliases`, command.aliases.join(", "), musicbot.inlineEmbeds);
        if (command.usage !== null) embed.addField(`Usage`, command.usage, musicbot.inlineEmbeds);
        embed.setColor(musicbot.embedColor);
        msg.channel.send({
          embed
        });
      } else {
        command = musicbot.commands.get(command) || musicbot.aliases.get(command);
        var cmdhelp = `= ${command.name} =\n`;
        cmdhelp + `\n${command.help}`;
        if (command.usage !== null) cmdhelp = cmdhelp + `\nUsage: ${command.usage}\n`;
        if (command.aliases.length > 0) cmdhelp = cmdhelp + `\nAliases: ${command.aliases.join(", ")}`;
        msg.channel.send(cmdhelp, {
          code: 'asciidoc'
        });
      };
    } else {
      msg.channel.send(musicbot.note('fail', `${suffix} is not a valid command!`));
    };
  };

  /**
   * The command for adding a song to the queue.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   */
  musicbot.play = (msg, suffix) => {
    musicbot.dInvoker(msg);
    // Make sure the user is in a voice channel.
    if (msg.member.voiceChannel === undefined) return msg.channel.send(musicbot.note('fail', `You're not in a voice channel.`));

    // Make sure the suffix exists.
    if (!suffix) return msg.channel.send(musicbot.note('fail', 'No video specified!'));

    // Get the queue.
    const queue = musicbot.getQueue(msg.guild.id);

    // Check if the queue has reached its maximum size.
    if (queue.songs.length >= musicbot.maxQueueSize && musicbot.maxQueueSize !== 0) return msg.channel.send(musicbot.note('fail', 'Maximum queue size reached!'));

    // Get the video information.
    // I don't know why I use trim when I don't need to... Yeah.
    var searchstring = suffix.trim();
    msg.channel.send(musicbot.note('search', `Searching: \`${searchstring}\``))
      .then(response => {
        if (searchstring.startsWith('http') && searchstring.includes("list=")) {
          var playid = searchstring.toString()
            .split('list=')[1];
          if (playid.toString()
            .includes('?')) playid = playid.split('?')[0];
          if (playid.toString()
            .includes('&t=')) playid = playid.split('&t=')[0];

          ypi.playlistInfo(musicbot.youtubeKey, playid, function(playlistItems) {
            const newItems = Array.from(playlistItems);
            var index = 0;
            var ran = 0;

            newItems.forEach(video => {
              ran++;
              if (queue.songs.length == (musicbot.maxQueueSize + 1) && musicbot.maxQueueSize !== 0) return;
              if (video.resourceId.kind == 'youtube#video') {
                if (!video.url) video.url = `https://www.youtube.com/watch?v=` + video.resourceId.videoId;
                video.requester = msg.author.id;
                video.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
                if (musicbot.requesterName) video.requesterAvatarURL = msg.author.displayAvatarURL;
                queue.songs.push(video);
                if (queue.songs.length === 1) musicbot.executeQueue(msg, queue);
                index++;
              };
              if (ran == newItems.length) {
                if (index = 0) msg.channel.send(musicbot.note('fail', `Coudln't get any songs from that playlist.`))
                else if (index == 1) msg.channel.send(musicbot.note('note', `Queued one song.`));
                else if (index > 1) msg.channel.send(musicbot.note('note', `Queued ${index} songs.`));
              }
            });
          });
        } else {
          musicbot.searcher.search(searchstring, {
              type: 'video'
            })
            .then(searchResult => {
              if (!searchResult.totalResults || searchResult.totalResults === 0) return response.edit(musicbot.note('fail', 'Failed to get search results.'));
              var result = searchResult.first;
              result.requester = msg.author.id;
              result.channelURL = `https://www.youtube.com/channel/${result.channelId}`;
              result.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
              if (musicbot.requesterName) result.requesterAvatarURL = msg.author.displayAvatarURL;
              queue.songs.push(result);

              if (queue.songs.length > 1) {
                if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
                const embed = new Discord.RichEmbed();
                try {
                  embed.setAuthor('Adding To Queue', client.user.avatarURL);
                  var songTitle = result.title.replace(/\\/g, '\\\\')
                    .replace(/\`/g, '\\`')
                    .replace(/\*/g, '\\*')
                    .replace(/_/g, '\\_')
                    .replace(/~/g, '\\~')
                    .replace(/`/g, '\\`');
                  embed.setColor(musicbot.embedColor);
                  embed.addField(result.channelTitle, `[${songTitle}](${result.url})`, musicbot.inlineEmbeds);
                  embed.addField("Queued On", result.queuedOn, musicbot.inlineEmbeds);
                  embed.setThumbnail(result.thumbnails.high.url);
                  const resMem = client.users.get(result.requester);
                  if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(result.requester).username}`, result.requesterAvatarURL);
                  if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${result.requester})\``, result.requesterAvatarURL);
                  msg.channel.send({
                    embed
                  });
                } catch (e) {
                  console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
                };
              } else {
                try {
                  var songTitle = result.title.replace(/\\/g, '\\\\')
                    .replace(/\`/g, '\\`')
                    .replace(/\*/g, '\\*')
                    .replace(/_/g, '\\_')
                    .replace(/~/g, '\\~')
                    .replace(/`/g, '\\`');
                  msg.channel.send(`Now Playing: **${songTitle}**\nRequested By: ${client.users.get(result.requester).username}\nQueued On: ${result.queuedOn}`)
                } catch (e) {
                  console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
                };
              }
            }

              if (queue.songs.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue);
            });
        }
      })
      .catch(console.log);
  };

  /**
   * The command for adding a song to the queue.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   */
  musicbot.search = (msg, suffix) => {
    musicbot.dInvoker(msg);
    // Make sure the user is in a voice channel.
    if (msg.member.voiceChannel === undefined) return msg.channel.send(musicbot.note('fail', `You're not in a voice channel~`));

    // Make sure the suffix exists.
    if (!suffix) return msg.channel.send(musicbot.note('fail', 'No video specified!'));

    // Get the queue.
    const queue = musicbot.getQueue(msg.guild.id);

    // Check if the queue has reached its maximum size.
    if (queue.songs.length >= musicbot.maxQueueSize && musicbot.maxQueueSize !== 0) return msg.channel.send(musicbot.note('fail', 'Maximum queue size reached!'));

    // Get the video information.
    // This is pretty much just play but 10 results to queue.
    var searchstring = suffix.trim();
    msg.channel.send(musicbot.note('search', `Searching: \`${searchstring}\``))
      .then(response => {
        musicbot.searcher.search(searchstring, {
            type: 'video'
          })
          .then(searchResult => {
            if (!searchResult.totalResults || searchResult.totalResults === 0) return response.edit(musicbot.note('fail', 'Failed to get search results.'));

            const startTheFun = async (videos, max) => {
              // if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
              //
              // } else {
              //
              // }
              const embed = new Discord.RichEmbed();
              embed.setTitle(`Choose Your Video`);
              embed.setColor(musicbot.embedColor);
              var index = 0;
              videos.forEach(function(video) {
                index++;
                embed.addField(`${index} (${video.channelTitle})`, `[${musicbot.note('font', video.title)}](${video.url})`, musicbot.inlineEmbeds);
              });
              embed.setFooter(`Search by: ${msg.author.username}`, msg.author.displayAvatarURL);
              msg.channel.send({
                  embed
                })
                .then(firstMsg => {
                  var filter = null;
                  if (max === 0) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 1) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 2) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 3) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 4) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 5) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 6) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 7) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 8) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.includes('9') ||
                      m.content.trim() === (`cancel`);
                  } else if (max === 9) {
                    filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.includes('9') ||
                      m.content.includes('10') ||
                      m.content.trim() === (`cancel`);
                  }
                  msg.channel.awaitMessages(filter, {
                      max: 1,
                      time: 60000,
                      errors: ['time']
                    })
                    .then(collected => {
                      const newColl = Array.from(collected);
                      const mcon = newColl[0][1].content;

                      if (mcon === "cancel") return firstMsg.edit(musicbot.note('note', 'Searching canceled.'));
                      const song_number = parseInt(mcon) - 1;
                      if (song_number >= 0) {
                        firstMsg.delete();
                        return msg.channel.send(musicbot.note('note', `Queued **${musicbot.note('font', videos[song_number].title)}**`))
                          .then(() => {
                            queue.songs.push(videos[song_number]);
                            if (queue.songs.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue);
                          })
                          .catch(console.log);
                      };
                    })
                    .catch(collected => {
                      if (collected.toString()
                        .match(/error|Error|TypeError|RangeError|Uncaught/)) return firstMsg.edit(`\`\`\`xl\nSearching canceled. ${collected}\n\`\`\``);
                      return firstMsg.edit(`\`\`\`xl\nSearching canceled.\n\`\`\``);
                    });
                })
            };

            const max = searchResult.totalResults >= 10 ? 9 : searchResult.totalResults - 1;
            var videos = [];
            for (var i = 0; i < 99; i++) {
              var result = searchResult.currentPage[i];
              result.requester = msg.author.id;
              if (musicbot.requesterName) result.requesterAvatarURL = msg.author.displayAvatarURL;
              result.channelURL = `https://www.youtube.com/channel/${result.channelId}`;
              result.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
              videos.push(result);
              if (i === max) {
                i = 101;
                startTheFun(videos, max);
              }
            };
          });
      })
      .catch(console.log);
  };


  /**
   * The command for skipping a song.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   * @returns {<promise>} - The response message.
   */
  musicbot.skip = (msg, suffix) => {
    musicbot.dInvoker(msg)
    // Get the voice connection.
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
    if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music being played.'));

    // Get the queue.
    const queue = musicbot.getQueue(msg.guild.id);

    if (!musicbot.canSkip(msg.member, queue.songs)) return msg.channel.send(musicbot.note('fail', `You cannot skip this as you didn't queue it.`))
      .then((response) => {
        response.delete(5000);
      });

    let q = musicbot.queues.get(msg.guild.id);
    if (q.loop !== "none") {
      q.loop == "none";
      musicbot.queues.set(msg.guild.server, q);
    };

    // Get the number to skip.
    let toSkip = 1; // Default 1.
    if (!isNaN(suffix) && parseInt(suffix) > 0) {
      toSkip = parseInt(suffix);
    }
    toSkip = Math.min(toSkip, queue.songs.length);

    // Skip.
    queue.songs.splice(0, toSkip - 1);

    // Resume and stop playing.
    try {
      const dispatcher = voiceConnection.player.dispatcher;
      if (!dispatcher || dispatcher === null) {
        if (musicbot.logging) return console.log(new Error(`dispatcher null on skip cmd [${msg.guild.name}] [${msg.author.username}]`));
      };
      if (voiceConnection.paused) dispatcher.resume();
      dispatcher.end();
    } catch (e) {
      if (musicbot.logging) console.log(new Error(`Skip command dispatcher error from userID ${msg.author.id} in guildID ${msg.guild.id}\n${e.stack}`));
      const nerr = e.toString()
        .split(':');
      return msg.channel.send(musicbot.note('fail', `Error occoured!\n\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``));
    };

    if (musicbot.queues.has(msg.guild.id) && musicbot.queues.get(msg.guild.id).loop !== "none") return msg.channel.send(musicbot.note('note', 'Skipped **' + toSkip + '**! (Disabled Looping)'));
    else return msg.channel.send(musicbot.note('note', 'Skipped **' + toSkip + '**!'));
  }

  /**
   * The command for listing the queue.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   */
  musicbot.queue = (msg, suffix) => {
    musicbot.dInvoker(msg);
    // Get the queue.
    const queue = musicbot.getQueue(msg.guild.id, true);

    musicbot.isQueueEmpty(musicbot.queues.get(msg.guild.id)).then(res => {
      if (res == true) return msg.channel.send(musicbot.note('note', 'Queue empty.'))
    }).catch(res => {
      if (res) {
        console.log(`[isQueueEmpty] [queueCmd] [${msg.guild.name}]: ${new Error(res)}`)
        return msg.channel.send(musicbot.note('fail', 'Error occoured!'))
      }
    });

    let text;
    // Get the queue text.
    // Choice added for names to shorten the text a bit if wanted.
    if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
      const songNum = suffix ? parseInt(suffix) - 1 : null;
      let maxRes = queue.length;

      if (suffix) {
        if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
          if (songNum > queue.length) return msg.channel.send(musicbot.note('fail', 'Not a valid song number.'));
          const embed = new Discord.RichEmbed();
          const reqMem = client.users.get(queue[songNum].requester);
          embed.setAuthor(`Queued Song #${suffix}`, client.user.avatarURL);
          embed.addField(queue[songNum].channelTitle, `[${queue[songNum].title}](${queue[songNum].url})`, musicbot.inlineEmbeds);
          embed.addField(`Queued On`, queue[songNum].queuedOn, musicbot.inlineEmbeds);
          embed.setThumbnail(queue[songNum].thumbnails[musicbot.thumbnailType].url);
          embed.setColor(musicbot.embedColor);
          if (musicbot.requesterName && reqMem) embed.setFooter(`Queued by: ${reqMem.username}`, queue[songNum].requesterAvatarURL);
          if (musicbot.requesterName && !reqMem) embed.setFooter(`Queued by: \`UnknownUser (id: ${queue[songNum].requester})\``, queue[songNum].requesterAvatarURL)
          msg.channel.send({embed});
        } else {

        }
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
            if (queue[i] !== queue.last && queue[i] !== queue.loop) {
              embed.addField(`${queue[i].channelTitle}`, `[${queue[i].title}](${queue[i].url})`, musicbot.inlineEmbeds);
            }
          };
          embed.setColor(musicbot.embedColor);
          embed.setFooter(`Total songs: ${queue.length}`, msg.author.displayAvatarURL);
        } catch (e) {
          console.log(e.stack);
        };

        setTimeout(() => {
          msg.channel.send({
            embed
          });
        }, 1500);
      }
    } else {
      try {
        if (musicbot.requesterName) {
          text = queue.map((video, index) => (
              (index + 1) + ': ' + video.title + ' | Requested by ' + client.users.get(video.requester)
              .username
            ))
            .join('\n');
        } else {
          text = queue.map((video, index) => (
              (index + 1) + ': ' + video.title
            ))
            .join('\n');
        };
      } catch (e) {
        if (musicbot.logging) console.log(`[${msg.guild.name}] [queueCmd] ` + e.stack);
        const nerr = e.toString()
          .split(':');
        return msg.channel.send(musicbot.note('fail', `Error occoured!\n\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``));

      } finally {

        if (text.length > 1900) {
          const newText = text.substr(0, 1899);
          const otherText = text.substr(1900, text.length);
          if (otherText.length > 1900) {
            let queueStatus = 'Stopped';
              const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
              if (voiceConnection !== null) {
                const dispatcher = voiceConnection.player.dispatcher;
                queueStatus = dispatcher.paused ? 'Paused' : 'Playing';
              }
            msg.channel.send(musicbot.note('wrap', 'Queue (' + queueStatus + '):\n' + "Past character limit..."));
          } else {
            if (musicbot.enableQueueStat) {
              // Get the status of the queue.
              let queueStatus = 'Stopped';
              const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
              if (voiceConnection !== null) {
                const dispatcher = voiceConnection.player.dispatcher;
                queueStatus = dispatcher.paused ? 'Paused' : 'Playing';
              }

              // Send the queue and status.
              msg.channel.send(musicbot.note('wrap', 'Queue (' + queueStatus + '):\n' + newText));
              msg.channel.send(musicbot.note('wrap', 'Queue (2) (' + queueStatus + '):\n' + otherText));
            } else {
              msg.channel.send(musicbot.note('wrap', 'Queue:\n' + newText));
              msg.channel.send(musicbot.note('wrap', 'Queue (2):\n' + otherText));
            }
          };
        } else {
          if (musicbot.enableQueueStat) {
            // Get the status of the queue.
            let queueStatus = 'Stopped';
            const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
            if (voiceConnection !== null) {
              const dispatcher = voiceConnection.player.dispatcher;
              queueStatus = dispatcher.paused ? 'Paused' : 'Playing';
            }

            // Send the queue and status.
            msg.channel.send(musicbot.note('wrap', 'Queue (' + queueStatus + '):\n' + text));
          } else {
            msg.channel.send(musicbot.note('wrap', 'Queue:\n' + text));
          }
        }
      }
    }
  };

  /**
   * The command for information about the current song.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   * @returns {<promise>} - The response message.
   */
  musicbot.np = (msg, suffix) => {
    musicbot.dInvoker(msg);
    // Get the voice connection.
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
    const queue = musicbot.getQueue(msg.guild.id, true);
    if (voiceConnection === null && queue.length > 0) return msg.channel.send(musicbot.note('fail', 'No music is being played, but an ongoing queue is avainable.'));
    else if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music is being played.'));
    const dispatcher = voiceConnection.player.dispatcher;


    musicbot.isQueueEmpty(musicbot.queues.get(msg.guild.id)).then(res => {
      if (res == true) return msg.channel.send(musicbot.note('note', 'Queue empty.'))
    }).catch(res => {
      if (res) {
        console.log(`[isQueueEmpty] [np] [${msg.guild.name}]: ${new Error(res)}`)
        return msg.channel.send(musicbot.note('fail', 'Error occoured!'))
      }
    })

    if (msg.channel.permissionsFor(msg.guild.me)
      .has('EMBED_LINKS')) {
      const embed = new Discord.RichEmbed();
      try {
        embed.setAuthor('Now Playing', client.user.avatarURL);
        var songTitle = queue[0].title.replace(/\\/g, '\\\\')
          .replace(/\`/g, '\\`')
          .replace(/\*/g, '\\*')
          .replace(/_/g, '\\_')
          .replace(/~/g, '\\~')
          .replace(/`/g, '\\`');
        embed.setColor(musicbot.embedColor);
        embed.addField(queue[0].channelTitle, `[${songTitle}](${queue[0].url})`, musicbot.inlineEmbeds);
        embed.addField("Queued On", queue[0].queuedOn, musicbot.inlineEmbeds);
        embed.setThumbnail(queue[0].thumbnails.high.url);
        const resMem = client.users.get(queue[0].requester);
        if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(queue[0].requester).username}`, queue[0].requesterAvatarURL);
        if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${queue[0].requester})\``, queue[0].requesterAvatarURL);
        msg.channel.send({
          embed
        });
      } catch (e) {
        console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
      };
    } else {
      try {
        var songTitle = queue[0].title.replace(/\\/g, '\\\\')
          .replace(/\`/g, '\\`')
          .replace(/\*/g, '\\*')
          .replace(/_/g, '\\_')
          .replace(/~/g, '\\~')
          .replace(/`/g, '\\`');
        msg.channel.send(`Now Playing: **${songTitle}**\nRequested By: ${client.users.get(queue[0].requester).username}\nQueued On: ${queue[0].queuedOn}`)
      } catch (e) {
        console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
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
  musicbot.pause = (msg, suffix) => {
    musicbot.dInvoker(msg)
    // Get the voice connection.
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
    if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music being played.'));

    if (!musicbot.isAdmin(msg.member) && !musicbot.anyoneCanPause) return msg.channel.send(musicbot.note('fail', 'Only Admins are allowed to use this command.'));

    // Pause.
    const dispatcher = voiceConnection.player.dispatcher;
    if (dispatcher.paused) return msg.channel.send(musicbot.note(`fail`, `Music already paused!`));
    msg.channel.send(musicbot.note('note', 'Playback paused.'));
    if (!dispatcher.paused) dispatcher.pause();
  }

  /**
   * The command for leaving the channel and clearing the queue.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   * @returns {<promise>} - The response message.
   */
  musicbot.leave = (msg, suffix) => {
    musicbot.dInvoker(msg);

    if (musicbot.isAdmin(msg.member) || musicbot.anyoneCanLeave === true) {
      const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'I\'m not in a voice channel.'));

      if (musicbot.clearOnLeave) musicbot.emptyQueue(msg.guild.id); // Clear the queue if clearOnLeave is true.

      // End the stream and disconnect.
      if (!voiceConnection.player.dispatcher) return;
      voiceConnection.player.dispatcher.end();
      voiceConnection.disconnect();
      msg.channel.send(musicbot.note('note', 'Successfully left your voice channel!'));

      setTimeout(() => {
        let vc = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        if (!vc.player.dispatcher) return;
        try {
          vc.player.dispatcher.end();
          vc.disconnect();
        } catch (e) {
          console.error(`[leaevCmd] [${msg.guild.name}] ${e.stack}`);
        }
      }, 2500);
    } else {
      const chance = Math.floor((Math.random() * 100) + 1);
      if (chance <= 10) return msg.channel.send(musicbot.note('fail', `I'm afraid I can't let you do that, ${msg.author.username}.`))
      else return msg.channel.send(musicbot.note('fail', 'Sorry, you\'re not allowed to do that.'));
    }
  }

  /**
   * The command for joining the voice channel.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   * @returns {<promise>} - The response message.
   */
  musicbot.join = (msg, suffix) => {
    musicbot.dInvoker(msg);

    if (musicbot.isAdmin(msg.member) || musicbot.anyoneCanJoin === true) {
      if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
        msg.member.voiceChannel.join().then((connection) => {
          msg.channel.send(musicbot.note("note", "Joined your voice channel. :ok_hand:"));
        }).catch((error) => {
            console.error(error);
            msg.channel.send(musicbot.note("fail", "Error occoured!"));
          });
      } else if (!msg.member.voiceChannel) {
        return msg.channel.send(musicbot.note("fail", "Doesn't seem you're in a voice channel."));
      } else if (msg.member.voiceChannel && !msg.member.voiceChannel.joinable) {
        return msg.channel.send(musicbot.note("fail", "Can't join your voice channel."));
      };
    } else {
      const chance = Math.floor((Math.random() * 100) + 1);
      if (chance <= 10) return msg.channel.send(musicbot.note('fail', `I'm afraid I can't let you do that, ${msg.author.username}.`))
      else return msg.channel.send(musicbot.note('fail', 'Sorry, you\'re not allowed to do that.'));
    }
  }

  /**
   * The command for clearing the song queue.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   */
  musicbot.clearqueue = (msg, suffix) => {
    musicbot.dInvoker(msg)
    if (!musicbot.queues.has(msg.guild.id)) return msg.channel.send(musicbot.note('fail', 'No server queue.'));

    if (musicbot.isAdmin(msg.member)) {
      musicbot.emptyQueue(msg.guild.id).then(() => {
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        if (voiceConnection !== null) {
          voiceConnection.player.dispatcher.end();
          voiceConnection.disconnect();
        };
        msg.channel.send(musicbot.note('note', 'Queue cleared.'));
      }).catch((res) => {
        console.log(new Error(`[clearQueue] [${msg.guild.name}] ${res}`));
      })
    } else {
      msg.channel.send(musicbot.note('fail', `I'm sorry, but you cannot do this.`));
    }
  }

  /**
   * The command for resuming the current song.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   * @returns {<promise>} - The response message.
   */
  musicbot.resume = (msg, suffix) => {
    musicbot.dInvoker(msg)
    // Get the voice connection.
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
    if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music is being played.'));

    if (!musicbot.isAdmin(msg.member) && !musicbot.anyoneCanPause) return msg.channel.send(musicbot.note('fail', `I'm sorry, but you cannot do this.`));

    // Resume.
    msg.channel.send(musicbot.note('note', 'Playback resumed.'));
    const dispatcher = voiceConnection.player.dispatcher;
    if (dispatcher.paused) dispatcher.resume();
  };

  /**
   * The command for changing the song volume.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   * @returns {<promise>} - The response message.
   */
  musicbot.volume = (msg, suffix) => {
    musicbot.dInvoker(msg)
    // Get the voice connection.
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
    if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music is being played.'));

    if (!suffix) return msg.channel.send(musicbot.note('fail', 'No volume specified.'));
    suffix = parseInt(suffix);

    // Get the queue.
    const queue = musicbot.getQueue(msg.guild.id, true);

    if (!musicbot.canAdjust(msg.member, queue)) return msg.channel.send(musicbot.note('fail', `I'm sorry, but you cannot do that.`));

    // Get the dispatcher
    const dispatcher = voiceConnection.player.dispatcher;

    if (suffix > 200 || suffix <= 0) return msg.channel.send(musicbot.note('fail', 'Volume out of range, must be within 1 - 200'));

    dispatcher.setVolume((suffix / 100));
    msg.channel.send(musicbot.note('note', 'Volume set to ' + suffix));
  }

  /**
   * Looping command/option.
   *
   * @param {Message} msg - Original message.
   * @param {object} queue - The song queue for this server.
   * @param {string} suffix - Command suffix.
   */
  musicbot.loop = (msg, suffix) => {
    musicbot.dInvoker(msg);

    if (!musicbot.queues.has(msg.guild.id)) return msg.channel.send(musicbot.note('fail', `No queue for this server found!`));
    var queue = musicbot.queues.get(msg.guild.id);

    if (queue.loop == "none" || !queue.loop) {
      queue.loop = "single";
      musicbot.queues.set(msg.guild.id, queue);
      return msg.channel.send(musicbot.note('note', 'Looping single enabled! :repeat_one:'));
    } else if (queue.loop == "single") {
      queue.loop = "queue";
      musicbot.queues.set(msg.guild.id, queue);
      return msg.channel.send(musicbot.note('note', 'Looping queue enabled! :repeat:'));
    } else if (queue.loop == "queue") {
      queue.loop == "none";
      musicbot.queues.set(msg.guild.id, queue);
      return msg.channel.send(musicbot.note('note', 'Looping disabled! :arrow_forward:'));
    }
  };

  /**
   * Set command function.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   */
  musicbot.set = (msg, suffix, args) => {
    if (!musicbot.isAdmin(msg.member)) return msg.channel.send(musicbot.note('fail', `Only admins may do this!`));
    const valid = ["prefix"];
    if (!args[0]) return msg.channel.send(musicbot.note('note', `Valid settings are: ${valid.join(", ")}.`));
    if (!valid.includes(args[0])) return msg.channel.send(musicbot.note('fail', 'Not a valid setting!'));
    if (args[0] && args[0] == "prefix") {
      const newPrefix = args.slice(1, args.length)
        .join(" ");
      if (!newPrefix || newPrefix.legnth < 1) return msg.channel.send(musicbot.note('fail', 'Please specify a prefix!'));
      musicbot.updatePrefix(msg.guild.id, newPrefix)
        .then(response => {
          if (response) msg.channel.send(musicbot.note('note', response));
        })
        .catch(err => {
          if (err) {
            msg.channel.send(musicbot.note('fail', `Error!\n${err}`));
            return console.log(`[updatePrefix] [${msg.guild.id}] ${err}`);
          }
        })
    }
  };

  /**
   * Executes the next song in the queue.
   *
   * @param {Message} msg - Original message.
   * @param {object} queue - The song queue for this server.
   * @returns {<promise>} - The voice channel.
   */
  musicbot.executeQueue = (msg, queue) => {
    if (queue.songs.length <= 0) {
      const vc = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (vc === null) return;
    };

    // If the queue is empty, finish.
    musicbot.isQueueEmpty(queue).then(res => {
      if (res == true) {
        msg.channel.send(musicbot.note('note', 'Playback finished.'));

        // Leave the voice channel.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        if (voiceConnection !== null) return voiceConnection.disconnect();
      };
    }).catch(res => {
      if (res) {
        console.error(`[executeQueue]: ${new Error(res)}`);

        msg.channel.send(musicbot.note('fail', 'Error occoured on starting the queue!'));

        // Leave the voice channel.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        if (voiceConnection !== null) return voiceConnection.disconnect();
      }
    })

    new Promise((resolve, reject) => {
        // Join the voice channel if not already in one.
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        if (voiceConnection === null) {
          // Check if the user is in a voice channel.
          if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
            msg.member.voiceChannel.join()
              .then(connection => {
                resolve(connection);
              })
              .catch((error) => {
                console.log(error);
              });
          } else if (!msg.member.voiceChannel.joinable) {
            msg.channel.send(musicbot.note('fail', 'I do not have permission to join your voice channel!'))
            reject();
          } else {
            // Otherwise, clear the queue and do nothing.
            musicbot.emptyQueue(msg.guild.id).then(() => {
              reject();
            })
          }
        } else {
          resolve(voiceConnection);
        }
      })
      .then(connection => {
        // Get the first item in the queue.
        const video = queue.songs[0];

        // Play the video.
        try {
          musicbot.getLast(msg.guild.id).then((response) => {
            const re = response;
            musicbot.setLast(msg.guild.id, video).then((res) => {
              const wew = musicbot.queues.get(msg.guild.id);
              if (re !== video && wew.loop == 'none') musicbot.np(msg);
            }).catch((res) => {
              msg.channel.send(musicbot.note('fail', 'Error occoured, try again!'));
              return console.error(new Error("Dispatcher SetLast: " + res));
            })
          }).catch((response) => {
            if (response) {
              msg.channel.send(musicbot.note('fail', 'Error occoured, try again!'));
              return console.error(new Error("Dispatcher GetLast: " + response));
            }
          });

          let dispatcher = connection.playStream(ytdl(video.url, {
            filter: 'audioonly'
          }), {
            volume: (musicbot.defVolume / 100)
          })

          connection.on('error', (error) => {
            // Skip to the next song.
            console.log(`Dispatcher/connection: ${error}`);
            if (msg && msg.channel) msg.channel.send(musicbot.note('fail', `Dispatcher error!\n\`${error}\``));
            queue.songs.shift();
            musicbot.executeQueue(msg, queue);
          });

          dispatcher.on('error', (error) => {
            // Skip to the next song.
            console.log(`Dispatcher: ${error.stack}`);
            if (msg && msg.channel) msg.channel.send(musicbot.note('fail', `Dispatcher error!\n\`${error}\``));
            queue.songs.shift();
            musicbot.executeQueue(msg, queue);
          });

          dispatcher.on('end', () => {
            // Wait a second.
            setTimeout(() => {
              let nqueue = musicbot.getQueue(msg.guild.id);

              if (nqueue.loop == "single") {
                musicbot.executeQueue(msg, queue); // Restart song.
              } else if (nqueue.loop == "queue") {
                queue.songs.push(queue.songs[0]) // Add song 1 to the bottom of the queue.
                queue.songs.shift() // Next song.
                musicbot.executeQueue(msg, queue) // Start next song.
              } else {
                if (queue.songs.length > 0) { // Remove the song from the queue.
                  queue.songs.shift(); // Play the next song in the queue.
                  musicbot.executeQueue(msg, queue);
                } else if (queue.songs.length <= 0) {
                  if (msg && msg.channel) msg.channel.send(musicbot.note('note', 'Playback finished.'));

                  // Leave the voice channel.
                  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
                  if (voiceConnection !== null) return voiceConnection.disconnect();
                }
              }
            }, 1000);
          });
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Text wrapping and cleaning.
  musicbot.note = (type, text) => {
    if (type === 'wrap') {
      let ntext = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(client.token, 'REMOVED');
      return '```\n' + ntext + '\n```';
    } else if (type === 'note') {
      return ':musical_note: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
    } else if (type === 'search') {
      return ':mag: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
    } else if (type === 'fail') {
      return ':no_entry_sign: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
    } else if (type === 'font') {
      return text.replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(/\\/g, '\\\\')
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`');
    } else {
      console.error(new Error(`${type} was an invalid type`));
    }
  };
  exports.note = musicbot.note;
  exports.addAdmin = (admin) => {
    return new Promise((resolve, reject) => {
      if (!admin || typeof admin !== "string") reject("invalid admin object");
      musicbot.botAdmins.push(admin);
      resolve(musicbot.botAdmins);
    });
  };
  exports.getQueue = (server) => {
    if (!server) {
      console.error(new Error("no server provided for getQueue"));
      return null;
    };
    let q = musicbot.queues.has(server) ? musicbot.queues.get(server) : null;
    return q;
  }
  exports.setQueue = (data) => {
    return new Promise((resolve, reject) => {
      if (!data) reject(new Error("no data passed to setQueue"));
      if (typeof data == "string") {
        data = {
          songs: [],
          last: null,
          loop: "none",
          id: data
        };
        musicbot.queues.set(data.id, data);
        resolve(musicbot.queues.get(data.id));
      } else if (typeof data == "object") {
        if (!data.songs || typeof data.songs !== "object") data.songs = [];
        if (!data.last) data.last = null;
        if (!data.loop || typeof data.loop !== "string") data.loop = "none";
        if (!data.id || typeof data.id !== "string") data.id = data.toString();
        musicbot.queues.set(data.id, data);
        resolve(musicbot.queues.get(data.id));
      } else {
        reject(new Error("data didn't equal a string or object"));
      }
    });
  };
};
