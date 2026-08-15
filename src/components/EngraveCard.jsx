// EngraveCard.jsx — 각인 목록(화면 5)의 카드 한 줄.
// (별자리 좌표 렌더링 자체는 EngravingConstellation.jsx가 담당. 이 카드는
// 항상 after(최종 별자리, 300x300 캔버스 좌표)만 보여준다.)
import EngravingConstellation from './EngravingConstellation.jsx'
import arrowIcon from '../assets/right arrow.png'

function EngraveCard({ constellation, image, title, tags, description, onClick }) {
  return (
    <button className="engrave-card" onClick={onClick}>
      <div className="engrave-card__thumb">
        {image ? (
          <img src={image} alt="" />
        ) : constellation ? (
          <EngravingConstellation data={constellation} space="canvas" size={100} />
        ) : null}
      </div>

      <div className="engrave-card__body">
        <p className="engrave-card__title">{title}</p>
        <p className="engrave-card__tags">{tags}</p>
        <p className="engrave-card__desc">{description}</p>
      </div>

      <img src={arrowIcon} alt="" className="engrave-card__arrow" />
    </button>
  )
}

export default EngraveCard
