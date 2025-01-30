const registerCommands = async (client) => {
  try {
    await client.application.commands.set([
      {
        name: 'sync',
        description: '슬래시 명령어 동기화'
      },
      {
        name: 'restart',
        description: '봇 재시작'
      },
      {
        name: 'warning',
        description: '경고 시스템'
      },
      {
        name: 'inquiry',
        description: '문의하기'
      },
      {
        name: 'report',
        description: '신고/문의 메뉴'
      },
      {
        name: 'warnings',
        description: '사용자의 경고 내역 조회',
        options: [
          {
            name: 'user',
            description: '조회할 사용자',
            type: 6, // USER type
            required: true
          }
        ]
      }
    ]);
    console.log('슬래시 명령어 동기화 완료');
  } catch (error) {
    console.error('초기 설정 오류:', error);
  }
};

module.exports = { registerCommands }; 