const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member')
        .addUserOption(option => option.setName('target').setDescription('The member to kick').setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('target');

        if (!member.kickable) {
            return interaction.reply({ content: 'I cannot kick this user!', ephemeral: true });
        }

        await member.kick();
        await interaction.reply({ content: `${member.user.tag} has been kicked!`, ephemeral: true });
    },
};
