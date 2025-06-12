# react-performance-experiment

모노레포 기반 React 앱의 성능 측정/비교

## 🎯 프로젝트 동기 및 소개

현업에서 Performance 개선에 대해 "몇 퍼센트 개선했다"라고 이야기하지만, 실제로는 여러 가지 변수가 작용합니다. 그리고 회사에서 진행한 프로젝트의 보안 특성상 모든 내용을 공개하기 어려운 경우도 있습니다. 이미 성능이 개선된 상태에서는 어느 정도의 영향력이 있는지 체감이 어렵습니다.

그래서 **가상의 앱을 만들고 몇 가지 성능 최적화로 인해 어떤 효과가 있는지 좀 더 명확하게 파악**하고자 했습니다. 실험을 위해서 Monorepo를 Setup했고, Before/After 버전의 동일한 기능을 가진 앱을 개발했습니다. **Real-time Performance Metrics 자동 측정 도구**를 구축하여 최적화 효과를 정량적으로 검증할 수 있도록 했습니다.

## 📊 성능 측정 항목

### ✅ **실제 측정된 Bundle Size**

- Total JS (gzip) (KB)
- 최대 Chunk 사이즈(KB)
- Chunk 수(개)
- Core Web Vitals: FCP, LCP, FID, CLS

## 🏗️ 아키텍처 및 기술 스택

### 📦 Monorepo 구조

```
performance-measurement-monorepo/
├── apps/
│   ├── before/          # 성능 최적화 미적용 앱 (포트: 3001)
│   └── after/           # 성능 최적화 적용 앱 (포트: 3002)
├── packages/
│   ├── config/          # 공통 설정 (ESLint, Prettier, TypeScript, Tailwind)
│   ├── types/           # 공통 TypeScript 타입 정의
│   ├── ui/              # 재사용 가능한 UI Component Library
│   ├── utils/           # 공통 Utility 함수
│   └── data/            # Mock Data 및 API Mocking
├── performance-reports/ # 자동 생성된 Performance 비교 Report
└── scripts/            # Build 및 분석 Script
```

### 🛠️ 사용 기술

#### 🔧 개발 환경

- **Monorepo**: Turborepo + pnpm workspace
- **Build Tool**: Vite (After), Webpack (Before)
- **언어**: TypeScript (strict mode)
- **Code Quality**: ESLint + Prettier

#### ⚛️ Frontend Stack

- **Framework**: React 18 (createRoot, Concurrent Features)
- **State Management**: Context API + useReducer
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: React Query (After만)

#### 📊 Performance Measurement

- **Web Vitals**: Core Web Vitals Real-time 수집
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Performance Monitoring**: Custom Performance Dashboard
- **PWA**: Service Worker를 통한 Caching 최적화 (After만)

## 🎨 앱 구성 및 기능

### 📱 공통 기능

두 앱 모두 동일한 비즈니스 로직과 UI를 제공합니다:

- **홈 페이지**: 상품 목록 및 라이브 스트림 표시
- **상품 상세**: 상품 정보 및 관련 상품 추천
- **장바구니**: 상품 추가/제거, 수량 변경
- **라이브 스트림**: 실시간 댓글 기능이 있는 스트리밍
- **반응형 디자인**: 모바일 최적화

### 🔍 Before 앱 특징 (Performance 저하 의도)

- **큰 Bundle Size**: 모든 코드가 하나의 Bundle에 포함
- **동기적 로딩**: 모든 Component를 한 번에 Load
- **Optimization 없음**: React.memo, useMemo, useCallback 미사용
- **이미지 즉시 로딩**: 모든 이미지를 페이지 Load 시 Download
- **Caching 없음**: Service Worker 미사용

### ⚡ After 앱 특징 (성능 최적화 적용)

- **Code Splitting**: 12개 Chunk로 분할된 Bundle
- **Lazy Loading**: React.lazy()를 통한 Component 분할
- **Memoization**: React.memo, useMemo, useCallback 적극 활용
- **Image Optimization**: Intersection Observer 기반 Lazy Loading
- **PWA 기능**: Service Worker Caching 및 Offline 지원
- **React Query**: Data Caching 및 Background Sync

## 📈 성능 측정 도구

### 실시간 Performance Dashboard

- **플로팅 UI**: 우하단 고정, 토글 가능
- **Core Web Vitals**: FCP, LCP, FID, CLS, TTFB, INP 실시간 측정
- **성능 점수**: Google 기준 0-100점 자동 계산
- **개선 제안**: 실시간 최적화 가이드 제공
- **시각적 피드백**: 색상으로 성능 상태를 시각적으로 표시

### Performance Dashboard 접속 방법

개발 환경에서 다음과 같이 접속하여 확인

- Before 앱: http://localhost:3001/dashboard
- After 앱: http://localhost:3002/dashboard

### 자동 리포트 생성

```bash
# 성능 비교 리포트 생성
npm run performance:analyze

# 출력 파일:
# - performance-reports/performance-summary.json
# - performance-reports/performance-summary.md
```

### 📋 측정 가능한 지표

- **번들 크기 분석**: gzip 압축 후 실제 크기
- **청크 분할 효과**: 코드 스플리팅 최적화
- **로딩 성능**: FCP, LCP 등 로딩 지표
- **인터랙션 성능**: FID, INP 등 반응성 지표
- **레이아웃 안정성**: CLS 측정

## 🚀 시작하기

### Prerequisites

- Node.js 18 이상
- pnpm 8.15.0 이상

### ⚙️ 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (두 앱 동시 실행)
pnpm dev

# 개별 앱 실행
pnpm --filter before dev  # http://localhost:3001
pnpm --filter after dev   # http://localhost:3002

# 빌드
pnpm build

# 성능 분석 리포트 생성
node scripts/performance-comparison.js
```

### 성능 비교

1. **Before 앱 접속**: http://localhost:3001
2. **After 앱 접속**: http://localhost:3002
3. **브라우저 DevTools**: Network, Performance 탭에서 비교
4. **Performance Dashboard**: /dashboard에서 실시간 지표 확인
5. **리포트 확인**: `performance-reports/` 폴더의 자동 생성 리포트 확인

### 🛠️ 주요 Troubleshooting

- **React 18 createRoot Issue**: ES Module import 오류 → Vite optimizeDeps 설정 수정으로 해결
- **Service Worker Caching Issue**: 포트 변경 시 캐시 문제 → 개발환경 SW 조건부 활성화로 해결
- **Vite HMR WebSocket Issue**: 연결 불안정 → 명시적 host/port 설정으로 해결
- **Monorepo Type Sharing**: packages 간 타입 import 충돌 → 상대경로 alias 설정으로 해결

## 관련 자료

- **Core Web Vitals**: [Google Web Vitals](https://web.dev/vitals/)
- **React 성능 최적화**: [React Optimization Guide](https://react.dev/learn/render-and-commit)

## 라이선스

MIT License
