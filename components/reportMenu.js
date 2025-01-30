const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const createReportMenu = () => {
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('reportSelect')
        .setPlaceholder('신고/문의 유형을 선택하세요.')
        .addOptions([
          {
            label: '경고 시스템',
            description: '경고 대상자를 등록',
            value: 'warning',
            emoji: '⚠️'
          },
          {
            label: '문의 내용',
            description: '관리자에게 문의',
            value: 'inquiry',
            emoji: '📩'
          }
        ])
    );

  return row;
};

module.exports = { createReportMenu }; 