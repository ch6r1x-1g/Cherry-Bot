const { createWarningModal } = require('../modals/warningModal');
const { createInquiryModal } = require('../modals/inquiryModal');

const handleSelectMenus = async (interaction) => {
  if (interaction.customId === 'reportSelect') {
    switch (interaction.values[0]) {
      case 'warning':
        const warningModal = createWarningModal();
        await interaction.showModal(warningModal);
        break;
      case 'inquiry':
        const inquiryModal = createInquiryModal();
        await interaction.showModal(inquiryModal);
        break;
    }
  }
};

module.exports = { handleSelectMenus }; 