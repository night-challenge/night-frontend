import rightArrow from '../assets/right arrow.png'
import ConstellationThumb from './ConstellationThumb.jsx'

// 각인 카드 컴포넌트.
// props로 별자리 데이터/제목/태그/설명을 받아서 보여줍니다. (재사용 가능)
function EngraveCard({ constellation, image, title, tags, description, onClick }) {
  return (
    <button className="engrave-card" onClick={onClick}>
      {/* 왼쪽 썸네일: 별자리 데이터 있으면 별자리, 없으면 이미지/회색 박스 */}
      <div className="engrave-card__thumb">
        {constellation ? (
          <ConstellationThumb data={constellation} size={100} />
        ) : image ? (
          <img src={image} alt="" />
        ) : null}
      </div>

      {/* 가운데 내용 */}
      <div className="engrave-card__body">
        <h3 className="engrave-card__title">{title}</h3>
        <p className="engrave-card__tags">{tags}</p>
        <p className="engrave-card__desc">{description}</p>
      </div>

      {/* 오른쪽 화살표 */}
      <img src={rightArrow} alt="" className="engrave-card__arrow" />
    </button>
  )
}

export default EngraveCard
