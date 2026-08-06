import { useState } from 'react'

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
  { key: 'game', label: '게임', icon: gameIcon, iconOn: gameIconOn },
  { key: 'pen', label: '각인', icon: penIcon, iconOn: penIconOn },
  { key: 'product', label: '제품', icon: productIcon, iconOn: productIconOn },
  { key: 'profile', label: '마이', icon: profileIcon, iconOn: profileIconOn },
]

function TabBar() {
  // 지금 선택된 탭 (기본값: 게임)
  const [active, setActive] = useState('game')

  return (
    <nav className="tabbar">
      {tabs.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            className={`tab${isActive ? ' tab--active' : ''}`}
            onClick={() => setActive(tab.key)}
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
