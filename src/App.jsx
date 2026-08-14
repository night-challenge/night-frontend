import { Routes, Route } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame.jsx'
import Home from './pages/Home.jsx'
import ProductSelect from './pages/ProductSelect.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import GameIntro from './pages/GameIntro.jsx'
import GameHome from './pages/GameHome.jsx'
import GameBoard from './pages/GameBoard.jsx'
import Engraving from './pages/Engraving.jsx'
import EngravingDetail from './pages/EngravingDetail.jsx'
import EngravingRegenerate from './pages/EngravingRegenerate.jsx'
import EngravingNaming from './pages/EngravingNaming.jsx'
import EngravingCardResult from './pages/EngravingCardResult.jsx'
import Profile from './pages/Profile.jsx'
import EngravingRequests from './pages/EngravingRequests.jsx'

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
        <Route path="/engraving/regenerate" element={<EngravingRegenerate />} />
        <Route path="/engraving/naming" element={<EngravingNaming />} />
        <Route path="/engraving/card" element={<EngravingCardResult />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/engraving-requests" element={<EngravingRequests />} />
        <Route path="/engraving/:id" element={<EngravingDetail />} />
      </Routes>
    </PhoneFrame>
  )
}

export default App