import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* 새 페이지 추가할 땐 여기 <Route> 한 줄씩 늘리면 돼요 */}
    </Routes>
  )
}

export default App
