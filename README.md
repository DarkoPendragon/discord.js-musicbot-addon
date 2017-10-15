# Discord.js Music Bot Addon  
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

__Issue:__ Any node-gyp errors. (build fail, missing cl.exe, etc.)  
__Fix:__ This one is a little more complicated.  
1. Download and install [Visual Studio 2015](https://www.visualstudio.com/downloads/)  
2. New project -> Visual C++  
3. Install Visual C++  

If that doesn't fix your issue;  
1. Download and install the [Windows 8.1 SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-8-1-sdk)  

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
The options you can pass in music(client, options) is as followed:  
* prefix: Prefix to set for commands.  
* global: true/false. If set to true, will use global queues, false will use server. (default false)  
* maxQueueSize: Max size of queues.
* anyoneCanSkip: Whether or not anyone can skip, true/false. Defaults false.
* anyoneCanAdjust: Whether or not anyone can set volume. Defaults false.
* clearInvoker: Whether or not to clear the command message.
* volume: Default volume. Anywhere from 1 to 200, default is 50.
* helpCmd: Name of the help command.
* playCmd: Sets the play command name.
* skipCmd: Sets the skip command name.
* queueCmd: Sets the queue command name.
* pauseCmd: Sets the name for the pause command.
* resumeCmd: Sets the name for the resume command.
* volumeCmd: Sets the name for the volume command.
* leaveCmd: Sets the name for the leave command.
* clearCmd: Sets the name for the clearqueue command.
* enableQueueStat: Disables or enables queue status (useful to prevent errors sometimes, defaults true).
* ownerOverMember: Makes it so you bypass restrictions from the bot.
* botOwner: ID of your account, __required__ if using ownerOverMember.
* logging: Disable/enable some extra, none need logging. Defaults to true. Useful but not needed.
* __youtubeKey:__ This is __REQUIRED__. Something [like this article](https://elfsight.com/help/how-to-get-youtube-api-key/) should help with that, or google how to get a YouTube API3 key.  

An example of a few custom commands would be:  
```javascript
const music = new Music(client, {
  prefix: ">",
  maxQueueSize: "10",
  anyoneCanSkip: false,
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
## 1.5.1
* Added playlist support (thanks Rodabaugh for reminding me).
* Fixed `clearqueue` crashing if queue is empty.
* Fixed `skip` crashing if the queue is empty.
* Now requires `ffmpeg` installed over `ffmpeg-binaries`.  
  
## 1.4.0  
* Added wrapping.
* Added owner over member options.
* Fixed errors.  
* Reworked the the playing music method.
* Fixed (probably) UnknownSpawn errors.
* Bot now requires your own YouTube Data API3 key for searching.
* Music is less likely yo cut out now.
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
