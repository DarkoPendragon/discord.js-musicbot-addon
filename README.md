[![npm package](https://nodei.co/npm/discord.js-musicbot-addon.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/discord.js-musicbot-addon/)    [![Downlaods](https://img.shields.io/npm/dt/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon)  [![Version](https://img.shields.io/npm/v/discord.js-musicbot-addon.svg?maxAge=3600)](https://www.npmjs.com/package/discord.js-musicbot-addon) -->
***
This module is a simple Node.js based music extension/bot for Discord.js projects using YouTube. This was originally an update of an older addon for newer versions of Discord.js but not serves as it's own module.   

__The commands available are: (default names)__  
* `musichelp [command]`: Displays help text for commands by this addon, or help for a specific command.
* `play <url>|<search string>`: Play audio from YouTube.
* `search <search string>`: Search's for up to 10 videos from YT.
* `skip [number]`: Skip a song or multi songs with skip [some number],
* `queue [position]`: Display the current queue.
* `pause`: Pause music playback.
* `resume`: Resume music playback.
* `remove [position]`: Remove a song from the queue by position.
* `volume`: Adjust the playback volume between 1 and 200.
* `leave`: Clears the song queue and leaves the channel.
* `clearqueue`: Clears the song queue.
* `np`: Show the current playing song.  

__Permissions:__  
* If `anyoneCanSkip` is true, anyone can skip songs in the queue.
* If `anyoneCanAdjust` is true, anyone can adjust the volume.
* If `ownerOverMember` is true, the set ID of the user (`ownerID`) will over-ride permissions from the bot.

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

# Basic Example.
***  
This addon is easy to use, and doesn't require any extra configuration besides a YouTube Data API key to run.  
More examples can be found on the repo or once downloaded in `examples`.  

__Example basic code, standalone:__
```javascript
const Discord = require('discord.js'); // Require the Discord.js library.

class Bot extends Discord.Client {
  constructor(options) {
    super(options);
    this.music = require("discord.js-musicbot-addon");
  }
}
const client = new Bot();

client.music.start({
  youtubeKey: "YouTubeAPIKeyHere" // Set the api key used for YouTube.
});

client.login("token"); // Connect the bot.
```  

# Options & Config.
***
__Most options are optional and thus not needed.__  
The options you can pass in `music.start(client, {options})` and their types is as followed:  
_Note: All Boolean options default false._  

## Basic Options.
| Option | Type | Description |  
| --- | --- | --- |  
| youtubeKey | String | A YouTube Data API3 key. Required to run. |
| botPrefix | String | The prefix of the bot. Defaults to "!". |
| bigPicture | Boolean | Whether to use a large (true) image or small (false) for embeds. |
| global | Boolean | Whether to use one global queue or server specific ones. |
| maxQueueSize | Number | Max queue size allowed. Defaults 100. Set to 0 for unlimited. |
| defVolume | Number | The default volume of music. 1 - 200, defaults 50. |
| anyoneCanSkip | Boolean | Whether or not anyone can skip. |
| messageHelp | Boolean | Whether to message the user on help command usage. If it can't, it will send it in the channel like normal. |
| botAdmins | Object/Array | An array of Discord user ID's to be admins as the bot. They will ignore permissions for the bot. |

## Other Options.  
| Option | Type | Description |  
| --- | --- | --- |  
| anyoneCanAdjust | Boolean | Whether anyone can adjust volume. |
| ownerOverMember | Boolean | Whether the owner over-rides `CanAdjust` and `CanSkip`. |
| anyoneCanLeave | Boolean | Whether anyone can make the bot leave the currently connected channel. |
| ownerID | String | The ID of the Discord user to be seen as the owner. Required if using `ownerOverMember`. |
| logging | Boolean | Some extra none needed logging (such as caught errors that didn't crash the bot, etc). |
| requesterName | Boolean | Whether or not to display the username of the song requester. |
| inlineEmbeds | Boolean | Whether or not to make embed fields inline (help command and some fields are excluded). |
| cooldown | Object | See below. |

## Cooldown Example
```js
Music.start(client, {
  cooldown: {
    disabled: <true | false>, // TRUE or FALSE statement.
    timer: 10000 // Time in milliseconds. 1000 = 1 second.
  }
});
```

## Command Options.  
Commands pass a bit different. Each command follows the same format as below. Valid commands are `play`, `remove`, `help`, `np`, `queue`, `volume`, `pause`, `resume`, `skip`, `clearqueue`, `loop`, `leave`.
```js
music.start(client, {
  <command>: {
    disabled: false,                  // True/False statement.
    alt: ["name1","name2","name3"],   // Array of alt names (aliases).
    help: "Help text.",               // String of help text.
    name: "play"                      // Name of the command.
    usage: "{{prefix}}play bad memes" // Usage text. {{prefix}} will insert the bots prefix.
  }
});
```


An example of a few custom options would be:  
```javascript
music.start(client, {
  botPrefix: ">",
  maxQueueSize: 0,
  ownerOverMember: true,
  ownerID: '123456789101112',
  youtubeKey: 'some-key_here',
  play: {
    alt: ["pl4y"],
    help: "Queue some shit.",
    name: "ploy"
  },
  skip: {
    alt: ["skippy"]
  }
});
```

# Changelog
***  
## 13.0.1
* Wew already broke it lads.
* Cooldown is fixed.

## 13.0.0
* Redid entire module.

## 12.x ~ 1.0
* ~~Deprecated versions~~.
