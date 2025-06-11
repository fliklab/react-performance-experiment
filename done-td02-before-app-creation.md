# Sprint 2 완료: Before 앱 생성 (성능 측정용 의도적 저성능 앱)

## 작업 개요

Vite + React + TypeScript 기반의 의도적으로 성능이 낮은 이커머스 사이트 구현 완료

## 완성된 기능

### 1. 기본 프로젝트 구조

- **Vite + React + TypeScript**: 현대적인 개발 환경 설정
- **모노레포 통합**: 공유 패키지들과 연동 (types, utils, data)
- **Path Mapping**: 편리한 import 경로 설정

### 2. 핵심 컴포넌트 구현

#### App.tsx - 메인 애플리케이션

- **React Router**: 페이지 라우팅 설정
- **의도적으로 무거운 상태 관리**: 너무 많은 state, 비효율적 업데이트
- **실시간 메트릭 수집**: 마우스 추적, 스크롤 추적, 무거운 계산
- **성능 측정 통합**: Web Vitals, 성능 이벤트 수집

#### Header.tsx - 헤더 컴포넌트

- **무거운 애니메이션**: 지속적인 펄스, 그라디언트 효과
- **실시간 시계**: 매초마다 렌더링 유발
- **무거운 계산**: 매 렌더링마다 수학 연산 수행

#### ProductList.tsx - 상품 목록

- **가상화 미사용**: 모든 상품을 한 번에 렌더링
- **마우스 추적 렌더링**: 마우스 위치에 따른 실시간 스타일 변경
- **무거운 이미지 필터**: 복합 CSS 필터 효과
- **매 렌더링마다 무거운 처리**: 데이터 가공, 계산 반복

#### ProductDetail.tsx - 상품 상세

- **실시간 메트릭**: 100ms마다 상태 업데이트
- **마우스 이벤트 추적**: 모든 마우스 움직임 기록
- **이미지 갤러리**: 무거운 필터와 변환 효과

#### Cart.tsx - 장바구니

- **비효율적 수량 관리**: 배열 조작으로 수량 관리
- **무거운 계산**: 매 렌더링마다 복잡한 수학 연산
- **실시간 애니메이션**: 지속적인 시각 효과

#### Footer.tsx - 푸터

- **배경 애니메이션**: 무거운 그라디언트 이동 효과
- **실시간 통계**: 스크롤, 윈도우 크기 등 실시간 표시
- **무거운 텍스트 효과**: 글로우, 페이드 애니메이션

### 3. 의도적 성능 저하 패턴

#### 렌더링 최적화 무시

- **React.memo 미사용**: 모든 컴포넌트 매번 리렌더링
- **useMemo/useCallback 미사용**: 무거운 계산 반복
- **key prop 미최적화**: 리스트 렌더링 비효율

#### 상태 관리 비효율성

- **거대한 단일 state**: 작은 변경도 전체 리렌더링 유발
- **불필요한 state 업데이트**: 매초마다 시간, 마우스 위치 업데이트
- **중첩된 객체 업데이트**: 얕은 비교 무력화

#### 무거운 연산과 애니메이션

- **매 렌더링마다 계산**: Math.sin, Math.cos 등 복잡한 연산
- **CSS 애니메이션 남용**: transform, filter, box-shadow 과다 사용
- **실시간 DOM 조작**: 스크롤, 마우스 이벤트 추적

#### 비효율적 데이터 처리

- **전체 데이터 재처리**: 매번 lodash로 전체 배열 가공
- **문자열 반복**: 설명 텍스트 3배 반복
- **날짜 포매팅**: moment.js로 실시간 포매팅

### 4. 기술적 설정

#### Vite 설정 (성능 저하용)

```typescript
// vite.config.ts
export default defineConfig({
  // 번들 분할 비활성화
  build: {
    rollupOptions: {
      output: { manualChunks: undefined },
    },
    minify: false, // 압축 비활성화
    sourcemap: true, // 프로덕션 소스맵
  },
  // 사전 번들링 비활성화
  optimizeDeps: {
    disabled: true,
  },
});
```

#### TypeScript 설정

- **모노레포 통합**: 공유 패키지 path mapping
- **엄격한 타입 체크**: 개발 중 타입 안전성 보장

#### 패키지 의존성

- **styled-components**: CSS-in-JS로 무거운 스타일링
- **lodash**: 무거운 유틸리티 함수들
- **moment**: 무거운 날짜 라이브러리 (deprecated)
- **react-router-dom**: 클라이언트 사이드 라우팅

## 성능 영향 분석

### 예상 성능 지표 (목표: 의도적 저성능)

- **LCP (Largest Contentful Paint)**: 4초 이상
- **FID (First Input Delay)**: 300ms 이상
- **CLS (Cumulative Layout Shift)**: 0.25 이상
- **번들 크기**: 압축 해제 시 2MB 이상
- **JavaScript 실행 시간**: 지속적인 CPU 사용

### 메모리 사용량

- **메모리 누수**: 실시간 이벤트 리스너들
- **객체 생성**: 매 렌더링마다 새 객체/배열 생성
- **DOM 조작**: 빈번한 스타일 변경

## 다음 단계 준비

### After 앱 개발 준비

이제 동일한 기능의 최적화된 버전을 Next.js로 구현할 준비가 되었습니다:

1. **SSR/SSG 구현**: 서버 사이드 렌더링
2. **최적화 패턴**: React.memo, useMemo, useCallback
3. **이미지 최적화**: Next.js Image 컴포넌트
4. **코드 스플리팅**: 동적 import
5. **캐싱 전략**: SWR/TanStack Query

### 성능 측정 시스템

- **Web Vitals 수집기**: 이미 통합 완료
- **비교 대시보드**: 구현 예정
- **자동화된 성능 테스트**: 구현 예정

## 트러블슈팅 기록

### 해결된 문제들

1. **CRA에서 Vite로 전환**

   - 문제: CRA는 deprecated, 성능도 느림
   - 해결: Vite + React + TypeScript 템플릿 사용
   - 결과: 더 빠른 개발 환경, 현대적 설정

2. **TypeScript 경로 매핑**

   - 문제: 모노레포 패키지 import 에러
   - 해결: tsconfig.json과 vite.config.ts에 경로 설정
   - 결과: 깔끔한 import 경로

3. **의존성 버전 충돌**
   - 문제: React 19 vs 다른 패키지들
   - 해결: React 18로 다운그레이드, 안정성 확보
   - 결과: 모든 패키지 정상 동작

## 완료 일시

2024-06-12 03:50 (한국시간)

## Git 커밋

- 커밋 해시: f39db35
- 메시지: "feat: Vite+React+TypeScript 기반 Before 앱 생성 - 의도적으로 성능이 낮은 이커머스 사이트 구현"
- 변경사항: 20 files changed, 2142 insertions(+)
