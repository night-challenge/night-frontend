// src/mockApi.js
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true') {
  const originalFetch = window.fetch

  let mockGameState = {
    gameSessionId: 'test-session-1',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    currentTurn: 0,
    score: 0,
    targetScore: 30,
    status: 'IN_PROGRESS',
  }

  window.fetch = async (url, options = {}) => {
    const path = typeof url === 'string' ? url : url.toString()

    // 게임 상태 조회
    if (path.match(/\/api\/games\/[^/]+$/) && (!options.method || options.method === 'GET')) {
      return new Response(JSON.stringify({ status: 'ok', data: mockGameState }), { status: 200 })
    }

    // 가능한 이동 조회
    if (path.includes('/legal-moves')) {
      const square = new URL(path, 'http://x').searchParams.get('square')
      // 나이트 기준 임시 이동 목록 (원하는 대로 수정)
      return new Response(JSON.stringify({ legalMoves: ['C3', 'C5', 'E3', 'E5'] }), { status: 200 })
    }

    // 이동 확정
    if (path.match(/\/api\/games\/[^/]+\/moves$/) && options.method === 'POST') {
      mockGameState = {
        ...mockGameState,
        currentTurn: mockGameState.currentTurn + 1,
        score: mockGameState.score + 3,
      }
      return new Response(JSON.stringify({
        status: 'ok',
        data: {
          userMove: { captured: 'PAWN', pointGained: 3 },
          aiMove: { from: 'E7', to: 'E5' },
          gameState: mockGameState,
        },
      }), { status: 200 })
    }

    return originalFetch(url, options)
  }
}