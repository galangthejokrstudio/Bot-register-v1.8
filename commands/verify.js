const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Pastikan ini diimpor dengan benar

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifypanel')
        .setDescription('Create a verify panel'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('MZ | Take Role')
            .setAuthor({
                name: 'MZ | DIGITAL STORE',
                iconURL: 'https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&'
            })
            .setDescription("> **Click The Button Below To Get <@&1036682811916161078> Role**\n> **Get Access To All Public Channel **")
            .setTimestamp()
            .setThumbnail('https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&')
            .setFooter({ text: 'MZ | Customer Service', iconURL: 'https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify')
                    .setEmoji('<:ks_partner:1076794578264391770>')
                    .setLabel('Verify')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};

module.exports.buttonHandler = async (interaction, client) => {
    try {
        if (interaction.customId === 'verify') {
            const roleIdToCheck = '1036682811916161078';
            const role = interaction.guild.roles.cache.get(roleIdToCheck);

            if (!role) {
                console.error(`Role dengan ID ${roleIdToCheck} tidak ditemukan.`);
                return;
            }

            const member = interaction.member;
            if (!member) {
                console.error('Member not found for this interaction.');
                return;
            }

            if (member.roles.cache.has(role.id)) {
                await interaction.reply({
                    content: 'Anda sudah terdaftar.',
                    ephemeral: true
                });
            } else {
                const modalRegister = new Modal()
                    .setCustomId("modal-register")
                    .setTitle("Introduction Yourself")
                    .addComponents(
                        new TextInputComponent()
                        .setCustomId("reg-name")
                        .setLabel("Username :")
                        .setMinLength(4)
                        .setMaxLength(15)
                        .setStyle("SHORT")
                        .setPlaceholder("Enter your username")
                        .setRequired(true)
                    );

                await showModal(modalRegister, {
                    client: client,
                    interaction: interaction
                });
            }
        }

        if (interaction.customId === 'modal-register') {
            const username = interaction.fields.getTextInputValue("reg-name");
            const roleIdToCheck = '1036682811916161078';
            const role = interaction.guild.roles.cache.get(roleIdToCheck);
            const guild = interaction.guild;
            const member = guild.members.cache.get(interaction.user.id);

            if (!member) {
                console.error('Member not found for this interaction.');
                return;
            }

            await member.setNickname("MV | " + username);
            await member.roles.add(role);
            await interaction.reply({ content: `Thank You For Registering, Now You Can Access All Channel.`, ephemeral: true });
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.reply({ content: 'Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.', ephemeral: true });
    }
};
