const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('twitch')
    .setDescription('Get Twitch Channel')
    .addStringOption(option => 
        option.setName('streamer')
            .setDescription('Nom du streamer')
            .setRequired(true)
            .addChoices({name: 'Hydrea', value: 'Hydrea'},{name: 'Anthasam', value: 'Anthasam'},{name: 'Onivoid', value: 'Onivoid'})),
    async execute(interaction) {
        const twitchUsers = {
            'hydrea': 'hyydrea',
            'anthasam': 'anthasam_',
            'onivoid': 'onivoid_'
        };
        
        const twitchUser = interaction.options.getString('streamer');
        const twitchUserName = twitchUsers[twitchUser.toLowerCase()];

        console.log(twitchUserName);
        if (!twitchUserName) {
            return interaction.reply({ content: `Streamers disponibles : ${Object.keys(twitchUsers).join(', ')}` });
        }

        try {
            const response = await axios.get(`https://api.twitch.tv/helix/users?login=${twitchUserName}`, {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`
                }
            });

            if (response.data.data.length === 0) {
                return interaction.reply({ content: `Le streamer ${twitchUser} n'a pas été trouvé sur Twitch.` });
            }

            const user = response.data.data[0];
            
            const embed = new EmbedBuilder()
                .setColor('#9146ff')
                .setTitle(`Chaine Twitch de ${user.display_name}`)
                .setURL(`https://www.twitch.tv/${user.login}`)
                .setDescription(user.description)
                .setThumbnail(user.profile_image_url)
                .setImage(user.offline_image_url ? user.offline_image_url : user.profile_image_url);
            
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Une erreur s\'est produite lors de la récupération des données Twitch.' });
        }
    }
};