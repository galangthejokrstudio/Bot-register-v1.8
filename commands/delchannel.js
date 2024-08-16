const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletechannel')
        .setDescription('Delete specified channels')
        .addChannelOption(option => option.setName('channel1').setDescription('First channel to delete').setRequired(true))
        .addChannelOption(option => option.setName('channel2').setDescription('Second channel to delete').setRequired(false))
        .addChannelOption(option => option.setName('channel3').setDescription('Third channel to delete').setRequired(false)),
    async execute(interaction) {
        const channels = [
            interaction.options.getChannel('channel1'),
            interaction.options.getChannel('channel2'),
            interaction.options.getChannel('channel3')
        ].filter(channel => channel);

        for (const channel of channels) {
            if (channel.deletable) {
                await channel.delete();
            }
        }

        await interaction.reply({ content: 'Specified channels have been deleted!', ephemeral: true });
    },
};
