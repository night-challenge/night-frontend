import { Routes, Route } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame.jsx'
import Home from './pages/Home.jsx'
import ProductSelect from './pages/ProductSelect.jsx'



function App() {
  return (
    <PhoneFrame>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductSelect />} />
      </Routes>
    </PhoneFrame>
  )
}

export default App
