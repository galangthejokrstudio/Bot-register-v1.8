const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearcmd')
        .setDescription('Remove commands that do not have corresponding files'),

        async execute(interaction) {
            const client = interaction.client;
    
            if (!client.application?.owner) {
                await interaction.reply({ content: 'Commands can only be cleaned by the bot owner.', ephemeral: true });
                return;
            }
    
            const guildId = interaction.guildId;
            const commands = await client.guilds.cache.get(guildId)?.commands.fetch();
    
            if (!commands || commands.size === 0) {
                await interaction.reply({ content: 'There are no registered commands to clean.', ephemeral: true });
                return;
            }
    
            try {
                await Promise.all(commands.map(command => command.delete()));
                await interaction.reply({ content: 'All registered commands have been cleaned.', ephemeral: true });
            } catch (error) {
                console.error('Error cleaning up commands:', error);
                await interaction.reply({ content: 'Failed to clean up commands. Please try again later.', ephemeral: true });
            }
        },
};
