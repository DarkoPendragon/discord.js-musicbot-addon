/**
 * Original code from nexu-dev, https://github.com/nexu-dev/discord.js-client
 * Newly edited by Darko Pendragon (Demise).
 * Other contributions: Rodabaugh, mcao.
 */

// const stream = require('youtube-audio-stream');
const stream = require('youtube-audio-stream')
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');
const ypi = require('youtube-playlist-info');
const Discord = require('discord.js');
const PACKAGE = require('./package.json');

/**
 * Takes a discord.js client and turns it into a music bot.
 * Extra thanks to Rodabaugh (Erik) for helping with some tweaks and ideas.
 *
 * @param {Client} client - The discord.js client.
 * @param {object} options - Options to configure the client bot.
 */

module.exports = function(client, options) {
  // Node check.
  if (process.version.slice(1).split('.')[0] < 8) {
    console.log(new Error(`[MusicBot] node 8 or higher is needed, please update`));
    process.exit(1);
  };

  // Get all options.
  class Music {
    constructor(client, options) {
      this.commands = new Map();
      this.aliases = new Map();
      this.youtubeKey = (options && options.youtubeKey);
      this.botPrefix = (options && options.prefix) || '!';
      this.botPrefixs = new Map();
      this.thumbnailType = (options && options.thumbnailType) || "high";
      this.anyoneCanLeave = Boolean((options && options.anyoneCanLeave) || false);
      this.streamMode = parseInt((options && options.streamMode) || 0);
      this.global = (options && options.global) || false;
      this.maxQueueSize = parseInt((options && options.maxQueueSize) || 20);
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
      this.searcHelp = (options && options.searcHelp) || "Searchs for up to 10 results.";
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
      this.queues = {};
      this.loops = {};
      this.advancedMode = (options && options.advancedMode) || {};
      this.botAdmins = [];
    }

    logger(cmd, msg, text) {
      console.log(`[${cmd}] [${msg.guild.name}] ${text}`);
    }
  }

  var musicbot = new Music(client, options);

  if (musicbot.advancedMode && musicbot.advancedMode.enabled) {
    musicbot.advancedMode = {
      enabled: Boolean((options && options.advancedMode.enabled) || false),
      multiPrefix: Boolean((options && options.advancedMode.multiPrefix) || false),
      serverPrefixs: (options && options.advancedMode.serverPrefixs) || {}
    };
  };

  async function musicBotStart() {
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
        console.log(new Error(`all commands disabled`));
        process.exit(1);
    };

    if (typeof musicbot.botAdmins !== 'object') {
      console.log(new TypeError(`botAdmins must be an object (array)`));
      process.exit(1);
    }
    if (typeof musicbot.advancedMode !== 'object') {
      console.log(new TypeError(`advancedMode must be an object`));
      process.exit(1);
    }
    if (musicbot.advancedMode.enabled && typeof musicbot.advancedMode.enabled !== 'boolean') {
      console.log(new TypeError(`advancedMode.enabled must be a boolean`));
      process.exit(1);
    }
    if (musicbot.advancedMode.multiPrefix && typeof musicbot.advancedMode.multiPrefix !== 'boolean') {
      console.log(new TypeError(`advancedMode.multiPrefix must be a boolean`));
      process.exit(1);
    }
    if (musicbot.advancedMode.serverPrefixs && typeof musicbot.advancedMode.serverPrefixs !== 'object') {
      console.log(new TypeError(`advancedMode.serverPrefixs must be an object`));
      process.exit(1);
    }

    if (typeof musicbot.thumbnailType !== 'string') {
      console.log(new TypeError(`thumbnailType must be a string`));
      process.exit(1);
    };
    if (!musicbot.thumbnailType.match(/default|medium|high/)) {
      console.log(new Error(`thumbnailType must be one of the following: default, medium, high`));
      process.exit(1);
    };
    if (typeof musicbot.helpHelp !== 'string') {
      console.log(new TypeError(`helpHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.helpAlt !== 'object') {
      console.log(new TypeError(`helpAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.playHelp !== 'string') {
      console.log(new TypeError(`playHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.streamMode !== 'number') {
      console.log(new TypeError(`streamMode must be a number`));
      process.exit(1);
    };
    if (musicbot.streamMode !== 0 && musicbot.streamMode !== 1) {
      console.log(new TypeError(`streamMode must be either 0 or 1`));
      process.exit(1);
    };
    if (typeof musicbot.playAlt !== 'object') {
      console.log(new TypeError(`playAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.queueHelp !== 'string') {
      console.log(new TypeError(`queueHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.queueAlt !== 'object') {
      console.log(new TypeError(`queueAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.pauseHelp !== 'string') {
      console.log(new TypeError(`pauseHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.pauseAlt !== 'object') {
      console.log(new TypeError(`pauseAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.resumeHelp !== 'string') {
      console.log(new TypeError(`resumeHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.resumeAlt !== 'object') {
      console.log(new TypeError(`resumeAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.volumeHelp !== 'string') {
      console.log(new TypeError(`volumeHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.volumeAlt !== 'object') {
      console.log(new TypeError(`volumeAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.leaveHelp !== 'string') {
      console.log(new TypeError(`leaveHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.leaveAlt !== 'object') {
      console.log(new TypeError(`leaveAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.clearHelp !== 'string') {
      console.log(new TypeError(`clearHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.clearAlt !== 'object') {
      console.log(new TypeError(`clearAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.loopHelp !== 'string') {
      console.log(new TypeError(`loopHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.loopAlt !== 'object') {
      console.log(new TypeError(`loopAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.npHelp !== 'string') {
      console.log(new TypeError(`npHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.npAlt !== 'object') {
      console.log(new TypeError(`npAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.ownerHelp !== 'string') {
      console.log(new TypeError(`ownerHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.ownerAlt !== 'object') {
      console.log(new TypeError(`ownerAlt must be an array`));
      process.exit(1);
    };
    if (typeof musicbot.skipHelp !== 'string') {
      console.log(new TypeError(`skipHelp must be a string`))
      process.exit(1);
    };
    if (typeof musicbot.skipAlt !== 'object') {
      console.log(new TypeError(`skipAlt must be an array`));
      process.exit(1);
    };
    if (!musicbot.youtubeKey) {
      console.log(new Error(`youtubeKey is required but missing`));
      process.exit(1);
    };
    if (musicbot.youtubeKey && typeof musicbot.youtubeKey !== 'string') {
      console.log(new TypeError(`youtubeKey must be a string`));
      process.exit(1);
    };
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
    if (typeof musicbot.disableOwnerCmd !== 'boolean') {
      console.log(new TypeError(`disableOwnerCmd must be a boolean`));
      process.exit(1);
    }
    if (typeof musicbot.ownerCmd !== 'string') {
      console.log(new TypeError(`ownerCmd must be a string`));
      process.exit(1);
    }
    if (typeof musicbot.ownerOverMember !== 'boolean') {
      console.log(new TypeError(`ownerOverMember must be a boolean`));
      process.exit(1);
    };
    if (musicbot.ownerOverMember && typeof musicbot.botOwner !== 'string') {
      console.log(new TypeError(`botOwner must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.botPrefix !== 'string') {
      console.log(new TypeError(`prefix must be a string`));
      process.exit(1);
    };
    if (musicbot.botPrefix.length < 1 || musicbot.botPrefix.length > 10) {
      console.log(new RangeError(`prefix length must be between 1 and 10`));
      process.exit(1);
    };
    if (typeof musicbot.global !== 'boolean') {
      console.log(new TypeError(`global must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.maxQueueSize !== 'number') {
      console.log(new TypeError(`maxQueueSize must be a number`));
      process.exit(1);
    };
    if (!Number.isInteger(musicbot.maxQueueSize) || musicbot.maxQueueSize < 1) {
      console.log(new TypeError(`maxQueueSize must be an integer more than 0`));
      process.exit(1);
    };
    if (typeof musicbot.defVolume !== 'number') {
      console.log(new TypeError(`defaultVolume must be a number`));
      process.exit(1);
    };
    if (!Number.isInteger(musicbot.defVolume) || musicbot.defVolume < 1 || musicbot.defVolume > 200) {
      console.log(new TypeError(`defaultVolume must be an integer between 1 and 200`));
      process.exit(1);
    };
    if (typeof musicbot.anyoneCanSkip !== 'boolean') {
      console.log(new TypeError(`anyoneCanSkip must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.clearInvoker !== 'boolean') {
      console.log(new TypeError(`clearInvoker must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.enableAliveMessage !== 'boolean') {
      console.log(new TypeError(`enableAliveMessage must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.aliveMessage !== 'string') {
      console.log(new TypeError(`aliveMessage must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.aliveMessageTime !== 'number') {
      console.log(new TypeError(`aliveMessageTime must be a number`));
      process.exit(1);
    };
    if (typeof musicbot.helpCmd !== 'string') {
      console.log(new TypeError(`helpCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.playCmd !== 'string') {
      console.log(new TypeError(`playCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.searchCmd !== 'string') {
      console.log(new TypeError(`searchCmd must be a string`));
      process.exit(1);
    };
    if (typeof musicbot.disableSearch !== 'boolean') {
      console.log(new TypeError(`disableSearch must be a boolean`));
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
    if (typeof musicbot.enableQueueStat !== 'boolean') {
      console.log(new TypeError(`enableQueueStat must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.anyoneCanAdjust !== 'boolean') {
      console.log(new TypeError(`anyoneCanAdjust must be a boolean`));
      process.exit(1);
    };
    if (typeof musicbot.logging !== 'boolean') {
      console.log(new TypeError(`logging must be a boolean`));
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
      };
      if (!musicbot.commands.has(musicbot.searchCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.searchCmd} command.`);
        const search_props = {
          name: musicbot.searchCmd,
          usage: `${musicbot.botPrefix}${musicbot.searchCmd} <query>`,
          disabled: musicbot.disableSearch,
          help: musicbot.searcHelp,
          aliases: musicbot.searchAlt,
          admin: false,
          run: "search"
        };
        musicbot.commands.set(musicbot.searchCmd, search_props);
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
      };
      if (!musicbot.commands.has(musicbot.ownerCmd)) {
        if (musicbot.logging) console.log(`[MUSIC] Mapping ${musicbot.ownerCmd} command.`);
        const owner_props = {
          name: musicbot.ownerCmd,
          usage: null,
          disabled: musicbot.disableOwnerCmd,
          help: musicbot.ownerHelp,
          aliases: musicbot.ownerAlt,
          admin: false,
          run: "ownerCommands"
        };
        musicbot.commands.set(musicbot.ownerCmd, owner_props);
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
      };

      // Load the aliases. Hopefully.
      for (var i = 0; i < musicbot.commands.length; i++) {
        let command = musicbot.commands[i];
        if (command.aliases.length > 0) {
          for (var a = 0; a < command.aliases.length; a++) {
            if (musicbot.logging) console.log(`[MUSIC] Mapping aliase for ${command.name}, ${command.aliases[a]}`);
            let props = {
              name: command.name,
              usage: command.usage,
              disabled: command.disabled,
              help: command.help,
              aliases: command.aliases,
              admin: command.admin,
              run: command.run
            };
            musicbot.aliases.set(command.aliases[a], props);
          };
        };
      };
    } catch (e) {
      console.log(e.stack);
      process.exit(1);
    };
  };
  musicBotStart();

  //Set the YouTube API key.
  const search = new YTSearcher({
    key: musicbot.youtubeKey,
    revealkey: true
  });

  // Catch message events.
  client.on('message', msg => {
    const message = msg.content.trim();

    if (musicbot.advancedMode.enabled && musicbot.advancedMode.multiPrefix) {
      if (musicbot.botPrefixs.has(msg.guild.id)) {
        // Get the custom prefix.
        const prefix = musicbot.botPrefixs.get(msg.guild.id).prefix;
        if (!message.startsWith(prefix)) return;

        // Get the command, suffix.
        const command = message.substring(prefix.toString().length).split(/[ \n]/)[0].trim();
        const suffix = message.substring(prefix.toString().length + command.length).trim();
        const args = message.slice(prefix.toString().length + command.length).trim().split(/ +/g);

        // Process the commands.
        if (musicbot.commands.has(command)) {
          let tCmd = musicbot.commands.get(command);
          if (!tCmd.disabled) return musicbot[tCmd.run](msg, suffix, args);
        } else if (musicbot.aliases.has(command)) {
          let aCmd = musicbot.commands.get(command);
          if (!aCmd.disabled) return musicbot[aCmd.run](msg, suffix, args);
        };
      } else if (message.startsWith(musicbot.botPrefix)) {
        // Get the command, suffix.
        const command = message.substring(musicbot.botPrefix.length).split(/[ \n]/)[0].trim();
        const suffix = message.substring(musicbot.botPrefix.length + command.length).trim();
        const args = message.slice(musicbot.botPrefix.length + command.length).trim().split(/ +/g);

        // Process the commands.
        if (musicbot.commands.has(command)) {
          let tCmd = musicbot.commands.get(command);
          if (!tCmd.disabled) return musicbot[tCmd.run](msg, suffix, args);
        } else if (musicbot.aliases.has(command)) {
          let aCmd = musicbot.commands.get(command);
          if (!aCmd.disabled) return musicbot[aCmd.run](msg, suffix, args);
        };
      };
    } else if (message.startsWith(musicbot.botPrefix)) {
      // Get the command, suffix.
      const command = message.substring(musicbot.botPrefix.length).split(/[ \n]/)[0].trim();
      const suffix = message.substring(musicbot.botPrefix.length + command.length).trim();
      const args = message.slice(musicbot.botPrefix.length + command.length).trim().split(/ +/g);

      // Process the commands.
      if (musicbot.commands.has(command)) {
        let tCmd = musicbot.commands.get(command);
        if (!tCmd.disabled) return musicbot[tCmd.run](msg, suffix, args);
      } else if (musicbot.aliases.has(command)) {
        let aCmd = musicbot.commands.get(command);
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
          musicbot.aliveMessage = musicbot.aliveMessage.replace(/{{username}}/g, `${client.user.username}`).replace(/{{starttime}}/g, `${client.readyAt}`);
        }
        console.log(musicbot.aliveMessage);
      }, musicbot.aliveMessageTime);
    };
    var startmsg = `------- ${client.user.username} -------\n> version: ${PACKAGE.version}\n> ytdl version: ${require('../ytdl-core/package.json').version}\n> Extra logging disabled.\n> Global queues are disabled.\n> node: ${process.version}\n------- ${client.user.username} -------`;
    if (musicbot.logging) startmsg = startmsg.replace("Extra logging disabled.", "Extra logging enabled.");
    if (musicbot.global) startmsg = startmsg.replace("Global queues are disabled.", "Global queues are enabled.");
    console.log(startmsg);
    if (!musicbot.enableQueueStat) console.log(`[MUSIC] enableQueueStat is 'false'. Queue will not have a Playing/Paused indicator.`);
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
  musicbot.getQueue = (server) => {
    // Check if global queues are enabled.
    if (musicbot.global) server = '_'; // Change to global queue.

    // Return the queue.
    if (!musicbot.queues[server]) musicbot.queues[server] = [];
    return musicbot.queues[server];
  };

  /**
   * Gets the looping status of the server.
   *
   * @param {integer} server - The server id.
   * @returns {boolean} - The queue state.
   */
  musicbot.loopState = (server) => {
    if (musicbot.global) return false;
    if (!musicbot.loops[server]) {
      musicbot.loops[server] = {
        looping: false,
        last: null
      };
    };
    if (musicbot.loops[server].looping) return true;
    else if (!musicbot.loops[server].looping) return false;
  };

  /**
   * Sets the looping status of the server.
   *
   * @param {integer} server - The server id.
   * @returns {boolean} - The queue state.
   */
  musicbot.setLoopState = (server, state) => {
    if (state && typeof state !== 'boolean') return console.log(`[loopingSet] ${new Error(`state wasnt a boolean`)}`);
    if (!musicbot.loops[server]) {
      musicbot.loops[server] = {
        looping: false,
        last: null
      };
    };
    if (!state) return musicbot.loops[server].looping = false;
    if (state) return musicbot.loops[server].looping = true;
  };

  /**
   * Sets the last played song of the server.
   *
   * @param {integer} server - The server id.
   */
  musicbot.setLast = (server, last) => {
    if (musicbot.global) return null;
    if (!last) musicbot.loops[server].last = null;
    else if (last) musicbot.loops[server].last = last;
  };

  /**
   * Gets the last played song of the server.
   *
   * @param {integer} server - The server id.
   * @returns {string} - The last played song.
   */
  musicbot.getLast = (server) => {
    if (!musicbot.loops[server]) {
      musicbot.loops[server] = {
        looping: false,
        last: null
      };
    };
    if (!musicbot.loops[server].last) return null;
    else if (musicbot.loops[server].last) return musicbot.loops[server].last;
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
      if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
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
        embed.setColor(0x27e33d);
        setTimeout(() => {
          if (musicbot.messageHelp) {
            let sent = false;
            msg.author.send({
              embed
            }).then(() => {
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
            }).then(() => {
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
    } else if (musicbot.commands.has(command)) {
      if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
        const embed = new Discord.RichEmbed();
        command = musicbot.commands.get(command);
        embed.setAuthor(command.name, msg.client.user.avatarURL);
        embed.setDescription(command.help);
        if (command.aliases.length > 0) embed.addField(`Aliases`, command.aliases.join(", "), musicbot.inlineEmbeds);
        if (command.usage !== null) embed.addField(`Usage`, command.usage, musicbot.inlineEmbeds);
        embed.setColor(0x27e33d);
        msg.channel.send({
          embed
        });
      } else {
        command = musicbot.commands.get(command);
        var cmdhelp = `= ${command.name} =\n`;
        cmdhelp + `\n${command.help}`;
        if (command.usage !== null) cmdhelp = cmdhelp + `\nUsage: ${command.usage}\n`;
        if (command.aliases.length > 0) cmdhelp = cmdhelp + `\nAliases: ${command.aliases.join(", ")}`;
        msg.channel.send(cmdhelp, {
          code: 'asciidoc'
        });
      };
    } else if (musicbot.aliases.has(command)) {
      if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
        const embed = new Discord.RichEmbed();
        command = musicbot.aliases.get(command);
        embed.setAuthor(command.name, msg.client.user.avatarURL);
        embed.setDescription(command.help);
        if (command.aliases.length > 0) embed.addField(`Aliases`, command.aliases.join(", "), musicbot.inlineEmbeds);
        if (command.usage !== null) embed.addField(`Usage`, command.usage, musicbot.inlineEmbeds);
        embed.setColor(0x27e33d);
        msg.channel.send({
          embed
        });
      } else {
        command = musicbot.aliases.get(command);
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
    if (msg.member.voiceChannel === undefined) return msg.channel.send(musicbot.note('fail', `You're not in a voice channel~`));

    // Make sure the suffix exists.
    if (!suffix) return msg.channel.send(musicbot.note('fail', 'No video specified!'));

    // Get the queue.
    const queue = musicbot.getQueue(msg.guild.id);

    // Check if the queue has reached its maximum size.
    if (queue.length >= musicbot.maxQueueSize) return msg.channel.send(musicbot.note('fail', 'Maximum queue size reached!'));

    // Get the video information.
    // I don't know why I use trim when I don't need to... Yeah.
    var searchstring = suffix.trim();
    msg.channel.send(musicbot.note('search', `Searching: \`${searchstring}\``)).then(response => {
      if (searchstring.startsWith('http') && searchstring.includes("list=")) {
        var playid = searchstring.toString().split('list=')[1];
        if (playid.toString().includes('?')) playid = playid.split('?')[0];
        if (playid.toString().includes('&t=')) playid = playid.split('&t=')[0];

        ypi.playlistInfo(musicbot.youtubeKey, playid, function(playlistItems) {
          const newItems = Array.from(playlistItems);
          var index = 0;
          var ran = 0;

          newItems.forEach(video => {
            ran++;
            if (queue.length !== (musicbot.maxQueueSize + 1) && video.resourceId.kind == 'youtube#video') {
              if (!video.url) video.url = `https://www.youtube.com/watch?v=` + video.resourceId.videoId;
              video.requester = msg.author.id;
              if (musicbot.requesterName) video.requesterAvatarURL = msg.author.displayAvatarURL;
              queue.push(video);
              if (queue.length === 1) musicbot.executeQueue(msg, queue);
              index++;
            };
            if (ran == newItems.length) {
              if (index = 0) msg.channel.send(musicbot.note('fail', `Coudln't get any songs from that play list.`))
              else if (index == 1) msg.channel.send(musicbot.note('note', `Queued one song.`));
              else if (index > 1) msg.channel.send(musicbot.note('note', `Queued ${index} songs.`));
            }
          });
        });
      } else {
        search.search(searchstring, { type: 'video' }).then(searchResult => {
          if (!searchResult.totalResults || searchResult.totalResults === 0) return response.edit(musicbot.note('fail', 'Failed to get search results.'));
          var result = searchResult.first;
          result.requester = msg.author.id;
          result.channelURL = `https://www.youtube.com/channel/${result.channelId}`;
          if (musicbot.requesterName) result.requesterAvatarURL = msg.author.displayAvatarURL;
          queue.push(result);
          if (queue.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue);
        });
      }
    }).catch(console.log);
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
    if (queue.length >= musicbot.maxQueueSize) return msg.channel.send(musicbot.note('fail', 'Maximum queue size reached!'));

    // Get the video information.
    // This is pretty much just play but 10 results to queue.
    var searchstring = suffix.trim();
    msg.channel.send(musicbot.note('search', `Searching: \`${searchstring}\``)).then(response => {
        search.search(searchstring, { type: 'video' }).then(searchResult => {
          if (!searchResult.totalResults || searchResult.totalResults === 0) return response.edit(musicbot.note('fail', 'Failed to get search results.'));

          const startTheFun = async (videos, max) => {
              const embed = new Discord.RichEmbed();
              embed.setTitle(`Choose Your Video`);
              embed.setColor(0x27e33d);
              var index = 0;
              videos.forEach(function(video) {
                index++;
                embed.addField(`${index} (${video.channelTitle})`, `[${musicbot.note('font', video.title)}](${video.url})`, musicbot.inlineEmbeds);
              });
              embed.setFooter(`Search by: ${msg.author.username}`, msg.author.displayAvatarURL);
              msg.channel.send({embed}).then(firstMsg => {
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
                    return msg.channel.send(musicbot.note('note', `Queued **${musicbot.note('font', videos[song_number].title)}**`)).then(() => {
                      queue.push(videos[song_number]);
                      if (queue.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue);
                    }).catch(console.log);
                  };
                })
                .catch(collected => {
                  if (collected.toString().match(/error|Error|TypeError|RangeError|Uncaught/)) return firstMsg.edit(`\`\`\`xl\nSearching canceled. ${collected}\n\`\`\``);
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
            videos.push(result);
            if (i === max) {
              i = 101;
              startTheFun(videos, max);
            }
          };
        });
    }).catch(console.log);
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

    if (!musicbot.canSkip(msg.member, queue)) return msg.channel.send(musicbot.note('fail', `You cannot skip this as you didn't queue it.`)).then((response) => {
      response.delete(5000);
    });

    var first = musicbot.loopState(msg.guild.id);
    if (first) musicbot.setLoopState(msg.guild.id, false);

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
        if (musicbot.logging) return console.log(new Error(`dispatcher null on pay cmd [${msg.guild.name}] [${msg.author.username}]`));
      };
      if (voiceConnection.paused) dispatcher.resume();
      dispatcher.end();
    } catch (e) {
      if (musicbot.logging) console.log(new Error(`Play command dispatcher error from userID ${msg.author.id} in guildID ${msg.guild.id}\n${e.stack}`));
      const nerr = e.toString().split(':');
      return msg.channel.send(musicbot.note('fail', `Error occoured!\n\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``));
    };

    if (first) return msg.channel.send(musicbot.note('note', 'Skipped **' + toSkip + '**! (Disabled Looping)'));
    msg.channel.send(musicbot.note('note', 'Skipped **' + toSkip + '**!'));
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
    const queue = musicbot.getQueue(msg.guild.id);
    if (queue.length === 0) return msg.channel.send(musicbot.note(`note`, `The queue is empty.`));
    let text;
    // Get the queue text.
    // Choice added for names to shorten the text a bit if wanted.
    if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
      const songNum = suffix ? parseInt(suffix) : 0;
      let maxRes = queue.length;

      if (songNum > 0) {
        if (songNum > queue.length) return msg.channel.send(musicbot.note('fail', 'Not a valid song number.'));
        const embed = new Discord.RichEmbed();
        const reqMem = client.users.get(queue[songNum].requester);
        embed.setAuthor(`Queued Song #${suffix}`, client.user.avatarURL);
        embed.addField(queue[songNum].channelTitle, `[${queue[songNum].title}](${queue[songNum].url})`, musicbot.inlineEmbeds);
        embed.setThumbnail(queue[songNum].thumbnails[musicbot.thumbnailType].url);
        embed.setColor(0x27e33d);
        if (musicbot.requesterName && reqMem) embed.setFooter(`Queued by: ${reqMem.username}`, queue[songNum].requesterAvatarURL);
        if (musicbot.requesterName && !reqMem) embed.setFooter(`Queued by: \`UnknownUser (id: ${queue[songNum].requester})\``, queue[songNum].requesterAvatarURL)
        msg.channel.send({
          embed
        });
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
            embed.addField(`${queue[i].channelTitle}`, `[${queue[i].title}](${queue[i].url})`, musicbot.inlineEmbeds);
          };
          embed.setColor(0x27e33d);
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
            (index + 1) + ': ' + video.title + ' | Requested by ' + client.users.get(video.requester).username
          )).join('\n');
        } else {
          text = queue.map((video, index) => (
            (index + 1) + ': ' + video.title
          )).join('\n');
        };
      } catch (e) {
        if (musicbot.logging) console.log(`[${msg.guild.name}] [queueCmd] ` + e.stack);
        const nerr = e.toString().split(':');
        return msg.channel.send(musicbot.note('fail', `Error occoured!\n\`\`\`\n${nerr[0]}: ${nerr[1]}\n\`\`\``));

      } finally {

        if (text.length > 1900) {
          const newText = text.substr(0, 1899);
          const otherText = text.substr(1900, text.length);
          if (otherText.length > 1900) {
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
    if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music is being played.'));
    const dispatcher = voiceConnection.player.dispatcher;
    const queue = musicbot.getQueue(msg.guild.id);
    if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
      const embed = new Discord.RichEmbed();
      try {
        embed.setAuthor('Now Playing', client.user.avatarURL);
        var songTitle = queue[0].title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`');
        embed.setColor(0x27e33d);
        embed.addField(queue[0].channelTitle, `[${songTitle}](${queue[0].url})`, musicbot.inlineEmbeds);
        embed.setThumbnail(queue[0].thumbnails.high.url);
        const resMem = client.users.get(queue[0].requester);
        if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(queue[0].requester).username}`, queue[0].requesterAvatarURL);
        if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${queue[0].requester})\``, queue[0].requesterAvatarURL);
        msg.channel.send({
          embed
        });
      } catch (e) {
        console.log(`[${msg.guild.name}] [npCmd] ` + e.stack);
      };
    } else {
      try {
        var songTitle = queue[0].title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`');
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
  musicbot.pause = (msg, suffix) => {
    musicbot.dInvoker(msg)
    // Get the voice connection.
    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
    if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music being played.'));

    if (!musicbot.isAdmin(msg.member)) return msg.channel.send(musicbot.note('fail', 'Only Admins are allowed to use this command.'));

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

    if (musicbot.isAdmin(msg.member) && musicbot.anyoneCanLeave !== true) {
      const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'I\'m not in a voice channel.'));
      // Clear the queue.
      const queue = musicbot.getQueue(msg.guild.id);
      queue.splice(0, queue.length);

      // End the stream and disconnect.
      if (!voiceConnection.player.dispatcher) return;
      voiceConnection.player.dispatcher.end();
      voiceConnection.disconnect();
      musicbot.setLoopState(msg.guild.id, false);
      msg.channel.send(musicbot.note('note', 'Successfully left your voice channel!'));
    } else {
      const chance = Math.floor((Math.random * 100) + 1);
      if (chance <= 10) return msg.channel.send(musicbot.note('fail', `I'm afraid I can't let you do that, ${msg.author.username}.`))
      else return msg.channel.send(musicbot.note('fail', 'Only Admins are allowed to use this command.'));
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

    if (musicbot.isAdmin(msg.member)) {
      const queue = musicbot.getQueue(msg.guild.id);
      const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'I\'m not in a channel!'));

      queue.splice(0, queue.length);
      msg.channel.send(musicbot.note('note', 'Queue cleared~'));

      voiceConnection.player.dispatcher.end();
      voiceConnection.disconnect();
      musicbot.setLoopState(msg.guild.id, false);
    } else {
      msg.channel.send(musicbot.note('fail', `Only Admins are allowed to use this command.`));
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

    if (!musicbot.isAdmin(msg.member))
      return msg.channel.send(musicbot.note('fail', 'Only Admins are allowed to use this command.'));

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

    // Get the queue.
    const queue = musicbot.getQueue(msg.guild.id);

    if (!musicbot.canAdjust(msg.member, queue))
      return msg.channel.send(musicbot.note('fail', 'Only Admins are allowed to use this command.'));

    // Get the dispatcher
    const dispatcher = voiceConnection.player.dispatcher;

    if (suffix > 200 || suffix < 0) return msg.channel.send(musicbot.note('fail', 'Volume out of range!')).then((response) => {
      response.delete(5000);
    });

    msg.channel.send(musicbot.note('note', 'Volume set to ' + suffix));
    dispatcher.setVolume((suffix / 100));
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

    const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
    if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', 'No music is being played.'));

    const looping = musicbot.loopState(msg.guild.id);

    if (looping) {
      musicbot.setLoopState(msg.guild.id, false);
      return msg.channel.send(musicbot.note('note', 'Looping disabled! :arrow_forward:'));
    } else if (!looping) {
      musicbot.setLoopState(msg.guild.id, true);
      return msg.channel.send(musicbot.note('note', 'Looping enabled! :repeat_one:'));
    };
  };

  /**
   * Owner command functions.
   *
   * @param {Message} msg - Original message.
   * @param {string} suffix - Command suffix.
   */
  musicbot.ownerCommands = (msg, suffix) => {
    return;
    // Disabed for now.
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
      const newPrefix = args.slice(1, args.length).join(" ");
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
    // If the queue is empty, finish.
    if (queue.length === 0) {
      msg.channel.send(musicbot.note('note', 'Playback finished.'));

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
        } else if (!msg.member.voiceChannel.joinable) {
          msg.channel.send(musicbot.note('fail', 'I do not have permission to join your voice channel!'))
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

      // Play the video.
      try {
        if (!musicbot.global) {
          const lvid = musicbot.getLast(msg.guild.id);
          musicbot.setLast(msg.guild.id, video);
          if (lvid !== video) musicbot.np(msg);
        };
        let dispatcher = musicbot.streamMode == 0 ? connection.playStream(ytdl(video.url, {filter: 'audioonly'}), { volume: (musicbot.defVolume / 100) }) : connection.playStream(stream(video.url), { volume: (musicbot.defVolume / 100) });

        connection.on('error', (error) => {
          // Skip to the next song.
          console.log(`Dispatcher/connection: ${error}`);
          if (msg && msg.channel) msg.channel.send(musicbot.note('fail', `Dispatcher error!\n\`${error}\``));
          queue.shift();
          musicbot.executeQueue(msg, queue);
        });

        dispatcher.on('error', (error) => {
          // Skip to the next song.
          console.log(error);
          console.log(`Dispatcher: ${error}`);
          if (msg && msg.channel) msg.channel.send(musicbot.note('fail', `Dispatcher error!\n\`${error}\``));
          queue.shift();
          musicbot.executeQueue(msg, queue);
        });

        dispatcher.on('end', () => {
          var isLooping = musicbot.loopState(msg.guild.id)
          // Wait a second.
          setTimeout(() => {
            if (isLooping) {
              musicbot.executeQueue(msg, queue);
            } else {
              if (queue.length > 0) {
                // Remove the song from the queue.
                queue.shift();
                // Play the next song in the queue.
                musicbot.executeQueue(msg, queue);
              }
            }
          }, 1000);
        });
      } catch (error) {
        console.log(error);
      }
    }).catch((error) => {
      console.log(error);
    });
  };

  //Text wrapping and cleaning.
  musicbot.note = (type, text) => {
    if (type === 'wrap') {
      ntext = text
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
      console.log(new Error(`${type} was an invalid type`));
    }
  };
};
