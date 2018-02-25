[![npm package](https://nodei.co/npm/discord.js-musicbot-addon.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/discord.js-musicbot-addon/)  
[![Discord Server](https://discordapp.com/api/guilds/360519133219127297/embed.png)](https://discord.gg/cADwxKs)  [![Downlaods](https://img.shields.io/npm/dt/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)  [![Version](https://img.shields.io/npm/v/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)
***
This module may be buggy and need some fine tuning. Feel free to let me know what problems you encounter by opening an issue on the repo.
This was originally an update of the original bot from [ruiqimao](https://github.com/ruiqimao/discord.js-music) by [nexu-dev](https://www.npmjs.com/package/discord.js-music-v11), but is now a updated version (again) for [Discord.js](https://discord.js.org/)'s version 11.2^. Fixes deprecated warnings, video playback issues, along with various other add-ons and tweaks to the priors. For support/questions join the [Discord server](https://discord.gg/cADwxKs) for a faster response than the repo.  

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
* `owner`: Various owner commands/actions. (W.I.P)

__Permissions:__  
* If `anyoneCanSkip` is true, anyone can skip songs in the queue.
* If `anyoneCanAdjust` is true, anyone can adjust the volume.
* If `ownerOverMember` is true, the set ID of the user (`botOwner`) will over-ride CanAjust and CanSkip.

***
# Installation
***  
__Pre-installation:__  
1. `npm install discord.js`  
It is recommended to have the stable branch.  

2. `ffmpeg installed` __correctly__ for your OS/env.  
Allows the bot to join voice as well as speak.  

3. `npm install node-opus` or `npm install opusscript`  
Required for voice. Discord.js _prefers_ node-opus.  

__Installation:__  
* `npm install discord.js-musicbot-addon`  

__Common installation issues:__  
__Issue: (Trivial)__ FFMPEG was not found on your system.  
__Fix:__ Make sure ffmpeg is installed correctly and set in your PATH variable.  

__Issue: (Uncommon)__ Couldn't find an Opus engine.  
__Fix:__ `npm install node-opus` or `npm install opusscript`  

__Issue: (Rare)__ [NPM] ERR Cannot read property '0' of undefined  
__Fix:__ `npm i -g npm@4.6.1` or another lower version of npm.  

__Issue: (Rare)__ TypeError: Invalid non-string/buffer chunk  
__Fix:__ Stop using `ffmpeg-binaries`. Seriously. It's been said enough to use `ffmpeg` itself by now.

__Issue: (Trivial)__ Any node-gyp errors. (build fail, missing cl.exe, etc.)  
__Fix:__ This one is a little more complicated.  
1. Download and install [Visual Studio 2015](https://www.visualstudio.com/downloads/)  
2. New project -> Visual C++  
3. Install Visual C++  

If that doesn't fix your issue;  
1. Download and install the [Windows 8.1 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-8-1-sdk)  

__Issue: (Uncommon)__ `ffluent-ffmpeg` errors.
1. Download and install ffmpeg correctly for your OS/env.
2. Stop asking and make __sure__ it's installed right.

***
# Basic Example.
***  
This addon is easy to use, and doesn't require any extra configuration besides a YouTube Data API key to run.  
More examples can be found on the repo or once downloaded in `examples`.  

__Example basic code, standalone:__
```javascript
const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const client = new Discord.Client();

const music = new Music(client, {
  youtubeKey: 'sum-key_hhereas'
});

client.login("token");
```  

***
# Options & Config.
***
__Most options are optional and thus not needed.__  
The options you can pass in `music(client, {options})` and their types is as followed:  
_Note: All boolean options default false._  

## Basic Options.
| Option | Type | Description |  
| --- | --- | --- |  
| youtubeKey | String | A YouTube Data API3 key. Required to run. |
| botPrefix | String | The prefix of the bot. Defaults to "!". |
| thumbnailType | String | Type of thumbnails to use for videos on embeds. Can equal: default, medium, high. |
| global | Boolean | Whether to use one global queue or server specific ones. |
| maxQueueSize | Number | Max queue size allowed. Defaults 20. |
| defVolume | Number | The default volume of music. 1 - 200, defaults 50. |
| anyoneCanSkip | Boolean | Whether or not anyone can skip. |
| clearInvoker | Boolean | Whether to delete command messages. |  
| messageHelp | Boolean | Whether to message the user on help command usage. If it can't, it will send it in the channel like normal. |
| botAdmins | Object/Array | An array of Discord user ID's to be admins as the bot. They will ignore permissions for the bot, including the set command. |

## Other Options.  
| Option | Type | Description |  
| --- | --- | --- |  
| enableQueueStat | Boolean | Whether to enable the queue status, old fix for an error that occurs for a few people. |
| anyoneCanAdjust | Boolean | Whether anyone can adjust volume. |
| ownerOverMember | Boolean | Whether the owner over-rides `CanAdjust` and `CanSkip`. |
| anyoneCanLeave | Boolean | Whether anyone can make the bot leave the currently connected channel. |
| botOwner | String | The ID of the Discord user to be seen as the owner. Required if using `ownerOverMember`. |
| logging | Boolean | Some extra none needed logging (such as caught errors that didn't crash the bot, etc). |
| enableAliveMessage | Boolean | Enables the bot to log a message in the console every x milliseconds. |
| aliveMessage | String | The message to be logged. \*_note_ |
| aliveMessageTime | Number | Time in _**milliseconds**_ the bot logs the message. Defaults to 600000 (5 minutes). |
| requesterName | Boolean | Whether or not to display the username of the song requester. |
| inlineEmbeds | Boolean | Whether or not to make embed fields inline (help command and some fields are excluded). |
| streamMode | Number | *New!* Sets what to use for streaming. 0 = ytdl-core, 1 = youtube-audio-stream. |  

## Command Options.  
| Option | Type | Description |  
| --- | --- | --- |  
| helpCmd | String | Name of the help command. |
| disableHelp | Boolean | Disable the help command. |
| helpHelp | String | Help text of the help command. |
| helpAlt | Array | Alt names (aliases) for the help command. |
| playCmd | String | Name of the play command. |
| disablePlay | Boolean | Disable the play command. |
| playHelp | String | Help text of the play command. |
| playAlt | Array | Alt names (aliases) for the play command. |
| skipCmd | String | Name of the skip command. |
| disableSkip | Boolean | Disable the skip command. |
| skipHelp | String | Help text of the skip command. |
| skipAlt | Array | Alt names (aliases) for the skip command. |
| queueCmd | String | Name of the queue command. |
| disableQueue | Boolean | Disable the queue command. |
| queueHelp | String | Help text of the queue command. |
| queueAlt | Array | Alt names (aliases) for the queue command. |
| pauseCmd | String | Name of the pause command. |
| disablePause | Boolean | Disable the pause command. |
| pauseHelp | String | Help text of the pause command. |
| pauseAlt | Array | Alt names (aliases) for the pause command. |
| resumeCmd | String | Name of the resume command. |
| disableResume | Boolean | Disable the resume command. |
| resumeHelp | String | Help text of the resume command. |
| resumeAlt | Array | Alt names (aliases) for the resume command. |
| volumeCmd | String | Name of the volume command. |
| disableVolume | Boolean | Disable the volume command. |
| volumeHelp | String | Help text of the volume command. |
| volumeAlt | Array | Alt names (aliases) for the volume command. |
| leaveCmd | String | Name of the leave command. |
| disableLeave | Boolean | Disable the leave command. |
| leaveHelp | String | Help text of the leave command. |
| leaveAlt | Array | Alt names (aliases) for the leave command. |
| clearCmd | String | Name of the clear command. |
| disableClear | Boolean | Disable the clear command. |
| clearHelp | String | Help text of the clear command. |
| clearAlt | Array | Alt names (aliases) for the clear command. |
| setCmd | String | Name of the set command. |
| disableSet | Boolean | Disable the set command. |
| setHelp | String | Help text of the set command. |
| setAlt | Array | Alt names (aliases) for the set command. |
| loopCmd | String | Name of the loop command. |
| disableLoop | Boolean | Disable the loop command. |
| loopHelp | String | Help text of the loop command. |
| loopAlt | Array | Alt names (aliases) for the loop command. |
| searchCmd | String | Name of the search command. |
| disableSearch | Boolean | Disable the search command. |
| searchHelp | String | Help text of the search command. |
| searchAlt | Array | Alt names (aliases) for the search command. |
| ownerCmd | String | Name of the owner command. |
| disableOwnerCmd | Boolean | Disable the owner command. |
| ownerHelp | String | Help text of the owner command. |
| ownerAlt | Array | Alt names (aliases) for the owner command. |  

An example of a few custom options would be:  
```javascript
const music = new Music(client, {
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

***
# Changelog
***  
## 1.10.3
* Removed `lockChan` and unused related items.

## 1.10.2
* Bot now supports multiple prefix's.
* Added `advancedMode`, `multiPrefix`, `advancedMode` object settings. Please see examples (advancedModeBot.js) or the discord server.
* Fixed `leave`.
* Fixed `note` function errors.
* Added `set` command.
* Boolean options are now always Booleans. Always.
* Added `botAdmins`. Adding an ID will allow this user to override every permission.

## 1.10.1
* Corrected `streamMode` error.

## 1.10.0
* Added the search command.
* Added the `thumbnailType` option.
* Play command now plays the first result instead of searching.
* Links might work now.
* `anyoneCanLeave` allows anyone to use `leave`.
* Maximum call stack errors should occur less or not at all.
* You can now change between using `ytdl-core` and `youtube-audio-stream` to stream music with `streamMode`.
* Small fixes.

## 1.9.1
* Fixed looping errors.
* May have fixed some link related errors.
* Added the `maxWait` option.
* Fixed command run functions.

## 1.9.0  
* Requires Node 8+.
* Added aliases support.  
* Small changes to some code.
* Started the `owner` command.
* Commands are now mapped on startup.
* Added custom help text for commands.
* Looping & last played are per-server.
* Looping & last played have new functions.
* Prefix and command names are now case sensitive.
* May have fixed some 'undefined' errors with play.
* Pause now doesn't pause if it's already paused. Yeah...
* Alive message now replaces `{{username}}` with the bots username.
* When looping music, no longer shows a "Now Playing" for the same song.
* Added `messageHelp`, if true will attempt message a user on help usage.
* Alive message now replaces `{{starttime}}` with the bots `readyAt` time.
* Help command now sends both embeds and non-embed messages according to permissions.
* Errors now display when queueing a song rather than showing "timed out" when one actually occurs. Probably.

## 1.8.2  
* _Actually_ fixed the play function queueing the wrong song. (_update: I lied_)

## 1.8.1  
* Fixed the queueing error within the play function.

# 1.8.0  
* Updated the searching for the play command, you can now choose out of 10 results.
* Tried to fix weird bug with link queueing, still broken.
* Probably caused more issues than I fixed.
* Removed maxChecks.

## 1.7.2
* Added `maxChecks` option.
* Now checks after searching for videos if the link to be played is a video.

## 1.7.1
* Fixed `clearInvoker`. I think.

# 1.7  
* Added fancy embeds to some commands.
* Able to use `!queue [songNumber]` to view info on a specific song in the queue.
* Checks whether the requester of the song is available for the bot.
* Stores the avi-url of the requester for the song.
* Prevents some errors from crashing the bot.
* Fixed the alive messages, along with a startup message (console).
* Added option (inlineEmbeds) to make embeds by the bot inline. See the [embed field documention](https://discord.js.org/#/docs/main/stable/class/RichEmbed?scrollTo=addField) for info.
* Fixed playlist fetching when the link had something like `&list=RDOeJKsrD791A&t=66` to prevent throwing errors or crashes.
* Looping force disables on `clearQueue`, `leave` and `skip`.
* Removed events/emitters because I forgot what the hell I was doing with them.

## 1.6.10
* Fixed queue, NowPlaying's.

## 1.6.8
* Added error catching for new features to help prevent bot crashing and error logging.
* Put random shit in so I could call this a real update.

## 1.6.7
* (probable) Error fix.

## 1.6.6
* rocky_road.jpeg  

## 1.6.5
* Fixed a typo from 1.6.4 that crashes the bot.

## 1.6.4
* Pull requests merged/edited (mcao, Erik). For most changes, take a look at their pull requests.
* Added requesterName.

## 1.6.3
* Brought back disabling commands.
* Fixed help function.

## 1.6.2
* Nothing notable.  

## 1.6.1
* Fixed some typos and minor errors.  

# 1.6
* Removed asynchronous functions since some people don't like using the latest and greatest.
* Added enabling/disabling commands.
* Added looping.
* "Class" update.
* Fixed some errors/bugs from 1.5.  
* Added alive message function && (heh) options.
* Removed enabling/disabling commands until further notice.
* Added all additions from pull requests to the main npm module.
* Updated examples.

# 1.5.1
* Added playlist support (thanks Rodabaugh for reminding me).
* Fixed `clearqueue` crashing if queue is empty.
* Fixed `skip` crashing if the queue is empty.
* Now requires `ffmpeg` installed over `ffmpeg-binaries`.  

# 1.4.0  
* Added wrapping.
* Added owner over member options.
* Fixed errors.  
* Reworked the playing music method.
* Fixed `UnknownSpawn` errors.
* Bot now requires your own YouTube Data API3 key for searching.
* Music is less likely to cut out now.
* Volume works again (again).

## 1.3.1 - 1.3.6
* These were testing updates to just see how it would work on different platforms, which code still needed to be fixed, error testing, etc.  

# 1.3.0:  
* Added errors.
* Fixed volume crashing the bot (thanks TheTimmaeh).
* Added future support for events.
* Minor bug fixes.

# 1.2.0:  
* Marked "stable".
* Finished module for full public access.  

## 1.1.0 and lower:
* No idea.
