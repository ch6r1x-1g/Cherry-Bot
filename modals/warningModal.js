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

  const visibilityInput = new TextInputBuilder()
    .setCustomId('visibility')
    .setLabel('공개 여부 (public/private)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('public 또는 private을 입력해주세요')
    .setValue('public'); // 기본값 설정

  modal.addComponents(
    new ActionRowBuilder().addComponents(targetInput),
    new ActionRowBuilder().addComponents(warningCountInput),
    new ActionRowBuilder().addComponents(reasonInput),
    new ActionRowBuilder().addComponents(executorInput),
    new ActionRowBuilder().addComponents(visibilityInput)
  );

  return modal;
};

const handleWarningModal = async (interaction) => {
  const targetId = interaction.fields.getTextInputValue('target').replace(/[<@!>]/g, '');
  const reason = interaction.fields.getTextInputValue('reason');
  const executor = interaction.fields.getTextInputValue('executor');
  const visibility = interaction.fields.getTextInputValue('visibility').toLowerCase();
  const currentTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  // 경고 추가 및 현재 경고 수 가져오기
  const warning = {
    reason,
    executor,
    executorId: interaction.user.id,
    timestamp: currentTime,
    visibility: visibility
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
        value: userWarnings
          .filter(w => w.visibility === 'public')
          .map((w, i) =>
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

  // visibility에 따라 다르게 응답
  if (visibility === 'private') {
    // 비공개 메시지로 전송
    await interaction.reply({
      embeds: [warningEmbed, cautionEmbed],
      ephemeral: true
    });

    // 관리자 채널에도 로그 남기기
    const logEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🔒 비공개 경고 발행')
      .setDescription(`${interaction.user}님이 비공개 경고를 발행했습니다.`)
      .addFields(
        { name: '대상자', value: `<@${targetId}>`, inline: true },
        { name: '경고 횟수', value: `${warningCount}회`, inline: true },
        { name: '사유', value: reason, inline: false }
      )
      .setTimestamp();

    await interaction.channel.send({
      embeds: [logEmbed],
      ephemeral: true
    });
  } else {
    // 공개 메시지로 전송
    await interaction.reply({
      embeds: [warningEmbed, cautionEmbed],
      ephemeral: false
    });
  }

  // 3회 이상 경고 시 알림
  if (warningCount >= 3) {
    const alertEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🚨 경고 3회 초과')
      .setDescription(`<@${targetId}>님의 경고가 3회를 초과하여 제재 대상이 되었습니다.`)
      .setTimestamp();

    await interaction.channel.send({ embeds: [alertEmbed] });
  }

  // DM으로 경고 알림 보내기
  try {
    const user = await interaction.client.users.fetch(targetId);
    const dmEmbed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('⚠️ 경고 알림')
      .setDescription(`${interaction.guild.name} 서버에서 경고를 받았습니다.`)
      .addFields(
        { name: '경고 사유', value: reason, inline: false },
        { name: '현재 경고 수', value: `${warningCount}회`, inline: true },
        { name: '경고 발행 시간', value: currentTime, inline: true }
      )
      .setFooter({ text: '이의가 있으시다면 관리자에게 문의해주세요.' });

    await user.send({ embeds: [dmEmbed] });
  } catch (error) {
    console.error('DM 전송 실패:', error);
  }
};

module.exports = { createWarningModal, handleWarningModal }; 