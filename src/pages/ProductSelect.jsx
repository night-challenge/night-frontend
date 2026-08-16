import { useEffect, useState } from 'react'
import axios from 'axios'

import bagBrown from '../assets/bag_product.svg'
import bagPink from '../assets/bag_pink.svg'
import bagBlack from '../assets/bag_black.svg'
import bagBrownThumb from '../assets/bag_brown_thumb.svg'
import bagPinkThumb from '../assets/bag_pink_thumb.svg'
import bagBlackThumb from '../assets/bag_black_thumb.svg'

import travelSuitcaseOption1 from '../assets/travel_suitcase_option1.svg'
import travelOption1Thumb from '../assets/travel_option1_thumb.svg'
import travelSuitcaseOption2 from '../assets/travel_suitcase_option2.svg'
import travelOption2Thumb from '../assets/travel_option2_thumb.svg'

import fashionPerfumeOption1 from '../assets/fashion_perfume_option1.svg'
import fashionPerfumeThumb1 from '../assets/fashion_perfume_thumb1.svg'
import fashionPerfumeOption2 from '../assets/fashion_perfume_option2.svg'
import fashionPerfumeThumb2 from '../assets/fashion_perfume_thumb2.svg'

import lifestyleAirpodCase from '../assets/lifestyle_airpod_case.svg'

import '../styles/ProductSelect.css'

import { useNavigate } from 'react-router-dom'
import { USE_MOCK, mockProductsByCategory } from '../data/mockData'


const categories = ['가방', '트래블', '패션소품', '라이프스타일']

// 백엔드 응답엔 이미지가 없어서, optionLabel 기준으로 로컬 이미지를 매칭하는 테이블
const imageMap = {
  '가방': {
    '갈색': { image: bagBrown, thumb: bagBrownThumb },
    '분홍': { image: bagPink, thumb: bagPinkThumb },
    '검정': { image: bagBlack, thumb: bagBlackThumb },
  },
  '트래블': {
    '갈색': { image: travelSuitcaseOption1, thumb: travelOption1Thumb },
    '분홍': { image: travelSuitcaseOption2, thumb: travelOption2Thumb },
  },
  '패션소품': {
    '50ml': { image: fashionPerfumeOption1, thumb: fashionPerfumeThumb1 },
    '75ml': { image: fashionPerfumeOption2, thumb: fashionPerfumeThumb2 },
  },
  '라이프스타일': {
    '기본': { image: lifestyleAirpodCase, thumb: lifestyleAirpodCase },
  },
}


function ProductSelect() {
  const [activeCategory, setActiveCategory] = useState('가방')
  const [products, setProducts] = useState([])
  const [productIndex, setProductIndex] = useState(0)
  const [optionIndex, setOptionIndex] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSelect = () => {
    navigate(`/product/${currentOption.id}`, {
      state: {
        category: activeCategory,
        // 같은 제품의 색상/옵션 형제 목록을 통째로 넘겨줌 (상세페이지 썸네일용)
        siblingOptions: current.options.map((opt) => ({
          id: opt.id,
          label: opt.label,
        })),
      },
    })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        let options
        if (USE_MOCK) {
          options = mockProductsByCategory[activeCategory] || []
        } else {
          const res = await axios.get('/api/products', {
            params: { category: activeCategory },
          })
          options = res.data.data.options
        }

        const grouped = {}
        options.forEach((opt) => {
          if (!grouped[opt.optionName]) {
            grouped[opt.optionName] = { name: opt.optionName, options: [] }
          }
          // 수정
        const labelKey = opt.optionLabel ?? '기본'
        const localImg = imageMap[activeCategory]?.[labelKey] || {}
          grouped[opt.optionName].options.push({
            id: opt.id,
            label: opt.optionLabel,
            price: opt.price,
            image: localImg.image,
            thumb: localImg.thumb,
          })
        })

        setProducts(Object.values(grouped))
        setProductIndex(0)
        setOptionIndex(0)
      } catch (err) {
        setProducts([])
        setErrorMessage(
          err.response?.data?.message || '제품 목록을 불러오지 못했습니다.'
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [activeCategory])

  const current = products[productIndex] || null
  const currentOption = current?.options[optionIndex] || null

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
  }

  const handleOptionSelect = (idx) => {
    setOptionIndex(idx)
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

      {isLoading && <p className="product-select__desc">불러오는 중...</p>}
      {errorMessage && <p className="product-select__desc">{errorMessage}</p>}

      {current && currentOption && (
        <div className="product-card">
          <div className="product-card__image-area">
            <img
              src={currentOption.image}
              alt={current.name}
              className="product-card__image"
            />

            {current.options.length > 1 && (
              <div className="product-card__thumbnails">
                {current.options.map((opt, idx) => (
                  <button
                    key={opt.id}
                    className={'product-card__thumb-btn' + (idx === optionIndex ? ' product-card__thumb-btn--active' : '')}
                    onClick={() => handleOptionSelect(idx)}
                  >
                    <img
                      src={opt.thumb}
                      alt={opt.label}
                      className="product-card__thumb-img"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-card__info">
            <div className="product-card__text">
              <p className="product-card__name">{current.name}</p>
              <p className="product-card__price">{formatPrice(currentOption.price)}</p>
            </div>
            <button className="product-card__select-btn" onClick={handleSelect}>
              선택
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSelect