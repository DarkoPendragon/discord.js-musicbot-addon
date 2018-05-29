[![npm package](https://nodei.co/npm/discord.js-musicbot-addon.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/discord.js-musicbot-addon/)  
[![Discord Server](https://discordapp.com/api/guilds/427239929924288532/embed.png)](https://discord.gg/FKYrX4X)  [![Downlaods](https://img.shields.io/npm/dt/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)  [![Version](https://img.shields.io/npm/v/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)
***
*For some reason, The Den (discord server) no longer exists. A new server has been created and will be re-made overtime for those interested in joining. https://discord.gg/FKYrX4X*  
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

__Permissions:__  
* If `anyoneCanSkip` is true, anyone can skip songs in the queue.
* If `anyoneCanAdjust` is true, anyone can adjust the volume.
* If `ownerOverMember` is true, the set ID of the user (`botOwner`) will over-ride CanAjust and CanSkip.

***
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

Music.start(client, {
  youtubeKey: 'sum-key_hhereas'
});

client.login("token");
```  

***
# Options & Config.
***
__Most options are optional and thus not needed.__  
The options you can pass in `Music.start(client, {options})` and their types is as followed:  

## Basic Options.
| Option | Type | Description | Default |
| --- | --- | --- | --- |  
| youtubeKey | String | A YouTube Data API3 key. Required to run. | NaN |
| botPrefix | String | The prefix of the bot. | ! |
| thumbnailType | String | Type of thumbnails to use for videos on embeds. Can equal: default, medium, high. | default |
| global | Boolean | Use a global (all-in-one) queue over server specific ones. | false |
| maxQueueSize | Number | Max queue size allowed. | 20 |
| defVolume | Number | The default volume of music. 1 - 200. | 50 |
| anyoneCanSkip | Boolean | Allow anyone to skip. | false |
| anyoneCanPause | Boolean | _*New!*_ Allow anyone to pause/resume. | false |
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
| embedColor | Array, Number, String | Color resolvable for embeds produced by the bot. | 'GREEN' |
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

***
# Changelog
***  
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

## 11.0.3
* Fixed `search` not setting a `queuedOn`.
* Fixed `play`'s 'Queued Now' embed showing case.

## 11.0.2
* Added custom embed colors, see https://discord.js.org/#/docs/main/stable/typedef/ColorResolvable.

## 11.0.1
* Made `volume` no longer reduce volume on command usage with no suffix.
* Updated examples.

# 11.0.0
* Fixed `leave`, again.
* Added `verifyQueue` to hopefully fix some issues.
* Setting `maxQueueSize` to 0 will allow an unlimited queue.
* Reworked `exports` to allow data flow.
* Changed how the bot starts.
* `<Music>.start` instead of making it as a constructor.
* Added file: `classBotExample.js` in `exmaples`.

## 10.1.10
* Fixed `loop` single dispatcher error.

## 10.1.9
* Fixed `loop` typos.

## 10.1.8
* Play will display a "Queued Song" message again.
* Play's "Queued Song" message will only display if the queues first "Now Playing" message will not appear.

## 10.1.7
* Reowkred `getLast` & `setLast`.

## 10.1.6
* ~~Fixed `getLast` & `setLast`.~~
* Redid the way the bot sets aliases.

## 10.1.5
* `NPM` fixes.

## 10.1.2
* Fixed `play` showing 2 "Now Playing" events.
* `queuedOn` should now work.

## 10.1.0-b3
* Fixed `getLast` & `setLast`.

## 10.1.0-b2
* Note: 'b' means `beta`, and the following number is the push number.
* Added `anyoneCanPause`.
* Reworked `loop`, removed `loopState` & `setLoopState`.
* `loop` now has three options; none, single, queue.
* Some other stuff I probably forgot.
* Report beta bugs at: https://discord.gg/FKYrX4X

## 10.1.0
* Removed `youtube-aduio-stream`.
* Updated `README.md`.
* Play now displays a message on queue.
* Added time queued.
* Added `dateLocal` for time queued.

## 10.0.3-aplha
* A faux update to alert people of the old server just poofing out of existence. _*DO NOT*_ use it for production use, as it is broken.

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

# 1.10.0
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

# 1.9.0  
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
* ~~Actually fixed the play function queueing the wrong song.~~

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
