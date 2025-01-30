const { EmbedBuilder } = require('discord.js');
const { createWarningModal } = require('../modals/warningModal');
const { createReportMenu } = require('../components/reportMenu');
const { AUTHORIZED_USERS } = require('../config/constants');
const warningManager = require('../utils/warningManager');
const { exec } = require('child_process');
const path = require('path');
const WarningHandler = require('./warningHandler');

const handleCommands = async (interaction) => {
  switch (interaction.commandName) {
    case 'sync':
      if (!interaction.user.id === interaction.guild.ownerId) {
        return await interaction.reply({ content: '이 명령어를 사용할 권한이 없습니다.', ephemeral: true });
      }
      await interaction.reply('슬래시 명령어 동기화 완료!');
      break;

    case 'restart':
      if (!AUTHORIZED_USERS.includes(interaction.user.id)) {
        return await interaction.reply({ content: '이 명령어를 사용할 권한이 없습니다.', ephemeral: true });
      }
      await handleRestart(interaction);
      break;

    case 'warning':
      const modal = createWarningModal();
      await interaction.showModal(modal);
      break;

    case 'report':
      const row = createReportMenu();
      await interaction.reply({ content: '경고 또는 문의를 선택해주세요.', components: [row] });
      break;

    case 'warnings':
      await WarningHandler.handleWarnings(interaction);
      break;

    case 'warn':
      await WarningHandler.handleWarn(interaction);
      break;

    case 'unwarn':
      await WarningHandler.handleUnwarn(interaction);
      break;
  }
};

const handleRestart = async (interaction) => {
  const restartEmbed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('⚠️ 리부팅 명령 실행')
    .addFields(
      { name: '실행자', value: `${interaction.user}`, inline: true },
      { name: '실행자 ID', value: `${interaction.user.id}`, inline: true },
      { name: '실행 시간', value: `${new Date().toLocaleString('ko-KR')}`, inline: true },
      { name: '상태', value: '리부팅을 시작합니다...', inline: false }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [restartEmbed] });

  if (process.env.PM2_USAGE === 'true') {
    exec('pm2 restart warning', (error) => {
      if (error) {
        console.error('리부팅 오류:', error);
      }
    });
  } else {
    const scriptPath = path.join(__dirname, '../index.js');

    const child = exec(`node ${scriptPath}`, (error) => {
      if (error) {
        console.error('리부팅 오류:', error);
      }
    });

    child.on('spawn', () => {
      process.exit();
    });
  }
};

module.exports = { handleCommands }; 