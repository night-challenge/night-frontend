// 휴대폰 목업 프레임.
// children(안에 들어갈 화면)을 375 x 812 크기의 폰 화면 안에 넣어줍니다.
// 위: 네비바 / 가운데: 내용(스크롤) / 아래: 탭바
import NavBar from './NavBar.jsx'
import TabBar from './TabBar.jsx'

function PhoneFrame({ children }) {
  return (
    <div className="phone-frame">
      <div className="phone-screen">
        <NavBar />
        <div className="phone-content">{children}</div>
        <TabBar />
      </div>
    </div>
  )
}

export default PhoneFrame
