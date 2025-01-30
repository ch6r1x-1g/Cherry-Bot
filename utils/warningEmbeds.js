const { EmbedBuilder } = require('discord.js');

class WarningEmbeds {
  static createWarningEmbed(targetUser, warningCount, executor, reason, userWarnings, currentTime) {
    return new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('⚠️ 경고 알림')
      .setDescription('새로운 경고가 발생했습니다.')
      .addFields(
        {
          name: '👤 경고 대상자',
          value: `${targetUser}`,
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
  }

  static createCautionEmbed(warningCount) {
    return new EmbedBuilder()
      .setColor('#FFA500')
      .setDescription(`⚠️ 현재 경고 ${warningCount}회 / 3회 (3회 누적 시 제재 대상)`)
      .setFooter({
        text: '이의제기는 관리자에게 문의해주세요.'
      });
  }

  static createUnwarnEmbed(targetUser, newWarningCount, executor, reason, currentTime) {
    return new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ 경고 취소')
      .setDescription('경고가 취소되었습니다.')
      .addFields(
        {
          name: '👤 대상자',
          value: `${targetUser}`,
          inline: false
        },
        {
          name: '🔢 남은 경고 횟수',
          value: `${newWarningCount}회`,
          inline: true
        },
        {
          name: '👮 처리자',
          value: executor,
          inline: true
        },
        {
          name: '📝 취소 사유',
          value: reason,
          inline: false
        }
      )
      .setFooter({
        text: `처리 시간: ${currentTime}`
      })
      .setTimestamp();
  }

  static createDMWarningEmbed(guildName, reason, warningCount, currentTime) {
    return new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('⚠️ 경고 알림')
      .setDescription(`${guildName} 서버에서 경고를 받았습니다.`)
      .addFields(
        { name: '경고 사유', value: reason, inline: false },
        { name: '현재 경고 수', value: `${warningCount}회`, inline: true },
        { name: '경고 발행 시간', value: currentTime, inline: true }
      )
      .setFooter({ text: '이의가 있으시다면 관리자에게 문의해주세요.' });
  }

  static createDMUnwarnEmbed(guildName, reason, newWarningCount, currentTime) {
    return new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ 경고 취소 알림')
      .setDescription(`${guildName} 서버의 경고가 취소되었습니다.`)
      .addFields(
        { name: '취소 사유', value: reason, inline: false },
        { name: '남은 경고 수', value: `${newWarningCount}회`, inline: true },
        { name: '처리 시간', value: currentTime, inline: true }
      )
      .setFooter({ text: '문의사항이 있으시다면 관리자에게 문의해주세요.' });
  }

  static createWarningLogEmbed(targetUser, executor, warningCount, reason) {
    return new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('📝 경고 로그')
      .addFields(
        { name: '대상자', value: `${targetUser} (${targetUser.id})`, inline: true },
        { name: '처리자', value: `${executor} (${executor.id})`, inline: true },
        { name: '현재 경고 수', value: `${warningCount}회`, inline: true },
        { name: '사유', value: reason, inline: false }
      )
      .setTimestamp();
  }
}

module.exports = WarningEmbeds; 