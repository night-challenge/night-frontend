// 각인 탭 전용 mock 데이터 (공용 mockData.js와 분리 → 팀 작업 시 충돌 방지)
// 백엔드 연동 여부는 mockData.js의 USE_MOCK 플래그를 그대로 사용한다.
//
// 명세서 기준 각 각인 필드:
//   id, constellationName, keywords[], comment, createdAt
//   constellationData: { before, after }  ← 상세 조회에서 before/after 따로 반환
//     - before: 원본 이동 기록(플레이 순서대로 이은 경로)
//     - after : 최종 별자리 (카드 썸네일에는 after만 사용)

const points1 = [
  { id: 0, x: 40, y: 300 }, { id: 1, x: 75, y: 280 }, { id: 2, x: 130, y: 270 },
  { id: 3, x: 155, y: 175 }, { id: 4, x: 180, y: 130 }, { id: 5, x: 195, y: 70 },
  { id: 6, x: 250, y: 115 }, { id: 7, x: 225, y: 175 }, { id: 8, x: 215, y: 195 },
  { id: 9, x: 225, y: 215 }, { id: 10, x: 180, y: 260 },
]

const points2 = [
  { id: 0, x: 60, y: 300 }, { id: 1, x: 90, y: 260 }, { id: 2, x: 100, y: 210 },
  { id: 3, x: 140, y: 170 }, { id: 4, x: 170, y: 200 }, { id: 5, x: 210, y: 140 },
  { id: 6, x: 250, y: 100 }, { id: 7, x: 290, y: 130 }, { id: 8, x: 270, y: 180 },
  { id: 9, x: 230, y: 220 }, { id: 10, x: 200, y: 260 },
]

// before = 플레이 순서대로 이은 경로(체인)
const chain = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
]

// GET /api/engraving-requests?status=신청완료 응답(records)을 흉내낸 mock
// 각 신청 건: 제품 코드 + 제품 정보 + 신청한 각인
export const mockEngravingRequests = [
  { id: 101, status: '신청완료', productCode: 'NWdfw25', engraving: null },
  { id: 102, status: '신청완료', productCode: 'KMx8yz90', engraving: null },
]

// GET /api/mypage 응답(data)을 흉내낸 mock (recentCard는 Profile에서 최신 각인으로 채움)
export const mockMypage = {
  nickname: '별 헤는 밤',
  userId: '@mcm_user01',
  hasEngravingRequest: true,
}

export const mockEngravings = [
  {
    id: 2,
    constellationName: '설렘의 흔적',
    keywords: ['설렘', '용기', '선택'],
    comment: '초반에는 다양한 시도를 했지만, 후반에는 신중하게 마무리했습니다.',
    createdAt: '2026-08-08T14:20:00',
    constellationData: {
      before: { points: points2, connections: chain },
      after: {
        points: points2,
        connections: [
          [0,1],[0,2],[1,2],[1,10],[2,3],[2,4],[3,4],[3,5],[4,5],[4,9],[4,10],
          [5,6],[5,8],[6,7],[6,8],[7,8],[8,9],[9,10],
        ],
      },
    },
  },
  {
    id: 1,
    constellationName: '오리온의 흔적',
    keywords: ['침착함', '역전', '도전'],
    comment: '초반에는 신중하게 전개했지만, 후반에는 과감한 공격을 선택했습니다.',
    createdAt: '2026-08-07T10:30:00',
    constellationData: {
      before: { points: points1, connections: chain },
      after: {
        points: points1,
        connections: [
          [0,1],[0,2],[1,2],[1,10],[2,10],[2,3],[3,4],[3,7],[3,8],
          [4,5],[4,6],[4,7],[5,6],[6,7],[7,8],[7,9],[8,9],[9,10],[10,0],
        ],
      },
    },
  },
]
