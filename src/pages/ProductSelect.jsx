import { useState } from 'react'
import bagImage from '../assets/bag_product.png'
import '../styles/ProductSelect.css'

const categories = ['가방', '트래블', '패션소품', '라이프스타일']

const productsByCategory = {
  '가방': [
    { name: 'L Aren 비세토스 스쿨 토트', price: 1250000, image: bagImage },
  ],
  '트래블': [
    { name: 'L 비세토스 수트케이스', price: 6750000, image: bagImage },
  ],
  '패션소품': [
    { name: '코스믹 스타 오 드 퍼퓸 75ml', price: 141000, image: bagImage },
  ],
  '라이프스타일': [
    { name: '엠보스드 모노그램 레더 에어팟 프로 케이스', price: 310000, image: bagImage },
  ],
}

function ProductSelect() {
  const [activeCategory, setActiveCategory] = useState('가방')
  const [productIndex, setProductIndex] = useState(0)

  const products = productsByCategory[activeCategory] || []
  const current = products[productIndex] || null

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setProductIndex(0)
  }

  const formatPrice = (price) => {
    return '₩' + price.toLocaleString('ko-KR')
  }

  return (
    <div className="product-select">
      <h1 className="product-select__title">각인 제품 선택</h1>
      <p className="product-select__desc">나만의 각인을 새길 제품을 선택하세요.</p>

      <div className="product-select__categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={'category-btn' + (activeCategory === cat ? ' category-btn--active' : '')}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {current && (
        <div className="product-card">
          <div className="product-card__image-area">
            <img
              src={current.image}
              alt={current.name}
              className="product-card__image"
            />
          </div>

          <div className="product-card__info">
            <div className="product-card__text">
              <p className="product-card__name">{current.name}</p>
              <p className="product-card__price">{formatPrice(current.price)}</p>
            </div>
            <button className="product-card__select-btn">선택</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSelect
