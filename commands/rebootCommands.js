const rebootCommands = [
  {
    name: 'reboot',
    description: '봇을 재시작합니다',
    options: [
      {
        name: 'type',
        description: '재시작 유형',
        type: 3, // STRING type
        required: true,
        choices: [
          {
            name: '소프트 리부트 (빠름)',
            value: 'soft'
          },
          {
            name: '하드 리부트 (전체 재시작)',
            value: 'hard'
          }
        ]
      }
    ]
  }
];

module.exports = rebootCommands; 