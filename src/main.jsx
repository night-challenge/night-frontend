import './mockApi.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/index.css'

// 배포 환경에서는 '/api' 상대경로가 프론트 자신의 도메인으로 가버려서
// 실제 백엔드 서버 주소로 붙여줘야 함 (dev에선 vite.config.js 프록시가 대신 처리하므로
// VITE_API_BASE_URL이 없으면 그냥 기존처럼 상대경로로 동작)
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
