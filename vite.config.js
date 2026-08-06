import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 나중에 스프링부트 백엔드랑 연결할 때 여기 proxy 설정 쓰면 돼요.
    // proxy: {
    //   '/api': 'http://localhost:8080',
    // },
  },
})
