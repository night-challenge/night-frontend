// 나이트 챌린지 게임 관련 mock 데이터
// hasPlayed: 게임을 한 번이라도 했는지 여부에 따라 GameHome 화면 분기
export const gameStatus = {
  hasPlayed: true, // false면 최근 게임 결과 없이 렌더, true면 최근 게임 결과 표시
  bestScore: 120,
  remainingScore: 30,
  playCount: 1,
}