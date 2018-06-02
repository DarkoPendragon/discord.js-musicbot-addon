[![npm package](https://nodei.co/npm/discord.js-musicbot-addon.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/discord.js-musicbot-addon/)  
[![Discord Server](https://discordapp.com/api/guilds/427239929924288532/embed.png)](https://discord.gg/FKYrX4X)  [![Downlaods](https://img.shields.io/npm/dt/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)  [![Version](https://img.shields.io/npm/v/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)

This was originally an update of the original bot from [ruiqimao](https://github.com/ruiqimao/discord.js-music) by [nexu-dev](https://www.npmjs.com/package/discord.js-music-v11), but is now a updated version (again) for [Discord.js](https://discord.js.org/)'s version 11.2^. Fixes deprecated warnings, video playback issues, along with various other add-ons and tweaks to the priors. This module may be buggy and need some fine tuning. Feel free to let me know what problems you encounter by opening an issue on the repo or joining the [Discord server](https://discord.gg/cADwxKs), where I or a `@Helper` will help you.

__The commands available are: (default names)__  
* `musichelp [command]`: Displays help text for commands by this addon, or help for a specific command.
* `play <url>|<search string>`: Play audio from YouTube.
* `skip [number]`: Skip a song or multi songs with skip [some number],
* `queue`: Display the current queue.
* `pause`: Pause music playback.
* `resume`: Resume music playback.
* `volume`: Adjust the playback volume between 1 and 200.
* `leave`: Clears the song queue and leaves the channel.
* `clearqueue`: Clears the song queue.

__Permissions:__  
* If `anyoneCanSkip` is true, anyone can skip songs in the queue.
* If `anyoneCanAdjust` is true, anyone can adjust the volume.
* If `ownerOverMember` is true, the set ID of the user (`botOwner`) will over-ride CanAjust and CanSkip.  

# Installation
***  
__Installation:__  
1. `npm install discord.js`  
2. `ffmpeg installed` _correctly_ for your OS/Env.
3. `npm install node-opus` or `npm install opusscript`
4. `npm install discord.js-musicbot-addon`  

__Common installation issues:__  
__Issue:__ FFMPEG was not found on your system.  
__Fix:__ Make sure ffmpeg is installed correctly and set in your PATH variable.  

__Issue:__ Couldn't find an Opus engine.  
__Fix:__ `npm install node-opus` or `npm install opusscript`  

__Issue:__ [NPM] ERR Cannot read property '0' of undefined  
__Fix:__ `npm i -g npm@4.6.1` or another lower version of npm.  

__Issue:__ TypeError: Invalid non-string/buffer chunk  
__Fix:__ Make sure you: A) Are using the latest version, B) Are using [ffmpeg](http://ffmpeg.org), C) Have Python 2.7.x installed, D) Have `ytdl-core` to the latest version.

__Issue:__ Any node-gyp errors. (build fail, missing cl.exe, etc.)  
__Fix:__ This one is a little more complicated.  
1. Download and install [Visual Studio 2015](https://www.visualstudio.com/downloads/)  
2. New project -> Visual C++  
3. Install Visual C++  

If that doesn't fix your issue;  
1. Download and install the [Windows 8.1 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-8-1-sdk)  

__Issue:__ `ffluent-ffmpeg` errors.
1. Download and install [ffmpeg](http://ffmpeg.org) correctly for your OS/env.
2. Export/Import/Set ffmpeg to your PATH.  

# Basic Example.
***  
This addon is easy to use, and doesn't require any extra configuration besides a YouTube Data API key to run.  
More examples can be found on the repo or once downloaded in `examples`.  

__Example basic code, standalone:__
```javascript
const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const client = new Discord.Client();

Music.start(client, {
  youtubeKey: 'sum-key_hhereas'
});

client.login("token");
```  

# Functions Outside The Bot
***
As of v11, the bot now uses exports to pass data along _after_ the bot has been started. As of v12.0.3 there are now several "easy-exports" that allow you to change/do things outside of the bot, assuming you have the bots data saved somewhere (an example of how to do so would be `/examples/classBotExample.js`). Replace `Music` with the music object after it has been started. A quic example:
```js
const Discord = require('discord.js');
class Bot extends Discord.Client {
  constructor(options) {
    super(options);
    this.music = require('discord.js-musicbot-addon');
  }
}
const client = new Bot();

client.music.start(client, {
  youtubeKey: "APIKEY"
});

const failureNote = client.music.note("fail", "That thing you just did failed!"); // musicbot.note() function.
// failureNote will equal: ':no_entry_sign: | That thing you just did failed!'

// Change the YouTube key provided at Music.start()
client.music.changeKey("YouTubeApiKeyString").then((res) => {
  // Will resolve with the new <musicbot> object.
}).catch(console.error); // Errors if no key or the tyeof the key isn't a string.

client.login("TOKEN");
```  

## Music.changeKey([key]);
```js
@param {key}: String - key string to set.  
@returns {promise}: Object - The new musicbot object.
// Will change the given YouTube API Key from startup, and reset the searcher object with the new key.
```

## Music.verifyQueue([queueObject]);
```js
@param {queueObject}: Object - Queue to check for errors.  
@returns {promise}: String - Resolves "pass" if fine, rejects on error.
// Will verify data, but unlike in `checkQueues` it will not change/null the queue data.  
```

## Music.isQueueEmpty([queueObject]);
```js
@param {queueObject}: Object - Queue to check.  
@returns {promise}: String/Boolean - Resolves a true/false for empty/non empty queue, rejects when no queue is passed.
```

## Music.note([type], [text]);
```js
@param {type}: String - Type of note to pass.  
@param {text}: String - Text of note to pass.  
@returns {text}: String - Errors on invalid type, returns the message with type provided.  
// Valid types for the `note` function are: `wrap`, `note`, `fail`, `search`, `font`.
```  

## Music.addAdmin([admin]);
```js
@param {admin}: String - ID of the user to set.  
@returns {botAdmins}: Object - Rejects on invalid/no admin passed, resolves the botAdmins object.
// Remember that these aren't permanent.
```  

## Music.getQueue([server]);
```js
@param {server}: String - ID of the server to get.  
@returns {queue}: Object - Rejects the queue of the server, or null if there is none.
```  

## Music.setQueue([data]);
```js
@param {server}: Object/String - Queue data structure or ID of server to set.
@returns {promise}: Object - Rejects if an error occurred, will fill in missing data, resolves the queue once set.
// You can either supply a queue (see below) or a server ID to set a blank queue.
// Example of a queue data structure:
const data = {
  songs: [], // Array object for videos.
  last: null, // Last played song object.
  loop: "none", // Can be "none", "single", "queue".
  id: "serverID" // ID that the queue belongs to.
}
```  

# Options & Config.
***
__Most options are optional and thus not needed.__  
The options you can pass in `Music.start(client, {options})` and their types is as followed:  

## Basic Options.
| Option | Type | Description | Default |
| --- | --- | --- | --- |  
| youtubeKey | String | A YouTube Data API3 key. Required to run. | NaN |
| prefix | String | The prefix of the bot. | ! |
| thumbnailType | String | Type of thumbnails to use for videos on embeds. Can equal: `default`, `medium`, `high`. | default |
| global | Boolean | Use a global (all-in-one) queue over server specific ones. | false |
| maxQueueSize | Number | Max queue size allowed. | 20 |
| defVolume | Number | The default volume of music. 1 - 200. | 50 |
| anyoneCanSkip | Boolean | Allow anyone to skip. | false |
| anyoneCanPause | Boolean | Allow anyone to pause/resume. | false |
| clearInvoker | Boolean | Delete messages that invoke a command. | false |
| messageHelp | Boolean | Message the user on help command usage. If it can't, it will send it in the channel like normal. | false |
| botAdmins | Array | An array of Discord user ID's to be admins as the bot. They will ignore permissions for the bot, including the set command. | [] |

## Other Options.  
| Option | Type | Description | Default |
| --- | --- | --- | --- |  
| enableQueueStat | Boolean | Enable the "Playing/Paused" queue indicator. | false |
| anyoneCanAdjust | Boolean | Allow anyone to adjust volume. | false |
| ownerOverMember | Boolean | Whether the owner over-rides `CanAdjust` and `CanSkip`. | false |
| anyoneCanLeave | Boolean | Allow anyone to use the `leave` command. | false |
| botOwner | String | The ID of the Discord user to be seen as the owner. Required if using `ownerOverMember`. | NaN |
| logging | Boolean | Some extra none needed logging (such as caught errors that didn't crash the bot, etc). | false |
| enableAliveMessage | Boolean | Enables the bot to log a message in the console every x milliseconds. | false |
| aliveMessage | String | The message to be logged. \*_note_ | "Bot online since blah blah" |
| aliveMessageTime | Number | Time in _**milliseconds**_ the bot logs the message. | 600000 |
| requesterName | Boolean | Display the username of the song requester. | false |
| inlineEmbeds | Boolean | Whether or not to make embed fields inline (help command and some fields are excluded). | false |
| embedColor | [ColorResolvable](https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable) | Color resolvable for embeds produced by the bot. | 'GREEN' |
| clearOnLeave | Boolean | Clear the queue on use of the leave command. | false |
| checkQueues | Boolean | If true, will periodically verify all queues every hour (from the latest `READY`). If something is wrong with a queue, the bot will nullify the queue and attempt to disconnect from voice connections from the server the queue belongs to. | false |  

## Command Options.  
| Option | Type | Description | Default |
| --- | --- | --- | --- |  
| helpCmd | String | Name of the help command. | help |
| disableHelp | Boolean | Disable the help command. | false |
| helpHelp | String | Help text of the help command. | Non-listed |
| helpAlt | Array | Alt names (aliases) for the help command. | [] |
| playCmd | String | Name of the play command. | play |
| disablePlay | Boolean | Disable the play command. | false |
| playHelp | String | Help text of the play command. | Non-listed |
| playAlt | Array | Alt names (aliases) for the play command. | [] |
| skipCmd | String | Name of the skip command. | skip |
| disableSkip | Boolean | Disable the skip command. | false |
| skipHelp | String | Help text of the skip command. | Non-listed |
| skipAlt | Array | Alt names (aliases) for the skip command. | [] |
| queueCmd | String | Name of the queue command. | queue |
| disableQueue | Boolean | Disable the queue command. | false |
| queueHelp | String | Help text of the queue command. | Non-listed |
| queueAlt | Array | Alt names (aliases) for the queue command. | [] |
| pauseCmd | String | Name of the pause command. | pause |
| disablePause | Boolean | Disable the pause command. | false |
| pauseHelp | String | Help text of the pause command. | Non-listed |
| pauseAlt | Array | Alt names (aliases) for the pause command. | [] |
| resumeCmd | String | Name of the resume command. | resume |
| disableResume | Boolean | Disable the resume command. | false |
| resumeHelp | String | Help text of the resume command. | Non-listed |
| resumeAlt | Array | Alt names (aliases) for the resume command. | [] |
| volumeCmd | String | Name of the volume command. | volume |
| disableVolume | Boolean | Disable the volume command. | false |
| volumeHelp | String | Help text of the volume command. | Non-listed |
| volumeAlt | Array | Alt names (aliases) for the volume command. | [] |
| leaveCmd | String | Name of the leave command. | leave |
| disableLeave | Boolean | Disable the leave command. | false |
| leaveHelp | String | Help text of the leave command. | Non-listed |
| leaveAlt | Array | Alt names (aliases) for the leave command. | [] |
| clearCmd | String | Name of the clear command. | clear |
| disableClear | Boolean | Disable the clear command. | false |
| clearHelp | String | Help text of the clear command. | Non-listed |
| clearAlt | Array | Alt names (aliases) for the clear command. | [] |
| setCmd | String | Name of the set command. | set |
| disableSet | Boolean | Disable the set command. | false |
| setHelp | String | Help text of the set command. | Non-listed |
| setAlt | Array | Alt names (aliases) for the set command. | [] |
| loopCmd | String | Name of the loop command. | loop |
| disableLoop | Boolean | Disable the loop command. | false |
| loopHelp | String | Help text of the loop command. | Non-listed |
| loopAlt | Array | Alt names (aliases) for the loop command. | [] |
| searchCmd | String | Name of the search command. | search |
| disableSearch | Boolean | Disable the search command. | false |
| searchHelp | String | Help text of the search command. | Non-listed |
| searchAlt | Array | Alt names (aliases) for the search command. | [] |  
| JoinCmd | String | Name of the join command. | search |
| disableJoin | Boolean | Disable the join command. | false |
| joinHelp | String | Help text of the join command. | Non-listed |
| joinAlt | Array | Alt names (aliases) for the join command. | [] |  

An example of a few custom options would be:  
```javascript
Music.start(client, {
  prefix: ">",
  maxQueueSize: "100",
  disableLoop: true,
  leaveHelp: "Bad help text.",
  leaveAlt: ["lve","leev","un1c0rns"],
  helpCmd: 'mhelp',
  leaveCmd: 'begone',
  ownerOverMember: true,
  botOwner: '123456789101112',
  youtubeKey: 'some-key_here'
});
```

# Changelog
***  
## 12.0.5
* Forgot to map the join command. Did that.

## 12.0.4
* Added a `join` command, and related options.
* Added `anyoneCanJoin`.
* Fixed `console.error` in the startup function.
* To save space, be it spall, examples are no longer downloaded with npm.

## 12.0.3
* Added some easy-exports incase you want to change up some shit. Will be listed above.
* Changed some console logging to make sure it logs as an error, not just data.
* Fixed `searchHelp` (used to be `searcHelp`... Yeah).

## 12.0.2
* Redid some parts of the `executeQueue` function.
* Redid a tiny bit of the `play`, `leave` functions.
* Redid the entire `isQueueEmpty` function.
* Lived another day.

## 12.0.1
* Fixed a `Promise` format error in `checkQueues`.
* Fixed `index.min.js`.

# 12.0.0
* `ownerOverMember` now overrides `canAdjust`.
* Re-worked queue system and related functions.
* `verifyQueue` changed to `isQueueEmpty`.
* Made a real update.
* Removed the `owner` command.
* Fixed aliases.
* Added an `index.min.js` file to the repo for people wanting to squeeze size.
* Added `clearOnLeave`.
* The bot will no longer clear the queue on `leave` unless `clearOnLeave` is true.
* Baked chocolate for my girlfriend.
* Added `checkQueues`. *Use only if needed.*
* Cleared browser history for the past week. #nekoparaForLife.

## 11.0.3 & Lower
* ~deprecated versions~
