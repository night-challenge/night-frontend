import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// 서버가 { status: 'error', message: '...' } 형태로 에러를 줄 때
// 컴포넌트마다 매번 체크하지 않도록 여기서 한 번에 처리
api.interceptors.response.use(
  (res) => {
    if (res.data?.status === 'error') {
      return Promise.reject(new Error(res.data.message ?? '요청에 실패했습니다.'))
    }
    return res
  },
  (error) => {
    const serverMessage = error.response?.data?.message
    const message = serverMessage ?? '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
    return Promise.reject(new Error(message))
  }
)

export default api