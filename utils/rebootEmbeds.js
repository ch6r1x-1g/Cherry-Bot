const { EmbedBuilder } = require('discord.js');

class RebootEmbeds {
  static createInitialRebootEmbed(user, rebootType, currentTime) {
    return new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🔄 봇 재시작 진행')
      .addFields(
        {
          name: '실행자',
          value: `${user.tag} (${user.id})`,
          inline: true
        },
        {
          name: '재시작 유형',
          value: rebootType === 'soft' ? '소프트 리부트' : '하드 리부트',
          inline: true
        },
        {
          name: '시작 시간',
          value: currentTime,
          inline: true
        }
      )
      .setDescription('재시작이 진행됩니다. 잠시만 기다려주세요...')
      .setTimestamp();
  }

  static createSuccessEmbed() {
    return new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ 재시작 완료')
      .setDescription('봇이 성공적으로 재시작되었습니다.')
      .addFields(
        {
          name: '완료 시간',
          value: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
          inline: true
        }
      )
      .setTimestamp();
  }

  static createErrorEmbed(error) {
    return new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ 재시작 실패')
      .setDescription('봇 재시작 중 오류가 발생했습니다.')
      .addFields(
        {
          name: '오류 내용',
          value: error.message,
          inline: false
        }
      )
      .setTimestamp();
  }

  static createRebootCompleteEmbed(ping) {
    return new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ 재시작 프로세스 완료')
      .setDescription('봇이 성공적으로 재시작되었습니다.')
      .addFields(
        {
          name: '봇 상태',
          value: '정상 작동 중',
          inline: true
        },
        {
          name: '핑',
          value: `${ping}ms`,
          inline: true
        }
      )
      .setTimestamp();
  }
}

module.exports = RebootEmbeds; 