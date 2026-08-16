import api from './index'

export const gameApi = {
  // mode: 'EASY' | 'HARD' (대문자!)
  start: (mode) => api.post('/api/games', { mode: mode.toUpperCase() }),

  get: (gameId) => api.get(`/api/games/${gameId}`),

  // 진행 중인 게임 조회. 진행 중인 게임이 없으면 서버가 404를 반환함 (에러가 아니라 정상 케이스)
  getActive: () => api.get('/api/games/active'),

  legalMoves: (gameId, square) =>
    api.get(`/api/games/${gameId}/legal-moves`, { params: { square } }),

  move: (gameId, from, to) =>
    api.post(`/api/games/${gameId}/moves`, { from, to }),

  createEngraving: (gameId) => api.post(`/api/games/${gameId}/engravings`),

  // 최고 포인트 / 플레이 횟수 조회
  getStats: () => api.get('/api/games/stats'),
}