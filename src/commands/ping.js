const { Message } = require('discord.js');

class PingCommand {
  /**
   * @param {Message} message
   * @param {Object<JSON>} options
   */
  static async execute(message, options) {
    const pingMessage = await message.channel.send('Pinging...');

    pingMessage.edit(
      `Pong! Latency is ${pingMessage.createdTimestamp - message.createdTimestamp}ms.`
    );
  }

  static get description() {
    return 'Ping the bot.';
  }

  static get usage() {
    return '!ping';
  }
}

module.exports = PingCommand;