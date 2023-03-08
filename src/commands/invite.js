const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Récupérez le lien d\'invitation du bot.'),

  async execute(interaction) {
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot`;
    await interaction.reply(`Voici le lien d'invitation du Bot : ${inviteLink}`);
  }
};