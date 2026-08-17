import { Routes, Route } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame.jsx'
import Home from './pages/Home.jsx'
import ProductSelect from './pages/ProductSelect.jsx'
import ProductDetailWrapper from './pages/ProductDetailWrapper.jsx'
import GameIntro from './pages/GameIntro.jsx'
import GameHome from './pages/GameHome.jsx'
import GameBoard from './pages/GameBoard.jsx'
import GameSessionDetail from './pages/GameSessionDetail'
import Engraving from './pages/Engraving.jsx'
import EngravingDetail from './pages/EngravingDetail.jsx'
import EngravingRegenerate from './pages/EngravingRegenerate.jsx'
import EngravingNaming from './pages/EngravingNaming.jsx'
import EngravingCardResult from './pages/EngravingCardResult.jsx'
import Profile from './pages/Profile.jsx'
import EngravingRequests from './pages/EngravingRequests.jsx'
import EngravingCards from './pages/EngravingCards.jsx'

function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<GameIntro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductSelect />} />
        <Route path="/product/:optionId" element={<ProductDetailWrapper />} />
        <Route path="/game" element={<GameIntro />} />
        <Route path="/game/home" element={<GameHome />} />
        <Route path="/game/board/:gameSessionId" element={<GameBoard />} />
        <Route path="/game/result/:gameSessionId" element={<GameSessionDetail />} />
        <Route path="/engraving" element={<Engraving />} />
        <Route path="/engraving/regenerate/:id" element={<EngravingRegenerate />} />
        <Route path="/engraving/naming/:id" element={<EngravingNaming />} />
        <Route path="/engraving/card/:id" element={<EngravingCardResult />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/engraving-requests" element={<EngravingRequests />} />
        <Route path="/engravings/cards" element={<EngravingCards />} />
        <Route path="/engraving/:id" element={<EngravingDetail />} />
      </Routes>
    </PhoneFrame>
  )
}

export default App