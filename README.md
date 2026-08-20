<div align="center">

# ♞ 나이트의 길 (Knight Challenge) 🌌

![나이트의 길 배너](docs/images/banner.png)

### "나이트의 움직임이, 나만의 밤하늘이 된다."

Knight의 움직임을 Night의 별자리로 연결하는 AI 기반 개인화 각인 서비스

> "나이트"는 체스 기물 **Knight**(기사)와 밤하늘 **Night**을 동시에 뜻하는 중의적 표현입니다.

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-CA4245?logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

**[🌐 서비스 바로가기](https://night-frontend-rho.vercel.app/)**

</div>

<br>

<div align="center">

2026년 '붉은 말의 해'에서 말의 이미지를 체스의 나이트(Knight)로 확장하고,<br>
체스판 위에 남겨진 나이트의 이동 궤적을 밤하늘의 별자리 디자인으로 재해석했습니다.

<br>

기존 제품 각인은 사용자가 준비된 디자인을 선택하거나 직접 디자인해야 했습니다.<br>
나이트의 길은 사용자가 디자인을 고민하는 대신,<br>
<b>플레이 과정 자체가 하나뿐인 제품 각인</b>이 되도록 합니다.

</div>

<br>

## 📑 목차

- [팀원](#-팀원)
- [기술 스택](#-기술-스택)
- [AI 활용 방식](#-ai-활용-방식)
- [주요 기능](#-주요-기능)
- [서비스 흐름](#-서비스-흐름)
- [프로젝트 구조](#-프로젝트-구조)
- [로컬 실행 방법](#-로컬-실행-방법)
- [테스트](#-테스트)
- [API 연동 방식](#-api-연동-방식)
- [배포 및 환경 설정](#-배포-및-환경-설정)
- [보안](#-보안)
- [관련 링크](#-관련-링크)

---

## 👥 팀원

<table width="100%">
  <tr align="center">
    <th width="20%">신지윤</th>
    <th width="20%">김민주</th>
    <th width="20%">현정요</th>
    <th width="20%">김의지</th>
    <th width="20%">장가윤</th>
  </tr>
  <tr align="center">
    <td><img src="https://github.com/shinjiyun-ux.png" width="90" /></td>
    <td><img src="https://github.com/llszos.png" width="90" /></td>
    <td><img src="https://github.com/iamnotjungyo.png" width="90" /></td>
    <td><img src="https://github.com/kimuiji.png" width="90" /></td>
    <td><img src="https://github.com/vynziie.png" width="90" /></td>
  </tr>
  <tr align="center">
    <td><a href="https://github.com/shinjiyun-ux">@shinjiyun-ux</a></td>
    <td><a href="https://github.com/llszos">@llszos</a></td>
    <td><a href="https://github.com/iamnotjungyo">@iamnotjungyo</a></td>
    <td><a href="https://github.com/kimuiji">@kimuiji</a></td>
    <td><a href="https://github.com/vynziie">@vynziie</a></td>
  </tr>
  <tr align="center">
    <td><code>PM/Design</code></td>
    <td><code>BE</code></td>
    <td><code>BE</code></td>
    <td><code>FE</code></td>
    <td><code>FE</code></td>
  </tr>
  <tr valign="top">
    <td>
      <b>[ 서비스 기획 ]</b><br>
      MCM 브랜드 특성·기회 요인 분석<br>
      유사 사례 및 경쟁 서비스 분석<br>
      서비스 방향 및 차별화 포인트 구체화<br>
      페르소나와 사용자 흐름 구체화<br>
      IA 및 기능명세서 구체화<br><br>
      <b>[ UX/UI 디자인 ]</b><br>
      게임·각인·제품·마이페이지 화면 설계<br>
      와이어프레임 및 프로토타입 제작<br>
      피그마 디자인 및 화면별 UI 관리<br><br>
      <b>[ 비즈니스 전략 ]</b><br>
      SWOT 및 경쟁시장 포지셔닝 분석<br>
      비즈니스 모델과 수익 구조 설계<br>
      마케팅 플랜 및 비즈니스 로드맵 수립<br>
      서비스 확장 방향 기획<br><br>
      <b>[ 발표 ]</b><br>
      발표 스토리 구성 및 자료 디자인
    </td>
    <td>
      <b>[ 보유 각인 ]</b><br>
      게임 각인 데이터 연동<br>
      보유 각인 목록/상세 조회<br>
      각인 이름 수정<br>
      원본 이동 궤적 응답 구성<br>
      최종 별자리 데이터 응답 구성<br><br>
      <b>[ 제품 및 각인 신청 ]</b><br>
      카테고리별 제품 목록/옵션 상세 조회<br>
      각인 신청(제품·보유 각인·색상 조합)<br>
      신청 상태별 목록 조회 및 취소<br>
      제품 코드 자동 생성<br>
      각인 색상 응답 연동<br><br>
      <b>[ 마이페이지 ]</b><br>
      사용자 정보 조회<br>
      제품 각인 신청 여부 조회<br>
      최근 생성 카드 조회<br>
      보유 각인 카드 모음/상세 조회<br><br>
      <b>[ 배포·연동 및 협업 ]</b><br>
      기능별 진행 상황 확인 및 일정 조율<br>
      Railway 백엔드·MySQL 환경 구성 및 배포<br>
      프론트엔드 API 연동 및 오류 보완<br>
      API 명세서·ERD·데이터 구조 문서 관리
    </td>
    <td>
      <b>[ 게임 세션 관리 ]</b><br>
      게임 세션 생성 및 이어하기<br>
      난이도별 목표 점수와 턴 관리<br>
      게임 상태 및 나이트 이동 궤적 저장<br><br>
      <b>[ 체스 엔진 및 AI 상대 ]</b><br>
      합법 이동 조회 및 이동 처리<br>
      체스 규칙 및 AI 상대 로직 구현<br>
      사용자 이동 후 AI 응수 처리<br>
      점수·승패 판정과 게임 통계 조회<br><br>
      <b>[ 궤적 처리 ]</b><br>
      사용자 나이트별 이동 궤적 분리<br>
      나이트 궤적의 별자리 변환·재생성 로직 구현<br>
      동일 게임의 각인 중복 생성 방지<br><br>
      <b>[ AI 각인 생성 ]</b><br>
      플레이 성향 AI 분석 연동<br>
      각인 이름·키워드·코멘트 생성
    </td>
    <td>
      <b>[ 공통 UI ]</b><br>
      폰 목업 프레임 구현<br>
      상단 내비게이션 및 하단 탭바 구현<br>
      공통 로딩 화면 구현<br><br>
      <b>[ 각인 탭 ]</b><br>
      각인 생성·이름 설정 화면 구현<br>
      Before/After 별자리 렌더링<br>
      생성된 각인 카드 획득 흐름 구현<br>
      보유 각인 목록 및 상세 화면 구현<br>
      각인 이름 수정·재생성 흐름 구현<br>
      각인 API 연동 및 상태별 UI 처리<br><br>
      <b>[ 마이페이지 탭 및 카드 ]</b><br>
      마이페이지 메인·최근 카드 구현<br>
      카드 모음 및 신청 내역 조회 구현<br>
      카드 공유 및 완료 안내 UI 구현<br>
      제품 각인 신청 취소 흐름 구현<br>
      마이페이지 API 연동 및 상태별 UI 처리<br><br>
      <b>[ 배포 ]</b><br>
      Vercel 환경 구성 및 배포
    </td>
    <td>
      <b>[ 게임 탭 ]</b><br>
      홈·게임 배너 및 이미지 슬라이드 구현<br>
      게임 시작 및 이어하기 화면 구현<br>
      체스판과 이동 가능 칸 렌더링<br>
      게임 진행·점수·턴 화면 구현<br>
      게임 재진입·새로고침 상태 복원<br>
      게임 결과와 각인 생성 흐름 연동<br>
      게임 API 연동 및 오류 보완<br><br>
      <b>[ 제품 탭 ]</b><br>
      제품 목록 및 옵션 상세 화면 구현<br>
      제품 옵션별 이미지 매핑<br>
      제품 모달·팝업 인터랙션 구현<br>
      제품 조회 API 연동 및 오류 보완<br><br>
      <b>[ 각인 신청 ]</b><br>
      보유 각인 선택과 제품 미리보기 구현<br>
      각인 색상 선택 및 신청 흐름 구현<br>
      각인 신청 API 연동 및 오류 보완
    </td>
  </tr>
</table>

---

## 🧰 기술 스택
<table>
  <tr>
    <th align="center">PM/Design</th>
    <th align="center">Frontend</th>
    <th align="center">Backend</th>
    <th align="center">Collaboration</th>
  </tr>
  <tr>
    <td valign="top">
      <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Manyfast-6D5AE0?style=for-the-badge&logoColor=white&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADdUlEQVR42u2bv2tTURTHv+fe915+NEkFsVVqhSpYFMRJOzi4KS4uHZzEybGDbu7i5qaT/4CLIIKTiz9BioOlQ+lgCy1FS8HGNk2TvNx7HF5ShTbvZ/oSmnvhDYF3k3s+79xzvufcF3p8d4kxwENgwIcBYAAYAAaAAWAAGAAGgAEwqMNKMpko/L0cteIggA7ru7sFoOmG/2UhKRIw3eTQhkmL0gcgBFAcsUM/pWpFwa1zKAjMQL4k4WSCdygD2Ck3oXVKAIi8J186YeP+kzFYtr9FWnuwXj/fwNznbeQLwnexQhKqWwq37h3H5etFaMUQkny98MWjNWxuuLBsirwd4m8BAmyHAt2P2YNGEcOttMgzSAIkyD8Oxd8BybJAGNpxA1R7XtB8TtjOMTrAADAADID+HCn1qq3U7NHRpDNJQCuGVhygM7h3HsDaEzq+V8uAU2cdNHYZJAhCwPcCgOq2hpAEyxEQkjpeTkZEAts1DyAC7EzwL4uWiLlyo4SVxRoWZndCiaCvb8tgzcgVZVt3HTiUYtRrOrLQ2rMjzskQM+BkCBOXchCd8BPAmnFyIoOpm8N7sFYXa6hsqf1PrbWKRo3x5U0Z6ysNKMWhYkEmH98LrLhPv1FnzH+q+K6PCPj2bhurizXceTgKEoTxyWwIDwBePl1HYVhCqwCpyxy7EEq8BXKFYL/LFwkLsztY+1HH+PksVLNzXdAunCzHK521SmbcoWeBMIsTYICAyh/lgfsv0HUqsznF49p0dAAjUaQ2StAAMAAGCwBzsi5PX9YCRP/ksZ+0hgAKw9ILnIK8LNKFbNRTAKy95qUISIFopcCxcxlcnBrC9/cVODn/RicBcHIpK8Go7mxnCB9elaGanoQ+SNwzA4WSxPhkFiQJ0zOjOH0+i1/Lda8p2gGCZsby/C4aIVvuXakF4rh/02W4jeBFXrg6hOmZETjZ8OHp2YNV/F5Puy0e0Qssm2A7/taTIMx9rODMZBbXbh/zto30n6Nc7t3RWFQIQQsVYDhZws+lhvdZkn/MAKAT5rG+S4PMiF3bGyFkABgABoABcJQAhFF2SRstVj8a3q4d2j1Cv9F0OdEpEvXbHybatUO+IMPdj5RfkUnD7d06Y7Pqhp7Tk5ekDhtC0LtH+xooRwlAUqNMGjQADAADwAAwAAwAA8AAMAAMgMDxF2qnQR7QmEuuAAAAAElFTkSuQmCC" /><br />
    </td>
    <td valign="top">
      <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /><br />
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" /><br />
    </td>
    <td valign="top">
      <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" /><br />
    </td>
    <td valign="top">
      <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" /><br />
    </td>
  </tr>
</table>
---

## 🤖 AI 활용 방식

- 게임 정보와 나이트 이동 경로를 바탕으로 플레이 성향 분석
- AI가 추천한 각인 이름·키워드·코멘트를 화면에 표시
- 서버에서 생성한 별자리 좌표(`points`/`connections`)를 SVG로 렌더링
- Before(원본 이동 궤적)와 After(재구성된 별자리 디자인) 시각화

---

## ✨ 주요 기능

**🎮 게임**

- 게임 소개·규칙 안내 및 배너 슬라이드
- EASY/HARD 난이도 선택 및 게임 시작
- `localStorage` 기반 진행 중인 게임 이어하기
- 체스판에서 기물 선택 및 합법 이동 표시
- 사용자 이동 확정 및 AI 응수 반영
- 실시간 포인트·턴·게임 상태 갱신
- 승리/패배 결과 및 나이트 이동 궤적 확인

**🃏 각인**

- 게임 종료 후 Before/After 별자리 디자인 미리보기
- 최종 별자리 디자인 다시 생성하기
- AI 추천 각인 이름 사용 또는 직접 이름 입력
- 보유 각인 목록·상세 조회 및 페이지네이션
- 저장된 각인 이름 수정
- 별자리 카드 획득 및 저장

**🛍️ 제품 및 각인 신청**

- 카테고리별 제품 슬라이드 조회
- 제품 옵션(색상·용량)별 이미지와 가격 전환
- 제품 상세에서 보유 각인 선택 및 페이지네이션
- 각인 색상(금색·은색·검정) 선택 및 확대 미리보기
- 선택한 제품·각인·색상을 조합한 제품 각인 신청
- 미선택 항목에 따른 상황별 오류 안내

**👤 마이페이지**

- 사용자 정보 및 최근 생성 카드 미리보기
- 저장된 카드 전체 보기(원형 휠 UI·드래그 인터랙션)
- 카드 상세 조회 및 이미지 저장
- 신청한 제품 각인 내역 조회 및 페이지네이션
- 제품 옵션·각인 색상·제품 코드 확인
- 제품 각인 신청 취소 및 완료 안내

---

## 🧭 서비스 흐름

1. 난이도 선택 및 게임 시작
2. 사용자 이동과 AI 응수
3. 게임 결과 및 나이트 이동 궤적 저장
4. 이동 궤적을 별자리 디자인으로 재구성
5. AI 플레이 분석 및 이름·키워드·코멘트 추천
6. 최종 별자리 디자인과 각인 이름 결정
7. 제품·옵션 및 각인 색상 선택
8. 제품 각인 신청
9. 마이페이지에서 신청 내역과 보유 카드 확인

---

## 📁 프로젝트 구조

```text
src
├── api            # axios 인스턴스 및 도메인별 API 함수 (game.js 등)
├── assets         # 이미지·SVG (기물, 제품, 배너 등)
├── components     # 재사용 컴포넌트 (별자리 렌더링, 카드, 로딩화면, 탭바 등)
├── data           # mock 데이터 및 좌표 변환 로직
├── pages          # 화면 단위 페이지
├── styles         # 페이지별 CSS
├── App.jsx
└── main.jsx
```

---

## 🚀 로컬 실행 방법

**1. 저장소 복제**

```bash
git clone https://github.com/night-challenge/night-frontend.git
cd night-frontend
```

**2. 환경변수 설정 (`.env`)**

| 환경변수 | 설명 | 예시 값 |
|:---|:---|:---|
| `VITE_API_BASE_URL` | 백엔드 API 서버 주소 | `https://night-backend-production.up.railway.app` |

**3. 설치 및 실행**

```bash
npm install
npm run dev
```

---

## ✅ 테스트

현재 별도의 자동화 테스트는 구성되어 있지 않습니다.

---

## 🔌 API 연동 방식

- **공통 API 주소**: `src/api/index.js`와 `src/main.jsx`에서 `VITE_API_BASE_URL` 사용
- **Axios** 기반 통신, 게임 API 인스턴스의 응답 인터셉터에서 공통 에러 메시지 처리
- **공통 응답 구조**:

```json
{
  "status": "success",
  "message": null,
  "data": {}
}
```
  - `status`: 성공 시 `success`, 실패 시 `error`
  - `message`: 상태 변경/실패 시 안내 문구, 그 외 `null`
  - `data`: 실제 응답 데이터, 없으면 `null`

- **API 명세서**: [나이트의 길 API 명세서](https://like-atlasaurus-184.notion.site/API-2ca098617aed820fb4528171236cb76f?source=copy_link)
- **Mock 데이터**: 용도별로 두 가지 존재
  - `src/data/mockData.js`의 `USE_MOCK` — 제품·각인·마이페이지 화면에서 사용, 현재 `false`로 실제 API 호출 중
  - `src/mockApi.js` — 게임 화면 전용 개발용 Mock, `import.meta.env.DEV && VITE_USE_MOCK === 'true'`일 때만 로컬 개발 환경에서 동작 (배포 환경은 `DEV`가 `false`라 자동 비활성화)
  - **현재 배포된 서비스는 두 Mock 모두 비활성 상태로, 전체 화면이 실제 Railway API를 사용합니다.**

---

## ☁️ 배포 및 환경 설정

- **Frontend** — [Vercel](https://night-frontend-rho.vercel.app/)
- **Backend** — [Railway](https://night-backend-production.up.railway.app)
- Vercel 환경변수: `VITE_API_BASE_URL`
- SPA 새로고침 시 404 방지를 위한 `vercel.json` rewrite 설정 적용
- `main` 브랜치 push 시 Vercel 자동 배포 (Vercel-GitHub 연동)

---

## 🔒 보안

- `.env` 파일은 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다.
- `VITE_API_BASE_URL`은 민감 정보는 아니지만, 로컬 환경변수로 관리합니다.

---

## 📚 관련 링크

- [서비스 바로가기](https://night-frontend-rho.vercel.app/)
- [나이트의 길 API 명세서](https://like-atlasaurus-184.notion.site/API-2ca098617aed820fb4528171236cb76f?source=copy_link)
- [Backend Repository](https://github.com/night-challenge/night-backend)
