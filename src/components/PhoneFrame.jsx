// 휴대폰 목업 프레임.
// children(안에 들어갈 화면)을 375 x 812 크기의 폰 화면 안에 넣어줍니다.
// 위: 네비바 / 가운데: 내용(스크롤) / 아래: 탭바
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import TabBar from './TabBar.jsx'

function PhoneFrame({ children }) {
  // .phone-content는 모든 화면(라우트)이 공유하는 하나의 스크롤 컨테이너라서,
  // 예전 화면을 스크롤한 상태로 다른 화면(예: 게임 시작하기)으로 넘어가면
  // 새 화면도 그 스크롤 위치(중간)로 보여지는 문제가 있었음.
  // → 경로(pathname)가 바뀔 때마다 스크롤을 맨 위로 리셋.
  const contentRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="phone-frame">
      <div className="phone-screen">
        <NavBar />
        <div className="phone-content" ref={contentRef}>
          {children}
        </div>
        <TabBar />
      </div>
    </div>
  )
}

export default PhoneFrame
