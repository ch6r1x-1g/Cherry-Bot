const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

const createInquiryModal = () => {
  const modal = new ModalBuilder()
    .setCustomId('inquiryModal')
    .setTitle('문의 내용');

  const inquiryInput = new TextInputBuilder()
    .setCustomId('inquiry')
    .setLabel('문의 내용')
    .setPlaceholder('문의 내용을 입력해주세요')
    .setStyle(TextInputStyle.Paragraph);

  modal.addComponents(new ActionRowBuilder().addComponents(inquiryInput));

  return modal;
};

const handleInquiryModal = async (interaction) => {
  const inquiry = interaction.fields.getTextInputValue('inquiry');

  const embed = new EmbedBuilder()
    .setTitle('📩 새 문의가 도착했습니다!')
    .setDescription('사용자가 새로운 문의를 남겼습니다. 아래 내용을 확인해주세요.')
    .setColor('#0099FF')
    .addFields(
      { name: '문의 내용', value: inquiry, inline: false },
      { name: '문의자', value: interaction.user.toString(), inline: true },
      { name: '문의 시간', value: new Date().toLocaleString(), inline: true }
    );

  await interaction.channel.send({ embeds: [embed] });
  await interaction.reply({ content: '문의가 성공적으로 전송되었습니다. 관리자가 곧 답변할 것입니다!', ephemeral: true });
};

module.exports = { createInquiryModal, handleInquiryModal }; 