const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client();
client.commands = new Collection();

const commandFiles = fs
  .readdirSync(path.join(__dirname, 'src/commands'))
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'src/commands', file));
  client.commands.set(command.name, command);
}

client.on('message', (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases.includes(commandName));

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(process.env.DISCORD_TOKEN);