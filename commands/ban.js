const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .addUserOption(option => option.setName('target').setDescription('The member to ban').setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('target');

        if (!member.bannable) {
            return interaction.reply({ content: 'I cannot ban this user!', ephemeral: true });
        }

        await member.ban();
        await interaction.reply({ content: `${member.user.tag} has been banned!`, ephemeral: true });
    },
};
