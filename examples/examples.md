# Basic Bot Example
***
```js
// Require the Discord.js library.
const Discord = require('discord.js');

// Start a new Client from Discord.js. You can name this to whatever you like.
const client = new Discord.Client();

// Put the Music module in the new Client object.
// This allows for easy access to all the modules
// functions and data.
client.music = require("discord.js-musicbot-addon");

// Now we start the music module.
client.music.start(client, {
  // Set the api key used for YouTube.
  // This is required to run the bot.
  youtubeKey: "YouTubeAPIKeyHere"
});

// Connect the bot with your Discord applications bot token.
client.login("token");
```
That example will run the bot with default settings (as seen in the readme file) and will respond to its commands. Now, let's add a few options to it:
```js
// Following the previous example.
client.music.start(client, {
  // Set the api key used for YouTube.
  youtubeKey: "YouTubeAPIKeyHere",

  // The PLAY command Object.
  play: {
    // Usage text for the help command.
    usage: "{{prefix}}play some tunes",
    // Whether or not to exclude the command from the help command.
    exclude: false  
  },

  // Make it so anyone in the voice channel can skip the
  // currently playing song.
  anyoneCanSkip: true,

  // Make it so the owner (you) bypass permissions for music.
  ownerOverMember: true,
  ownerID: "yourDiscordId",

  // The cooldown Object.
  cooldown: {
    // This disables the cooldown. Not recommended.
    enabled: false
  }
});
```
Following that, we've added some custom options to the bot. It will now use those instead of it's preset ones.  

# Calling Commands
We'll now go over interacting with the bot and it's data. The first will be of changing your set YouTube Data key.
```js
// Assuming you've followed the first example.
// <Client> will stand for the client object.
// Replace it with your actual client.
// <Music> will be the <Client>.music.bot Object.

<Client>.changeKey("some key").then((res) => {
  // Resolves the MUSICBOT Object when set.
}).catch((res) => {
  // Rejcts when no key was passed or something
  // that isn't a string is passed.
  console.error(res);
})
```

Now we'll go over calling functions outside of the module.
```js
// Here is a list of command functions for refence.
<Music>.playFunction();   // PLAY command.
<Music>.helpFunction();   // HELP command.
<Music>.queueFunction();  // QUEUE command.
<Music).npFunction();     // NOWPLAYING command.
<Music>.loopFunction();   // LOOP command.
<Music>.skipFunction();   // SKIP command.
<Music>.pauseFunction();  // PAUSE command.
<Music>.resumeFunction(); // RESUME command.
<Music>.clearFunction();  // CLEARQUEUE command.
<Music>.leaveFunction();  // LEAVE command.
<Music>.searchFunction(); // SEARCH command.
<Music>.volumeFunction(); // VOLUME command.
<Music>.removeFunction(); // REMOVE command.

// All commands need two values passed to them:
// <Message>: The Message Object.
// Suffix: The string typically after the command.
<Music>.playFunction(<Message>, suffix);

// Now we'll make a simple "play" command using
// these methods.
client.on("message", (msg) => {
  if (msg.author.bot) return; // Good practice to do this.

  // I set the Client to this just for ease.
  // You'll probably have access to it another
  // way, but this still works.
  const client = msg.client;

  // Get the command from the message.
  const command = message.substring(musicbot.botPrefix.length).split(/[ \n]/)[0].trim();

  // Get the suffix, the String after the command.
  const suffix = message.substring(musicbot.botPrefix.length + command.length).trim();

  // Set the prefix to "!". This is a horrible way to set
  // one, but it will do for now.
  let prefix = "!"

  // Now we check if the message starts with the prefix,
  // and asks for the PLAY command.
  if (msg.content.startsWith(prefix) && command == "play") {
    // Now we pass the Message Object (msg) and
    // the suffix. It will then proceed as it would
    // with the bot normally.
    client.music.bot.playFunction(msg, suffix);
  };
});
```

# Other questions?
Feel free [to join my Discord](https://discordapp.com/invite/FKYrX4X) and I or someone else will assist you.
