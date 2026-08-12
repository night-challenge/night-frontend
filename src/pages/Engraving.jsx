import EngraveCard from '../components/EngraveCard.jsx'
import '../styles/Engraving.css'

// 임시 데이터 (나중에 백엔드에서 받아온 걸로 교체하면 돼요)
const items = [
  { id: 1, title: '오리온의 흔적', tags: '침착함 · 역전 · 도전', description: '초반에는 신중하게 전개했지만,\n후반에는 과감한 공격을 선택했습니다.' },
  { id: 2, title: '오리온의 흔적', tags: '침착함 · 역전 · 도전', description: '초반에는 신중하게 전개했지만,\n후반에는 과감한 공격을 선택했습니다.' },
  { id: 3, title: '오리온의 흔적', tags: '침착함 · 역전 · 도전', description: '초반에는 신중하게 전개했지만,\n후반에는 과감한 공격을 선택했습니다.' },
  { id: 4, title: '오리온의 흔적', tags: '침착함 · 역전 · 도전', description: '초반에는 신중하게 전개했지만,\n후반에는 과감한 공격을 선택했습니다.' },
]

function Engraving() {
  return (
    <div className="engraving">
      <h1 className="engraving__title">각인 이름 수정하기</h1>
      <p className="engraving__subtitle">최근 작업된 각인</p>

      <div className="engraving__list">
        {items.map((item) => (
          <EngraveCard
            key={item.id}
            title={item.title}
            tags={item.tags}
            description={item.description}
            onClick={() => console.log('카드 클릭:', item.id)}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button className="pagination__arrow">‹</button>
        <span className="pagination__page">1</span>
        <button className="pagination__arrow">›</button>
      </div>
    </div>
  )
}

export default Engraving
