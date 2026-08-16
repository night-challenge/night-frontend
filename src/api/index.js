import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// 서버가 { status: 'error', message: '...' } 형태로 에러를 줄 때
// 컴포넌트마다 매번 체크하지 않도록 여기서 한 번에 처리
api.interceptors.response.use(
  (res) => {
    if (res.data?.status === 'error') {
      const err = new Error(res.data.message ?? '요청에 실패했습니다.')
      err.status = res.status
      return Promise.reject(err)
    }
    return res
  },
  (error) => {
    const serverMessage = error.response?.data?.message
    const message = serverMessage ?? '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
    const err = new Error(message)
    // 원본 axios 에러의 status를 보존해야 컴포넌트에서 404 같은 특정 상태를
    // "정상적인 케이스"로 구분해 처리할 수 있음 (e.g. 진행 중인 게임 없음)
    err.status = error.response?.status
    return Promise.reject(err)
  }
)

export default api