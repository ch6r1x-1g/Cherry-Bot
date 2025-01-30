const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const warningManager = require('../utils/warningManager');

const createWarningModal = () => {
  const modal = new ModalBuilder()
    .setCustomId('warningModal')
    .setTitle('경고 시스템');

  const targetInput = new TextInputBuilder()
    .setCustomId('target')
    .setLabel('경고 대상자')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('경고를 받을 유저를 입력해주세요');

  const warningCountInput = new TextInputBuilder()
    .setCustomId('warningCount')
    .setLabel('경고 횟수')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('경고 횟수를 입력해주세요 (예: 1)');

  const reasonInput = new TextInputBuilder()
    .setCustomId('reason')
    .setLabel('경고 사유')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('경고 사유를 자세히 입력해주세요');

  const executorInput = new TextInputBuilder()
    .setCustomId('executor')
    .setLabel('경고 집행자')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('경고를 부여하는 관리자를 입력해주세요');

  modal.addComponents(
    new ActionRowBuilder().addComponents(targetInput),
    new ActionRowBuilder().addComponents(warningCountInput),
    new ActionRowBuilder().addComponents(reasonInput),
    new ActionRowBuilder().addComponents(executorInput)
  );

  return modal;
};

const handleWarningModal = async (interaction) => {
  const targetId = interaction.fields.getTextInputValue('target').replace(/[<@!>]/g, '');
  const reason = interaction.fields.getTextInputValue('reason');
  const executor = interaction.fields.getTextInputValue('executor');
  const currentTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  // 경고 추가 및 현재 경고 수 가져오기
  const warning = {
    reason,
    executor,
    executorId: interaction.user.id,
    timestamp: currentTime
  };

  const warningCount = await warningManager.addWarning(targetId, warning);
  const userWarnings = warningManager.getWarnings(targetId);

  const warningEmbed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('⚠️ 경고 알림')
    .setDescription('새로운 경고가 발생했습니다.')
    .addFields(
      {
        name: '👤 경고 대상자',
        value: `<@${targetId}>`,
        inline: false
      },
      {
        name: '🔢 현재 경고 횟수',
        value: `${warningCount}회`,
        inline: true
      },
      {
        name: '👮 경고 집행자',
        value: executor,
        inline: true
      },
      {
        name: '📝 경고 사유',
        value: reason,
        inline: false
      },
      {
        name: '📜 경고 내역',
        value: userWarnings.map((w, i) =>
          `${i + 1}. ${w.reason} (${w.executor}) - ${new Date(w.timestamp).toLocaleString('ko-KR')}`
        ).join('\n') || '없음',
        inline: false
      }
    )
    .setFooter({
      text: `경고 발행 시간: ${currentTime}`
    })
    .setTimestamp();

  const cautionEmbed = new EmbedBuilder()
    .setColor('#FFA500')
    .setDescription(`⚠️ 현재 경고 ${warningCount}회 / 3회 (3회 누적 시 제재 대상)`)
    .setFooter({
      text: '이의제기는 관리자에게 문의해주세요.'
    });

  await interaction.reply({
    embeds: [warningEmbed, cautionEmbed],
    ephemeral: false
  });

  // 3회 이상 경고 시 알림
  if (warningCount >= 3) {
    const alertEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🚨 경고 3회 초과')
      .setDescription(`<@${targetId}>님의 경고가 3회를 초과하여 제재 대상이 되었습니다.`)
      .setTimestamp();

    await interaction.channel.send({ embeds: [alertEmbed] });
  }
};

module.exports = { createWarningModal, handleWarningModal }; 