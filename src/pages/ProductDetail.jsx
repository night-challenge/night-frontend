import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { thumbMap, detailImageMap, engravingBaseImageMap } from '../data/productAssets'
import EngravingConstellation from '../components/EngravingConstellation'
import EngravingPreview from '../components/EngravingPreview'
import '../styles/ProductDetail.css'
import { USE_MOCK, mockProductDetails } from '../data/mockData'
import { mockEngravings } from '../data/engravingData'

const PAGE_SIZE = 4
const COLORS = [
  { key: 'gold', label: '골드', hex: '#E8A33D' },
  { key: 'silver', label: '실버', hex: '#B0B0B0' },
  { key: 'black', label: '블랙', hex: '#1A1A1A' },
]

function ProductDetail() {
  const { optionId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const category = location.state?.category

  const [product, setProduct] = useState(null)
  const [productLoading, setProductLoading] = useState(true)
  const [productError, setProductError] = useState(null)

  const [engravings, setEngravings] = useState([])
  const [engravingLoading, setEngravingLoading] = useState(true)
  const [page, setPage] = useState(0)

  const [selectedRecordId, setSelectedRecordId] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showColorModal, setShowColorModal] = useState(false)

  // 7. 제품 상세 조회
  useEffect(() => {
    const fetchProduct = async () => {
      setProductLoading(true)
      setProductError(null)
      try {
        if (USE_MOCK) {
          const detail = mockProductDetails[optionId]
          if (!detail) throw new Error('존재하지 않는 제품입니다.')
          setProduct(detail)
        } else {
          const res = await axios.get(`/api/products/options/${optionId}`)
          setProduct(res.data.data)
        }
      } catch (err) {
        setProductError(
          err.response?.data?.message || err.message || '제품 정보를 불러오지 못했습니다.'
        )
      } finally {
        setProductLoading(false)
      }
    }
    fetchProduct()
  }, [optionId])
  
  const handleConfirmColor = () => {
    setShowColorModal(false)
  }
  // 각인 리스트 조회 (화면 5, 8 공통 API)
  useEffect(() => {
    const fetchEngravings = async () => {
      setEngravingLoading(true)
      try {
        if (USE_MOCK) {
          setEngravings(mockEngravings)
        } else {
          const res = await axios.get('/api/engravings')
          setEngravings(res.data.data.records)
        }
      } catch (err) {
        setEngravings([])
      } finally {
        setEngravingLoading(false)
      }
    }
    fetchEngravings()
  }, [])
  const siblingOptions = location.state?.siblingOptions || []

  

  const labelKey = product?.optionLabel ?? '기본'

  const mainImage =
    category && product
      ? detailImageMap[category]?.[labelKey]
      : null

  const engravingImage =
    category && product
      ? engravingBaseImageMap[category]?.[labelKey]
      : null

  // 현재 선택된 각인 레코드 (별자리 points/connections 포함)
  // 현재 선택된 각인 레코드 (별자리 points/connections 포함)
  const selectedRecord = engravings.find((e) => e.id === selectedRecordId) || null
  const selectedConstellationData =
    selectedRecord?.constellationData?.after ?? selectedRecord?.constellationData ?? null

  const handleThumbClick = (newId) => {
    if (String(newId) === String(optionId)) return
    navigate(`/product/${newId}`, {
      replace: true,
      state: { category, siblingOptions },
    })
  }

  const totalPages = Math.max(1, Math.ceil(engravings.length / PAGE_SIZE))
  const pagedEngravings = engravings.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  )

  const canSubmit = selectedRecordId && selectedColor && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await axios.post('/api/engraving-requests', {
        nightPathRecordId: selectedRecordId,
        productOptionId: Number(optionId),
        engravingColor: selectedColor,
      })
      setSubmitSuccess(res.data.data.productCode)
    } catch (err) {
      // 화면 7.5 에러 안내 대응 (미선택/둘다미선택 등 백엔드 방어 검증 케이스)
      setSubmitError(
        err.response?.data?.message || '신청 중 오류가 발생했습니다.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (productLoading) {
    return <div className="product-detail__status">불러오는 중...</div>
  }

  if (productError || !product) {
    return (
      <div className="product-detail__status">
        {productError || '제품을 찾을 수 없습니다.'}
      </div>
    )
  }

  return (
    <div className="product-detail">
      <header className="product-detail__topbar">
        <button
          className="product-detail__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          ‹
        </button>
        <h1 className="product-detail__topbar-title">제품 더보기</h1>
      </header>

      <div className="product-detail__image-area">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.optionName}
            className="product-detail__image"
          />
        ) : (
          <div className="product-detail__image product-detail__image--placeholder" />
        )}

        {siblingOptions.length > 1 && (
          <div className="product-detail__thumbnails">
            {siblingOptions.map((opt) => {
              const thumbSrc = category && thumbMap[category]?.[opt.label ?? '기본']
              const isActive = String(opt.id) === String(optionId)
              return (
                <button
                  key={opt.id}
                  className={
                    'product-detail__thumb-btn' +
                    (isActive ? ' product-detail__thumb-btn--active' : '')
                  }
                  onClick={() => handleThumbClick(opt.id)}
                >
                  {thumbSrc && <img src={thumbSrc} alt={opt.label} />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <h2 className="product-detail__name">{product.optionName}</h2>
      <p className="product-detail__price">
        ₩{product.price.toLocaleString('ko-KR')}
      </p>

      <section className="product-detail__section">
        <h3 className="product-detail__section-title">제품 상세정보</h3>
        {product.description.split('\n').map((line, idx) =>
          line.trim() ? <p key={idx} className="product-detail__desc-line">{line}</p> : null
        )}
      </section>

      <section className="product-detail__section">
        <h3 className="product-detail__section-title">제품에 새길 각인 선택하기</h3>

        {engravingLoading && <p className="product-detail__status-inline">각인 목록 불러오는 중...</p>}

        {!engravingLoading && engravings.length === 0 && (
          <p className="product-detail__status-inline">
            아직 생성된 각인이 없어요. 먼저 각인을 만들어주세요.
          </p>
        )}

        {!engravingLoading && engravings.length > 0 && (
          <>
            <div className="engraving-list">
              {pagedEngravings.map((record) => (
                <button
                  key={record.id}
                  className={
                    'engraving-card' +
                    (selectedRecordId === record.id ? ' engraving-card--active' : '')
                  }
                  onClick={() => setSelectedRecordId(record.id)}
                >
                  <div className="engraving-card__thumb">
                    <EngravingConstellation
                      data={record.constellationData?.after ?? record.constellationData}
                      space="canvas"
                      size={56}
                    />
                  </div>
                  <div className="engraving-card__text">
                    <p className="engraving-card__name">{record.constellationName}</p>
                    <p className="engraving-card__keywords">
                      {record.keywords.join(' · ')}
                    </p>
                    <p className="engraving-card__comment">{record.comment}</p>
                  </div>
                  <span className="engraving-card__chevron">›</span>
                </button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="engraving-pager">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  ‹
                </button>
                <span>{page + 1}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="product-detail__section">
        <h3 className="product-detail__section-title product-detail__section-title--center">
          각인할 색 선정하기
        </h3>
        <div className="color-picker">
          {COLORS.map((c) => (
            <button
              key={c.key}
              className={
                'color-swatch' +
                (selectedColor === c.key
                  ? c.key === 'black'
                    ? ' color-swatch--active color-swatch--active-black'
                    : ' color-swatch--active'
                  : '')
              }
              style={{ backgroundColor: c.hex }}
              aria-label={c.label}
              onClick={() => {
                setSelectedColor(c.key)
                setShowColorModal(true)
              }}
            />
          ))}
        </div>
      </section>

      {showColorModal && (
        <div
          className="color-modal-overlay"
          onClick={() => setShowColorModal(false)}
        >
          <div className="color-modal" onClick={(e) => e.stopPropagation()}>
            <p className="color-modal__note">
              예시 이미지입니다.
              <br />
              이후 선택한 각인이 예시와 같이 새겨집니다.
            </p>

            <div className="color-modal__preview">
              {engravingImage ? (
                <EngravingPreview
                  category={category}
                  baseImageSrc={engravingImage}
                  constellationData={selectedConstellationData}
                  engravingColor={selectedColor}
                  altText={product.optionName}
                  scale={2}
                />
              ) : (
                '각인된 부분 이미지'
              )}
            </div> 

            <div className="color-modal__swatches">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  className={
                    'color-swatch' +
                    (selectedColor === c.key
                      ? c.key === 'black'
                        ? ' color-swatch--active color-swatch--active-black'
                        : ' color-swatch--active'
                      : '')
                  }
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.label}
                  onClick={() => setSelectedColor(c.key)}
                />
              ))}
            </div>

            <button
              className="color-modal__confirm-btn"
              onClick={handleConfirmColor}
              disabled={submitting}
            >
              이 색으로 선택하기
            </button>
          </div>
        </div>
      )}

      <button className="product-detail__more-link">
        MCM에서 더 많은 제품 보기
        <span>›</span>
      </button>

      {submitError && <p className="product-detail__error">{submitError}</p>}
      {submitSuccess && (
        <p className="product-detail__success">
          신청 완료! 제품 코드: {submitSuccess}
        </p>
      )}

      <button
        className="product-detail__submit-btn"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {submitting ? '신청 중...' : '신청하기'}
      </button>
    </div>
  )
}

export default ProductDetail