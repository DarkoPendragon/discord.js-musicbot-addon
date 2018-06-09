[![npm package](https://nodei.co/npm/discord.js-musicbot-addon.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/discord.js-musicbot-addon/)  

This was originally an update of the original bot from [ruiqimao](https://github.com/ruiqimao/discord.js-music) by [nexu-dev](https://www.npmjs.com/package/discord.js-music-v11), but is now a updated version (again) for [Discord.js](https://discord.js.org/)'s version 11.2^. Fixes deprecated warnings, video playback issues, along with various other add-ons and tweaks to the priors. This module may be buggy and need some fine tuning. Feel free to let me know what problems you encounter by opening an issue on the repo or joining the [Discord server](https://discord.gg/FKYrX4X), where I or a `@Helper` will help you.

# Docs, installation, and so on:
* [Docs](https://github.com/DarkoPendragon/discord.js-musicbot-addon/wiki/Documentation)
* [Installation & Troubleshooting](https://github.com/DarkoPendragon/discord.js-musicbot-addon/wiki/Installation-&-Troubleshooting)
* [Support Server](https://discord.gg/FKYrX4X)  
  [![Discord Server](https://discordapp.com/api/guilds/427239929924288532/embed.png)](https://discord.gg/FKYrX4X)
  
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

# Changelog
***  
## 12.0.6
* Updated the `README.md` file, like I should have.
* Added some more exports. I think.
* Added docs to the repo.

## 12.0.5
* Forgot to map the join command. Did that.

## 12.0.4
* Added a `join` command, and related options.
* Added `anyoneCanJoin`.
* Fixed `console.error` in the startup function.
* To save space, be it small, examples are no longer downloaded with npm.

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
