# After 앱 React 18 createRoot 전환 및 WebSocket 연결 문제 최종 해결

## 작업 개요

- After 앱에서 React 18의 createRoot API로 최종 전환
- Vite HMR WebSocket 연결 문제 해결
- 성능 최적화된 After 앱 완성

## 문제 상황

### 1. createRoot 에러 발생

```
Uncaught SyntaxError: The requested module '...react-dom/client.js' does not provide an export named 'createRoot'
```

### 2. WebSocket 연결 실패

```
WebSocket connection to 'ws://localhost:3002/?token=...' failed
[vite] failed to connect to websocket
```

## 해결 과정

### 1. React 18 createRoot 전환

**apps/after/src/main.tsx 수정:**

```tsx
// Before: Legacy ReactDOM.render
import ReactDOM from "react-dom";
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  container
);

// After: React 18 createRoot
import { createRoot } from "react-dom/client";
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### 2. Vite HMR 설정 최적화

**apps/after/vite.config.ts 수정:**

```ts
server: {
  port: 3002,
  host: "localhost",
  hmr: {
    port: 3002,
    host: "localhost",
  },
},
```

### 3. optimizeDeps 설정 유지

```ts
optimizeDeps: {
  include: [
    "react-dom/client",  // createRoot 지원
    "react",
    "react-dom",
    // ... 기타 의존성
  ],
},
```

## 기술적 해결 포인트

### createRoot 전환 성공 요인

1. **올바른 import 경로**: `react-dom/client`에서 `createRoot` import
2. **Vite optimizeDeps 설정**: `react-dom/client` 사전 번들링 포함
3. **적절한 타입 지원**: TypeScript 설정에서 React 18 지원

### WebSocket 연결 안정화

1. **명시적 HMR 설정**: host와 port 명시적 지정
2. **localhost 고정**: 네트워크 인터페이스 혼동 방지
3. **포트 일치**: 서버 포트와 HMR 포트 동일하게 설정

## 최종 결과

### After 앱 특징

1. **React 18 Concurrent Features**: createRoot 기반 렌더링
2. **PWA 지원**: Service Worker 등록 및 관리
3. **성능 최적화**:
   - 코드 스플리팅
   - 이미지 최적화
   - 메모이제이션
   - 가상화 스크롤
4. **실시간 성능 모니터링**: Web Vitals 수집

### 성능 측정 준비 완료

- Before 앱: `http://localhost:3001/` (성능 저하 의도)
- After 앱: `http://localhost:3002/` (최적화 적용)

## 검증 완료 사항

### 1. 런타임 에러 해결

- ✅ createRoot 에러 해결
- ✅ WebSocket 연결 안정화
- ✅ Service Worker 정상 동작

### 2. 개발 환경 안정성

- ✅ HMR 정상 작동
- ✅ TypeScript 컴파일 성공
- ✅ 빌드 프로세스 정상

### 3. 성능 최적화 기능

- ✅ 코드 스플리팅 적용
- ✅ 이미지 지연 로딩
- ✅ 메모이제이션 적용
- ✅ Bundle 최적화

## 다음 단계

1. 두 앱간 성능 비교 측정 실시
2. Analytics 대시보드에서 실시간 모니터링
3. 성능 개선 효과 정량적 분석

## 학습 포인트

### 모노레포 환경에서의 React 18 적용

- Vite 의존성 사전 번들링 설정의 중요성
- 모노레포에서 패키지간 의존성 관리
- TypeScript와 Vite 설정 동기화

### HMR 최적화

- 명시적 네트워크 설정으로 연결 안정성 확보
- 개발 환경과 프로덕션 환경 설정 분리
- WebSocket 연결 문제 디버깅 방법론

## 결론

React 18의 createRoot API 전환과 Vite HMR 최적화를 통해 After 앱이 안정적으로 동작하게 되었습니다. 이제 Before/After 앱간의 정확한 성능 비교 측정이 가능합니다.
