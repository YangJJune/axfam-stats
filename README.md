# AX FAM 스타크래프트 전적 통계 사이트

AX FAM 팀원들의 스타크래프트 경기 기록을 분석하고 통계를 제공하는 웹 애플리케이션입니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Styled Components** - CSS-in-JS 스타일링
- **React Router** - 클라이언트 사이드 라우팅
- **PapaParse** - CSV 데이터 파싱
- **Vite** - 빌드 도구

## 주요 기능

### 선수 목록 페이지
- 모든 선수들의 전적 요약 카드 형태로 표시
- 검색 기능으로 선수 빠르게 찾기
- 총 경기 수, 승, 패, 승률 표시
- 주 종족 표시
- 승률 시각화 바

### 선수 상세 페이지
선수를 클릭하면 상세한 통계를 확인할 수 있습니다:

1. **맵별 전적**
   - 각 맵에서의 경기 수, 승, 패, 승률
   - 경기 수가 많은 맵부터 정렬

2. **상대 전적**
   - 특정 선수와의 1:1 전적
   - 상대별 승률 확인
   - 가장 많이 대결한 선수부터 정렬

3. **대회별 전적**
   - 각 대회에서의 성적
   - 대회별 승률 분석
   - 참가 경기 수가 많은 대회부터 정렬

## 디자인

- **다크 테마** 기반의 모던한 게이밍 UI
- **DAK.GG** 스타일 참고한 그라데이션 강조색
  - 사이안(#57EFD6), 블루(#33C2FF), 퍼플(#C623FF)
- 종족별 색상 구분:
  - Terran: 빨강(#FF6B6B)
  - Protoss: 청록(#4ECDC4)
  - Zerg: 노랑(#FFE66D)
- 반응형 디자인 (모바일, 태블릿, 데스크톱 지원)

## 설치 및 실행

### 개발 환경 실행

```bash
npm install
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```
axfam-stats/
├── public/
│   └── data.csv              # CSV 데이터 파일
├── src/
│   ├── components/
│   │   └── Layout/           # 레이아웃 컴포넌트
│   ├── context/
│   │   └── DataContext.tsx   # 전역 데이터 상태 관리
│   ├── pages/
│   │   ├── PlayerList/       # 선수 목록 페이지
│   │   └── PlayerDetail/     # 선수 상세 페이지
│   ├── styles/
│   │   ├── GlobalStyles.ts   # 전역 스타일
│   │   └── theme.ts          # 테마 정의
│   ├── types/
│   │   └── index.ts          # TypeScript 타입 정의
│   ├── utils/
│   │   └── dataParser.ts     # CSV 파싱 및 통계 계산
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## 데이터 구조

CSV 파일 (`AX FAM.csv`)의 주요 컬럼:

- `No`: 경기 고유 ID
- `DATE`: 경기 날짜
- `NAME.COMP`: 대회 이름
- `MAP`: 맵 이름
- `ID.BATTLENET1`: 선수1 ID
- `RACE1`: 선수1 종족
- `Tier1`: 선수1 티어
- `R.L2`: 1이면 선수1 승리
- `R.R2`: 1이면 선수2 승리
- `ID.BATTLENET2`: 선수2 ID
- `RACE2`: 선수2 종족
- `Tier2`: 선수2 티어

## 통계 계산

각 선수별로 다음 통계를 자동으로 계산합니다:

- 총 경기 수
- 승/패 기록
- 승률
- 종족별 사용 횟수
- 맵별 전적 (각 맵에서의 승/패/승률)
- 상대 전적 (각 상대와의 승/패/승률)
- 대회별 전적 (각 대회에서의 승/패/승률)
