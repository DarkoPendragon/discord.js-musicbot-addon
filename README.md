[![npm package](https://nodei.co/npm/discord.js-musicbot-addon.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/discord.js-musicbot-addon/)  
[![Discord Server](https://discordapp.com/api/guilds/360519133219127297/embed.png)](https://discord.gg/cADwxKs)  [![Downlaods](https://img.shields.io/npm/dt/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)  [![Version](https://img.shields.io/npm/v/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)
***
This module may be buggy and need some fine tuning. Feel free to let me know what problems you encounter by opening an issue on the repo.
This was originally an update of the original bot from [ruiqimao](https://github.com/ruiqimao/discord.js-music) by [nexu-dev](https://www.npmjs.com/package/discord.js-music-v11), but is now a updated version for [Discord.js](https://discord.js.org/)'s version 11.2^. Fixes deprecated warnings, video playback issues, along with various other add-ons and tweaks to the priors.  

_Note: the 1.3.x+ update(S) requires a code change from 1.2.0, see the examples/notes below._  

__The commands available are: (default names)__  
* `musichelp [command]`: Displays help text for commands by this addon, or help for a specific command.
* `play <url>|<search string>`: Play audio from YouTube.
* `skip [number]`: Skip a song or multi songs with skip [some number],
* `queue`: Display the current queue.
* `pause`: Pause music playback. (requires music manager).
* `resume`: Resume music playback. (requires music manager).
* `volume`: Adjust the playback volume between 1 and 200 (requires music manager).
* `leave`: Clears the song queue and leaves the channel.
* `clearqueue`: Clears the song queue.

__Permissions:__  
* If `anyoneCanSkip` is false then only admins and the user that requested the song can skip it.
* If `anyoneCanAdjust` is true, anyone can adjust the volume. False is only admins.
* If `ownerOverMember` is true, the set ID of the user (your ID) will over-ride CanAjust and CanSkip.

***
# Installation
***  
__Pre-installation:__  
1. `npm install discord.js`  
It is recommended to have the stable over dev branch.  

2. `ffmpeg installed` and in your PATH.  
Allows the bot to join voice as well as speak.
* Download the ffmpeg package for your system.
* Extract it to the proper place.
* Set it to your PATH environment variables.

3. `npm install node-opus` or `npm install opusscript`  
Required for voice. Discord _prefers_ node-opus, but it is your choice.

__Installation:__  
* `npm install discord.js-musicbot-addon`

__Common installation issues:__  
__Issue:__ FFMPEG was not found on your system.  
__Fix:__ Make sure ffmpeg is installed correctly and set in your PATH variable.  

__Issue:__ Couldn't find an Opus engine.  
__Fix:__ `npm install node-opus` or `npm install opusscript`  

__Issue:__ [NPM] ERR Cannot read property '0' of undefined  
__Fix:__ `npm i -g npm@4.6.1` or another lower version of npm.  

__Issue:__ TypeError: Invalid non-string/buffer chunk  
__Fix:__ `ffmpeg` is required, if you installed `ffmpeg-binaries` uninstall that and install `ffmpeg`. If that isn't your problem make sure you have it installed correctly.  

__Issue:__ Any node-gyp errors. (build fail, missing cl.exe, etc.)  
__Fix:__ This one is a little more complicated.  
1. Download and install [Visual Studio 2015](https://www.visualstudio.com/downloads/)  
2. New project -> Visual C++  
3. Install Visual C++  

If that doesn't fix your issue;  
1. Download and install the [Windows 8.1 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-8-1-sdk)  

__Issue:__ `ffluent-ffmpeg` errors.
1. Download and install ffmpeg correctly for your OS.
2. Make sure it's in your PATH/exported.  

***
# Examples & Options
***  
This addon is easy to use, and doesn't require any configuration.  
More examples can be found on the repo in `examples` or once downloaded.  

__Example basic code, standalone:__
```javascript
const Discord = require('discord.js');
const Music = require('discord.js-musicbot-addon');
const <client> = new Discord.Client();

const music = new Music(<client>,
  youtubeKey: 'sum-key_hhereas'
);
<client>.login(token);
```

__Most options are optional and thus not needed.__  
The options you can pass in `music(client, {options})` and their types is as followed:  
* youtubeKey: *Required*, string, a YouTube API3 key.
* botPrefix: String, the prefix of the bot. Defaults to "!".
* global: Boolean, whether to use one global queue or server specific ones. Defaults false.
* maxQueueSize: Number, max queue size allowed. Defaults 20.
* defVolume: Number, the default volume of music. 1 - 200, defaults 50.
* anyoneCanSkip: Boolean, whether or not anyone can skip. Defaults false.
* clearInvoker: Boolean, whether to delete command messages. Defaults false.
* helpCmd: String, name of the help command.
* disableHelp: Boolean, disable the help command.
* playCmd: String, name of the play command.
* disablePlay: Boolean, disable the play command.
* skipCmd: String, name of the skip command.
* disableSkip: Boolean, disable the skip command.
* queueCmd: String, name of the queue command.
* disableQueue: Boolean, disable the queue command.
* pauseCmd: String, name of the pause command.
* disablePause: Boolean, disable the pause command.
* resumeCmd: String, name of the resume command.
* disableResume: Boolean, disable the resume command.
* volumeCmd: String, name of the volume command.
* disableVolume: Boolean, disable the volume command.
* leaveCmd: String, name of the leave command.
* disableLeave: Boolean, disable the leave command.
* clearCmd: String, name of the clear command.
* disableClear: Boolean, disable the clear command.
* loopCmd: String, name of the loop command.
* disableLoop: Boolean, disable the loop command.
* enableQueueStat: Boolean, whether to enable the queue status, old fix for an error that probably won't occur.
* anyoneCanAdjust: Boolean, whether anyone can adjust volume. Defaults false.
* ownerOverMember: Boolean, whether the owner over-rides CanAdjust and CanSkip. Defaults false.
* botOwner: String, the ID of the Discord user to be seen as the owner. Required if using ownerOverMember.
* logging: Boolean, some extra none needed logging (such as caught errors that didn't crash the bot, etc). Defaults false.  
* enableAliveMessage: Boolean, enables the bot to log a message in the console every x milliseconds.
* aliveMessage: String, the message to be logged.\*_note_
* aliveMessageTime: Number, time in _**milliseconds**_ the bot logs the message. Defaults to 600000 (5 minutes).
* requesterName: Boolean, whether or not to display the username of the song requester.

\* defaut for aliveMessage looks like:
```
----------------------------------
'BotUsername' online since 'lastReadyTime'!
----------------------------------
```

For the youtube API3 key, something [like this article](https://elfsight.com/help/how-to-get-youtube-api-key/) should help with that, or google how to get a YouTube API3 key from the Google console.  

An example of a few custom options would be:  
```javascript
const music = new Music(client, {
  prefix: ">",
  maxQueueSize: "100",
  disableLoop: true,
  disableClear: true,
  helpCmd: 'mhelp',
  playCmd: 'music',
  leaveCmd: 'begone',
  ownerOverMember: true,
  botOwner: '1234567890',
  youtubeKey: 'some-key_here'
});
```

Again if you have any issues, feel free to open one on the repo, or join my [Discord server](https://discord.gg/cADwxKs) for personal help.

***
# Changelog
***  
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

## 1.6
* Removed asynchronous functions since some people don't like using the latest and greatest.
* Added enabling/disabling commands.
* Added looping.
* "Class" update.
* Fixed some errors/bugs from 1.5.  
* Added alive message function && (heh) options.
* Removed enabling/disabling commands until further notice.
* Added all additions from pull requests to the main npm module.
* Updated examples.

## 1.5.1
* Added playlist support (thanks Rodabaugh for reminding me).
* Fixed `clearqueue` crashing if queue is empty.
* Fixed `skip` crashing if the queue is empty.
* Now requires `ffmpeg` installed over `ffmpeg-binaries`.  

## 1.4.0  
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

## 1.3.0:  
* Added errors.
* Fixed volume crashing the bot (thanks TheTimmaeh).
* Added future support for events.
* Minor bug fixes.

## 1.2.0:  
* Marked "stable".
* Finished module for full public access.  

## 1.1.0 and lower:
* No idea.
