import rightArrow from '../assets/right arrow.png'

// 각인 카드 컴포넌트.
// props로 이미지, 제목, 태그, 설명을 받아서 보여줍니다. (재사용 가능)
function EngraveCard({ image, title, tags, description, onClick }) {
  return (
    <button className="engrave-card" onClick={onClick}>
      {/* 왼쪽 썸네일 (이미지 없으면 회색 박스) */}
      <div className="engrave-card__thumb">
        {image && <img src={image} alt="" />}
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
  44
export default EngraveCard






