const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    
    data: new SlashCommandBuilder()
    
        .setName('ticketpanel')
        .setDescription('Create a ticket panel'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('MZ | Create Ticket')
            .setAuthor({name: 'MZ | DIGITAL STORE', iconURL: 'https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&'})
            .setDescription("\n> **Click The Button '🎟️' Below For Order / Support**\n\n> **⚠️ Attention**\n\n**__Don't Use The Ticket Button If You Have No Important Things!__**\n")
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&')
            .setFooter({ text: 'MZ | Customer Service', iconURL: 'https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                        .setEmoji('🎟️')
                        .setLabel('Create Ticket')
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({ embeds: [embed], components: [row] });
        
    },
};

module.exports.buttonHandler = async (interaction, client) => {
    if (interaction.customId === 'create_ticket') {
        const categoryID = client.config.CATEGORY_ID;
        const category = interaction.guild.channels.cache.get(categoryID);
        
        if (!category || category.type !== ChannelType.GuildCategory) {
            return interaction.reply({ content: 'Category "tickets" not found or is not a category', ephemeral: true });
        }

        const ticketChannelName = `ticket-${interaction.user.username}`.substring(0, 32); // Discord channel name max length is 100

        try {
            const ticketChannel = await interaction.guild.channels.create({
                name: ticketChannelName,
                type: ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                    },
                ],
            });

            const ticketEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setAuthor({name: 'MZ | DIGITAL STORE', iconURL: 'https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&'})
                .setTitle('MZ | Ticket Panel')
                .setDescription('> **Please Wait Until Staff Response**\n\n> **Cancel**\n`Untuk Membatalkan Dan Menghapus Ticket`\n> **Archive**\n`Untuk Mengarsipkan Tiket`\n')
                .setThumbnail('https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&')
                .setTimestamp()
                .setFooter({ text: 'MZ | Customer Service', iconURL: 'https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&' });

            const ticketRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('cancel_ticket')
                        .setLabel('Cancel')
                        .setEmoji('❌')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('archive_ticket')
                        .setEmoji('📄')
                        .setLabel('Archive')
                        .setStyle(ButtonStyle.Secondary),
                );

            await ticketChannel.send({ embeds: [ticketEmbed], components: [ticketRow] });
            await interaction.reply({ content: `Ticket created: ${ticketChannel}`, ephemeral: true });
        } catch (error) {
            console.error('Error creating ticket channel:', error);
            await interaction.reply({ content: 'There was an error creating the ticket channel. Please try again later.', ephemeral: true });
        }
    } else if (interaction.customId === 'cancel_ticket') {
        const channel = interaction.channel;
        try {
            await interaction.reply({ content: 'This ticket will be deleted in 5 seconds.' });
            setTimeout(async () => {
                await channel.delete();
            }, 5000);
        } catch (error) {
            console.error('Error deleting ticket channel:', error);
            await interaction.reply({ content: 'There was an error deleting the ticket channel. Please try again later.', ephemeral: true });
        }
    } else if (interaction.customId === 'archive_ticket') {
        const channel = interaction.channel;
        try {
            await channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false });
            await interaction.reply({ content: 'This ticket has been archived.' });
        } catch (error) {
            console.error('Error archiving ticket channel:', error);
            await interaction.reply({ content: 'There was an error archiving the ticket channel. Please try again later.', ephemeral: true });
        }
    }
};
