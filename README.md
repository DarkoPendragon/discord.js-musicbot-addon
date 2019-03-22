# Discord.JS Muzykobot
***
To prosty moduł Node.JS bazowany na innych projektach botów muzycznych dla Discord.JS.

__Lista komend: (nazwy domyślne)__  
* `musichelp [nazwa komendy]`: Displays help text for commands by this addon, or help for a specific command.
* `play <url>|<wyszukiwana piosenka>`: Play audio from YouTube.
* `search <wyszukiwania piosenka>`: Search's for up to 10 videos from YT.
* `skip [liczba]`: Skip a song or multi songs with skip [some number].
* `queue [pozycja]`: Display the current queue.
* `pause`: Pause music playback.
* `resume`: Resume music playback.
* `remove [pozycja]`: Remove a song from the queue by position.
* `volume`: Adjust the playback volume between 1 and 200.
* `leave`: Clears the song queue and leaves the channel.
* `clearqueue`: Clears the song queue.
* `np`: Show the current playing song.  

__Uprawnienia:__  
* If `anyoneCanSkip` is true, anyone can skip songs in the queue.
* If `anyoneCanAdjust` is true, anyone can adjust the volume.
* If `ownerOverMember` is true, the set ID of the user (`ownerID`) will over-ride permissions from the bot.

***
# Instalacja
***  
__Pre-installation:__  
1. `npm install discord.js`  
Zalecana wersja stable. Obecnie to wersja 11.4.2.

2. `ffmpeg`  
Bardzo ważna biblioteka. Nie instaluj ffmpeg-binaries, tylko normalne paczki dla systemu.

3. `npm install node-opus` or `npm install opusscript`  
Zalecany node-opus.

__Installation:__  
* `npm i discord.js-muzykobot`  
Jakieś problemy? [Klik!](https://github.com/DarkoPendragon/discord.js-musicbot-addon/wiki/Installation-&-Troubleshooting)
Pamiętaj, że wersja z NPM jest odrobinkę opóźniona w stosunku do wersji z gita.

# Przykłady
***  
See [this page](https://github.com/DarkoPendragon/discord.js-musicbot-addon/blob/master/examples/examples.md) on the repo for examples.

# Opcje i konfiguracja
***
__Most options are optional and thus not needed.__  
The options you can pass in `music.start(client, {options})` and their types is as followed:  

## Podstawowe opcje
| Option | Type | Description | Default |  
| --- | --- | --- | --- |
| youtubeKey | String | A YouTube Data API3 key. Required to run. | NaN |
| botPrefix | String | The prefix of the bot. Defaults to "!". Can also be a Map of prefix's. | ! |
| messageNewSong | Boolean | Whether or not to send a message when a new song starts playing. | true |
| bigPicture | Boolean | Whether to use a large (true) image or small (false) for embeds. | false |
| maxQueueSize | Number | Max queue size allowed. Defaults 100. Set to 0 for unlimited. | 50 |
| defVolume | Number | The default volume of music. 1 - 200. | 50 |
| anyoneCanSkip | Boolean | Whether or not anyone can skip. | false |
| messageHelp | Boolean | Whether to message the user on help command usage. If it can't, it will send it in the channel like normal. | false |
| botAdmins | Object/Array | An array of Discord user ID's to be admins as the bot. They will ignore permissions for the bot. | [ ] |
| anyoneCanAdjust | Boolean | Whether anyone can adjust volume. | false |
| ownerOverMember | Boolean | Whether the owner over-rides `CanAdjust` and `CanSkip`. | flase |
| anyoneCanLeave | Boolean | Whether anyone can make the bot leave the currently connected channel. | false |
| ownerID | String | The ID of the Discord user to be seen as the owner. Required if using `ownerOverMember`. | NaN |
| logging | Boolean | Some extra none needed logging (such as caught errors that didn't crash the bot, etc). | true |
| requesterName | Boolean | Whether or not to display the username of the song requester. | true |
| inlineEmbeds | Boolean | Whether or not to make embed fields inline (help command and some fields are excluded). | false |
| musicPresence | Boolean | Whether or not to make the bot set its presence to currently playing music. | false |
| clearPresence | Boolean | Whether or not to clear the presence instead of setting it to "nothing" | false |
| insertMusic | Boolean | Whether or not to insert the music bot data into `<Client>.music` on start. | false |

## Przykład bota z wieloma prefixami
```js
<Client>.guilds.forEach
<Music>.start(<Client>, {
  youtubeKey: "Data Key",
  botPrefix: <MapObject>
});

// Exmaple Map Structure
{serverID: { prefix: "!" } }
```
Zobacz [przykłady](https://github.com/DarkoPendragon/discord.js-musicbot-addon/blob/master/examples/examples.md).
## Cooldown
| Option | Type | Description | Default |  
| --- | --- | --- | --- |
| cooldown | Object | The main cooldown object | |
| cooldown.enabled | Boolean | Whether or not cooldowns are enabled. | true |
| cooldown.timer | Number | Time in MS that cooldowns last. | 10000 |
| cooldown.exclude | Object/Array | Array of command names to exclude. Uses default names, not set names | ["volume","queue","pause","resume","np"] |  

## Opcje komend  
Commands pass a bit different. Each command follows the same format as below. Valid commands are `play`, `remove`, `help`, `np`, `queue`, `volume`, `pause`, `resume`, `skip`, `clearqueue`, `loop`, `leave`.
```js
music.start(client, {
  <command>: {
    enabled: false,                    // True/False statement.
    alt: ["name1","name2","name3"],    // Array of alt names (aliases).
    help: "Help text.",                // String of help text.
    name: "play"                       // Name of the command.
    usage: "{{prefix}}play bad memes", // Usage text. {{prefix}} will insert the bots prefix.
    exclude: false                     // Excludes the command from the help command.
  }
});
```
