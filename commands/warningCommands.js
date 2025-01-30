const warningCommands = [
  {
    name: 'warn',
    description: '사용자에게 경고를 부여합니다',
    options: [
      {
        name: 'user',
        description: '경고를 부여할 사용자',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: '경고 사유',
        type: 3,
        required: true
      },
      {
        name: 'visibility',
        description: '경고 공개 여부',
        type: 3,
        required: true,
        choices: [
          {
            name: '공개',
            value: 'public'
          },
          {
            name: '비공개',
            value: 'private'
          }
        ]
      }
    ]
  },
  {
    name: 'unwarn',
    description: '사용자의 경고를 취소합니다',
    options: [
      {
        name: 'user',
        description: '경고를 취소할 사용자',
        type: 6,
        required: true
      },
      {
        name: 'reason',
        description: '경고 취소 사유',
        type: 3,
        required: true
      }
    ]
  },
  {
    name: 'warnings',
    description: '사용자의 경고 내역을 조회합니다',
    options: [
      {
        name: 'user',
        description: '조회할 사용자',
        type: 6,
        required: true
      }
    ]
  }
];

module.exports = warningCommands; 