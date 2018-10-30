/* This is meant to serve as an example of
 * calling commands from the module outside
 * of it's main code (e.g in your message
 * event).
 * You can call the command this way even
 * if it is disabled.
*/

client.on("message", (msg) => {
  if (msg.author.bot) return; // Good practice to do this.

  const command = message.substring(musicbot.botPrefix.length).split(/[ \n]/)[0].trim(); // Get the command.
  const suffix = message.substring(musicbot.botPrefix.length + command.length).trim(); // Get the suffix (song).

  if (msg.content.startsWith(prefix) && command == "play") {
    client.music.bot.playFunction(suffix, msg);
  }
})
