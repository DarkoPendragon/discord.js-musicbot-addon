# NPM Version Change Log
Note that the NPM version will be behind the GitHub version, but more stable.  
If any issues arise open an issue, or for a faster response join [the Discord server](https://discord.gg/bXvgdjV).
***
## 13.5.0
* Fixed a queue issue causing it to skip a song every now and then.
* Added module checkers to help some people.

## 13.4.4
* Added a `isNan` check for the volume command (issue #88).

## 13.4.3
* Added the `bitRate` option.

## 13.4.2
* Some small fixes.
* Added `channelBlacklist` and `channelWhitelist`.
* Added `nextPresence`.

## 13.4.1
* Merged PR #83 and #82.

## 13.4.0
* Fixed aliase commands not working (`aCmd is not a function`).
* Added `insertMusic`, `defaultPrefix`.
* Added multi prefix system (see examples).
* More touch ups I forgot about.

## 13.3.1
* [Merged PR #75](https://github.com/DarkoPendragon/discord.js-musicbot-addon/pull/75) to fix some options.
* Removed logging involving the entire queue on play.
* Other touch ups.

## 13.3.0
* Fixed fatal Promise handaling errors.
* Fixed `musicPresence`, `clearPresence` and the `updatePresence` function.
* Dealt with [issue #71](https://github.com/DarkoPendragon/discord.js-musicbot-addon/issues/71).

## 13.2.1
* Made the `remove` command run if the author is an admin.
