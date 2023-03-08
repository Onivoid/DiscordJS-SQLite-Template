const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Afficher la latence du bot'),
    async execute(interaction) {
        const now = Date.now();
        await interaction.reply(`La latence est de ${now - interaction.createdTimestamp}ms.`);
    },
};