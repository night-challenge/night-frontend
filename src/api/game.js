import api from './index'

export const gameApi = {
  // mode: 'EASY' | 'HARD' (대문자!)
  start: (mode) => api.post('/api/games', { mode: mode.toUpperCase() }),

  get: (gameId) => api.get(`/api/games/${gameId}`),

  legalMoves: (gameId, square) =>
    api.get(`/api/games/${gameId}/legal-moves`, { params: { square } }),

  move: (gameId, from, to) =>
    api.post(`/api/games/${gameId}/moves`, { from, to }),

  createEngraving: (gameId) => api.post(`/api/games/${gameId}/engravings`),
}