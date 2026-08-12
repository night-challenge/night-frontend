import { useNavigate, useLocation } from 'react-router-dom'

// 아이콘 불러오기 (기본 / 선택됨 _on)
import gameIcon from '../assets/game_icon.png'
import gameIconOn from '../assets/game_icon_on.png'
import penIcon from '../assets/pen_icon.png'
import penIconOn from '../assets/pen_icon_on.png'
import productIcon from '../assets/product_icon.png'
import productIconOn from '../assets/product_icon_on.png'
import profileIcon from '../assets/profile_icon.png'
import profileIconOn from '../assets/profile_icon_on.png'

// 탭 목록. icon = 기본, iconOn = 선택됐을 때
const tabs = [
  { key: 'game', label: '게임', icon: gameIcon, iconOn: gameIconOn, path: '/game' },
  { key: 'pen', label: '각인', icon: penIcon, iconOn: penIconOn , path: '/engraving'},
  { key: 'product', label: '제품', icon: productIcon, iconOn: productIconOn, path: '/products' },
  { key: 'profile', label: '마이', icon: profileIcon, iconOn: profileIconOn, path: '/profile' },
]

function TabBar() {
  // 지금 선택된 탭 (기본값: 게임)
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <nav className="tabbar">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <button
            key={tab.key}
            className={`tab${isActive ? ' tab--active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            {/* 선택됐을 때 뜨는 상단 빨간 바 */}
            <span className="tab-bar" />
            <img
              src={isActive ? tab.iconOn : tab.icon}
              alt={tab.label}
              className="tab-icon"
            />
            <span className="tab-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default TabBar
