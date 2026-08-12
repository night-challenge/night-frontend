import { Routes, Route } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame.jsx'
import Home from './pages/Home.jsx'
import ProductSelect from './pages/ProductSelect.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import GameIntro from './pages/GameIntro.jsx'
import GameHome from './pages/GameHome.jsx'
import GameBoard from './pages/GameBoard.jsx'
import Engraving from './pages/Engraving.jsx'

function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<GameIntro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductSelect />} />
        <Route path="/product/:optionId" element={<ProductDetail />} />
        <Route path="/game" element={<GameIntro />} />
        <Route path="/game/home" element={<GameHome />} />
        <Route path="/game/board/:gameSessionId" element={<GameBoard />} />
        <Route path="/engraving" element={<Engraving />} />
      </Routes>
    </PhoneFrame>
  )
}

export default App