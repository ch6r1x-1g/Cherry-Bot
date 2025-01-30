const { handleWarningModal } = require('../modals/warningModal');
const { handleInquiryModal } = require('../modals/inquiryModal');

const handleModals = async (interaction) => {
  switch (interaction.customId) {
    case 'warningModal':
      await handleWarningModal(interaction);
      break;
    case 'inquiryModal':
      await handleInquiryModal(interaction);
      break;
  }
};

module.exports = { handleModals }; 