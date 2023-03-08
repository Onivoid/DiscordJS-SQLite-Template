const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Récupérez le lien d\'invitation du bot.'),

  async execute(interaction, client) {
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot`;
    const embed = new EmbedBuilder()
        .setColor('#9146ff')
        .setTitle(`Lien d'invitation du Bot`)
        .setURL(`${inviteLink}`)
        .setDescription(`Voici le lien d'invitation du Bot : ${inviteLink}`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

        console.log(client);
    
    await interaction.reply({ embeds: [embed] });
  }
};