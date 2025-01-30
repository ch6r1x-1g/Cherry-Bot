const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();

const { registerCommands } = require('./commands/registerCommands');
const { handleCommands } = require('./handlers/commandHandler');
const { handleModals } = require('./handlers/modalHandler');
const { handleSelectMenus } = require('./handlers/selectMenuHandler');
const RebootHandler = require('./handlers/rebootHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

client.once('ready', async () => {
    console.log(`${client.user.tag}가 실행되었습니다.`);

    // 상태 메시지 설정
    client.user.setPresence({
        activities: [{
            name: '유우리 - 베텔기우스',
            type: ActivityType.Listening
        }],
        status: 'online'
    });

    await registerCommands(client);

    // 재시작 후 메시지 전송
    if (global.rebootChannelId) {
        await RebootHandler.handleRebootComplete(client, global.rebootChannelId);
        global.rebootChannelId = null;
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        await handleCommands(interaction);
    } else if (interaction.isModalSubmit()) {
        await handleModals(interaction);
    } else if (interaction.isStringSelectMenu()) {
        await handleSelectMenus(interaction);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN); 