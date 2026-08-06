// 상단 네비게이션 바. 높이 53px, 아래쪽 얇은 구분선.
// MCM 워드마크 로고를 가운데 정렬해서 보여줍니다.
import logo from '../assets/mcm-word-mark-black.svg'

function NavBar() {
  return (
    <nav className="navbar">
      <img src={logo} alt="MCM" className="navbar-logo" />
    </nav>
  )
}

export default NavBar
