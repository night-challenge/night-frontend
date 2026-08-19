// src/api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const serverMessage = error.response?.data?.message
    const message = serverMessage ?? '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'
    // 원본 에러 정보는 유지하되, message만 사용자용으로 통일
    return Promise.reject(new Error(message))
  }
)

export default api