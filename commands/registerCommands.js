const warningCommands = require('./warningCommands');
const rebootCommands = require('./rebootCommands');

const registerCommands = async (client) => {
  try {
    const commands = [
      ...warningCommands,
      ...rebootCommands,
      {
        name: 'sync',
        description: '슬래시 명령어 동기화'
      },
      {
        name: 'restart',
        description: '봇 재시작'
      },
      {
        name: 'inquiry',
        description: '문의하기'
      },
      {
        name: 'report',
        description: '신고/문의 메뉴'
      }
    ];

    await client.application.commands.set(commands);
    console.log('슬래시 명령어 동기화 완료');
  } catch (error) {
    console.error('초기 설정 오류:', error);
  }
};

module.exports = { registerCommands }; 