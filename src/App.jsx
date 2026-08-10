import { Routes, Route } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame.jsx'
import Home from './pages/Home.jsx'
import ProductSelect from './pages/ProductSelect.jsx'
import ProductDetail from './pages/ProductDetail.jsx'   // ← 추가


function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductSelect />} />
        <Route path="/product/:optionId" element={<ProductDetail />} />
      </Routes>
    </PhoneFrame>
  )
}

export default App
