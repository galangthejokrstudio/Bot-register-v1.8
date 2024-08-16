const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testimoni')
        .setDescription('Buat testimonial')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID Testimoni')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('namaseller')
                .setDescription('Nama Seller')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('namabuyer')
                .setDescription('Nama Buyer')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('namaproduct')
                .setDescription('Nama Product')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('hargaproduct')
                .setDescription('Harga Product')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('jenispayment')
                .setDescription('Jenis Payment')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('buktiss')
                .setDescription('Bukti SS (URL)')
                .setRequired(true)),

    async execute(interaction) {
        const id = interaction.options.getString('id');
        const namaseller = interaction.options.getString('namaseller');
        const namabuyer = interaction.options.getString('namabuyer');
        const namaproduct = interaction.options.getString('namaproduct');
        const hargaproduct = interaction.options.getString('hargaproduct');
        const jenispayment = interaction.options.getString('jenispayment');
        const buktiss = interaction.options.getString('buktiss');

        const channelId = '1036682813241569284';
        const channel = await interaction.guild.channels.fetch(channelId);

        const embed = {
            title: `MZ STORE | TESTIMONI #${id}`,
            color: parseInt('000000', 16),
            footer: {
                text: "MZ | Customer Service",
                icon_url: 'https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&'
            },
            description: `**Seller :** ${namaseller}\n**Buyer :** ${namabuyer}\n**Product :** ${namaproduct}\n**Harga : Rp. ${hargaproduct},-**\n**Payment : ${jenispayment}**\n\n**Note : Terimakasih Sudah Berbelanja Dan Mempercayakan Store Ini <:Cek:1078717960828494004>**`, 
            author: {
                name: 'MZ | DIGITAL STORE',
                icon_url: 'https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&'
            },
            timestamp: new Date(),
            thumbnail: { url: "https://cdn.discordapp.com/attachments/875666775818260510/1261083465793667123/20240712_051514.png?ex=6691ab00&is=66905980&hm=ec171f80c25fb5a15798221596fb4ef47c3155e58ffcec8c81c960ff6316adf2&" }, // Gunakan avatar pengguna (buyer) sebagai thumbnail jika ditemukan
            image: { url: buktiss }
        };
        await channel.setName(`🏷・TESTIMONI : ${id}`);
        await interaction.reply({ embeds: [embed] });
    },
};
