const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unroleall')
        .setDescription('Menghapus role dari semua yang memilikinya')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('Role yang akan dihapus dari semua member')
                .setRequired(true)),

    async execute(interaction) {
        // Dapatkan role dari opsi command
        const roleToRemove = interaction.options.getRole('role');

        if (!roleToRemove) {
            return await interaction.reply({
                content: 'Role tidak valid.',
                ephemeral: true
            });
        }

        try {
            // Dapatkan semua member dari guild (server)
            const guild = interaction.guild;
            let membersFetched = false;
            let retryCount = 0;

            while (!membersFetched && retryCount < 3) { // Retry up to 3 times
                try {
                    const members = await guild.members.fetch({ limit: 50 }); // Fetch members in batches of 50

                    for (const member of members.values()) {
                        if (member.roles.cache.has(roleToRemove.id)) {
                            await member.roles.remove(roleToRemove);
                        }
                    }

                    membersFetched = true; // Set to true to exit retry loop
                } catch (error) {
                    console.error('Error fetching members:', error);
                    retryCount++;
                }
            }

            if (!membersFetched) {
                throw new Error('Failed to fetch members after multiple retries.');
            }

            await interaction.reply({
                content: `Role ${roleToRemove.name} berhasil dihapus dari semua member.`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error removing role:', error);
            await interaction.reply({
                content: 'Terjadi kesalahan saat menghapus role. Silakan coba lagi nanti.',
                ephemeral: true
            });
        }
    }
};
