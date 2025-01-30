const WarningEmbeds = require('../utils/warningEmbeds');
const warningManager = require('../utils/warningManager');

class WarningHandler {
  static async handleWarn(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers')) {
      return await interaction.reply({
        content: '이 명령어를 사용할 권한이 없습니다.',
        ephemeral: true
      });
    }

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const visibility = interaction.options.getString('visibility');
    const currentTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const warning = {
      reason,
      executor: interaction.user.tag,
      executorId: interaction.user.id,
      timestamp: currentTime,
      visibility: visibility
    };

    const warningCount = await warningManager.addWarning(targetUser.id, warning);
    const userWarnings = warningManager.getWarnings(targetUser.id);

    const warningEmbed = WarningEmbeds.createWarningEmbed(
      targetUser, warningCount, interaction.user.tag, reason, userWarnings, currentTime
    );
    const cautionEmbed = WarningEmbeds.createCautionEmbed(warningCount);

    if (visibility === 'private') {
      await interaction.reply({
        embeds: [warningEmbed, cautionEmbed],
        ephemeral: true
      });

      const logEmbed = WarningEmbeds.createWarningLogEmbed(
        targetUser, interaction.user, warningCount, reason
      );

      await interaction.channel.send({
        embeds: [logEmbed],
        ephemeral: true
      });
    } else {
      await interaction.reply({
        embeds: [warningEmbed, cautionEmbed],
        ephemeral: false
      });
    }

    await this.sendWarningDM(targetUser, interaction.guild.name, reason, warningCount, currentTime);
    await this.checkWarningThreshold(interaction, targetUser, warningCount);
  }

  static async handleUnwarn(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers')) {
      return await interaction.reply({
        content: '이 명령어를 사용할 권한이 없습니다.',
        ephemeral: true
      });
    }

    const targetUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const currentTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const currentWarnings = warningManager.getCurrentWarnings(targetUser.id);
    if (currentWarnings === 0) {
      return await interaction.reply({
        content: '해당 사용자는 경고가 없습니다.',
        ephemeral: true
      });
    }

    const newWarningCount = await warningManager.removeLastWarning(targetUser.id);
    const unwarnEmbed = WarningEmbeds.createUnwarnEmbed(
      targetUser, newWarningCount, interaction.user.tag, reason, currentTime
    );

    await interaction.reply({ embeds: [unwarnEmbed] });
    await this.sendUnwarnDM(targetUser, interaction.guild.name, reason, newWarningCount, currentTime);
  }

  static async handleWarnings(interaction) {
    const targetUser = interaction.options.getUser('user');
    const warnings = warningManager.getWarnings(targetUser.id);

    const warningsEmbed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle(`📋 경고 내역 - ${targetUser.tag}`)
      .setDescription(warnings.length > 0
        ? warnings.filter(w => w.visibility === 'public')
          .map((w, i) =>
            `${i + 1}. ${w.reason} (${w.executor}) - ${new Date(w.timestamp).toLocaleString('ko-KR')}`
          ).join('\n')
        : '경고 내역이 없습니다.')
      .setFooter({ text: `총 경고 수: ${warnings.length}회` })
      .setTimestamp();

    await interaction.reply({ embeds: [warningsEmbed] });
  }

  static async sendWarningDM(user, guildName, reason, warningCount, currentTime) {
    try {
      const dmEmbed = WarningEmbeds.createDMWarningEmbed(
        guildName, reason, warningCount, currentTime
      );
      await user.send({ embeds: [dmEmbed] });
    } catch (error) {
      console.error('DM 전송 실패:', error);
    }
  }

  static async sendUnwarnDM(user, guildName, reason, newWarningCount, currentTime) {
    try {
      const dmEmbed = WarningEmbeds.createDMUnwarnEmbed(
        guildName, reason, newWarningCount, currentTime
      );
      await user.send({ embeds: [dmEmbed] });
    } catch (error) {
      console.error('DM 전송 실패:', error);
    }
  }

  static async checkWarningThreshold(interaction, targetUser, warningCount) {
    if (warningCount >= 3) {
      const alertEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('🚨 경고 3회 초과')
        .setDescription(`${targetUser}님의 경고가 3회를 초과하여 제재 대상이 되었습니다.`)
        .setTimestamp();

      await interaction.channel.send({ embeds: [alertEmbed] });
    }
  }
}

module.exports = WarningHandler; 