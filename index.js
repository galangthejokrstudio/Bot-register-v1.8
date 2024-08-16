const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const { Modal, TextInputComponent, showModal } = require('discord-modals');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

client.config = {
    SERVER_ID: process.env.SERVER_ID,
    CATEGORY_ID: '1036682812964753464',
    CLIENT_ID: '882948313089998899',
};

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Optional: Send error to a specific channel
    restartBot();
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    // Optional: Send error to a specific channel
    restartBot();
});

function restartBot() {
    console.log('Restarting bot...');
    process.exit(1); // Exit the process to be restarted by the process manager
}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    if (client.config && client.config.SERVER_ID) {
        const arrayOfSlashCommands = client.commands.map(command => command.data);
        await client.guilds.cache.get(client.config.SERVER_ID).commands.set(arrayOfSlashCommands);
    } else {
        console.error('SERVER_ID not defined in client.config');
    }
    client.user.setActivity('Trusted And Fast Services', { type: 'WATCHING' });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        const roleIdToCheck = '1036682811937148990';
        const role = interaction.guild.roles.cache.get(roleIdToCheck);
        const member = interaction.member;

        if (!command) return;

        if (!member.roles.cache.has(role.id)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('There was an error while executing this command!')
                .addFields({ name: 'Error Message', value: error.message })
                .setTimestamp();
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    } else if (interaction.isButton()) {
        const command = client.commands.get('ticketpanel');
        if (command && command.buttonHandler) {
            try {
                await command.buttonHandler(interaction, client);
            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('Error')
                    .setDescription('There was an error while executing this command!')
                    .addFields({ name: 'Error Message', value: error.message })
                    .setTimestamp();
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
        const verify = client.commands.get('verifypanel');
        if (verify && verify.buttonHandler) {
            try {
                await verify.buttonHandler(interaction, client);
            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('Error')
                    .setDescription('There was an error while executing this command!')
                    .addFields({ name: 'Error Message', value: error.message })
                    .setTimestamp();
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

});

function isAdmin(member) {
    return member.permissions.has('ADMINISTRATOR');
}

client.login(process.env.DISCORD_TOKEN);
