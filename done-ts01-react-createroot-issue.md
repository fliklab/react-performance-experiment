# React 18 createRoot 이슈 완전 해결 (TS01)

## 문제 상황

### 발생한 오류

```
Uncaught SyntaxError: The requested module '/@fs/Users/flik/dev/performance-measurement-monorepo/node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js?v=d011e313' does not provide an export named 'createRoot' (at main.tsx:2:10)
```

### 환경

- **pnpm 모노레포** 환경
- **Vite 5.4.19** + React 18.3.1
- **Before 앱**에서 React 18의 새로운 `createRoot` API 사용 시도

### 증상

- Node.js에서는 `createRoot` 정상 확인: `typeof require('react-dom/client').createRoot` → `function`
- 브라우저에서만 ES module import 시 `createRoot` export를 찾을 수 없음
- Vite의 dependency pre-bundling 과정에서 문제 발생

## 시도했던 해결 방법들

### 1. ReactDOM.render로 임시 변경 ✅ (부분적 성공)

```tsx
// 임시 해결책
import ReactDOM from "react-dom";
ReactDOM.render(<App />, container);
```

- **결과**: 앱은 실행되지만 React 18 기능 활용 불가
- **한계**: Concurrent Features, Suspense 등 최신 기능 사용 제한

### 2. 패키지 재설치 시도 ❌ (실패)

```bash
pnpm add react@18.3.1 react-dom@18.3.1 --save-exact
rm -rf node_modules && pnpm install
```

- **결과**: 버전은 정확하지만 여전히 같은 오류

### 3. pnpm 호이스팅 설정 변경 시도 ❌ (실패)

```
# .pnpmrc
public-hoist-pattern[]=!react-dom
public-hoist-pattern[]=!react
```

- **결과**: 효과 없음

## 최종 해결 방법 ✅

### 1. Vite optimizeDeps 설정 수정

**파일**: `apps/before/vite.config.ts`

**변경 전** (문제 있는 설정):

```typescript
optimizeDeps: {
  // 사전 번들링 비활성화 (Vite 5.1+ 방식)
  noDiscovery: true,
  include: [],
},
```

**변경 후** (해결된 설정):

```typescript
optimizeDeps: {
  // React DOM은 포함시켜야 함 (createRoot 때문에)
  include: ["react-dom/client", "react", "react-dom"],
  // 다른 라이브러리들은 사전 번들링 제외
  exclude: ["lodash", "moment"],
},
```

### 2. .pnpmrc 파일 삭제

- 불필요한 호이스팅 제한 설정 제거
- pnpm의 기본 동작으로 복구

### 3. Vite 캐시 삭제 및 재시작

```bash
rm -rf node_modules/.vite
pnpm dev
```

## 원인 분석

### 핵심 원인: Vite optimizeDeps 설정 문제

1. **`noDiscovery: true`**: Vite가 자동으로 사전 번들링할 의존성을 찾지 않음
2. **`include: []`**: React DOM이 사전 번들링에서 완전히 제외됨
3. **ESM 변환 실패**: `react-dom/client`가 제대로 ES module로 변환되지 않음

### pnpm 모노레포에서의 특수성

- 의존성 호이스팅으로 인한 복잡한 node_modules 구조
- Vite의 dependency pre-bundling과 충돌
- ES modules 변환 과정에서 export 정보 손실

## 학습 내용

### Vite optimizeDeps의 중요성

```typescript
// ✅ 올바른 설정
optimizeDeps: {
  include: [
    "react-dom/client",  // createRoot를 위해 필수
    "react",
    "react-dom"
  ],
  exclude: ["heavy-libs"]  // 성능상 제외할 라이브러리만
}

// ❌ 잘못된 설정
optimizeDeps: {
  noDiscovery: true,  // 너무 제한적
  include: []         // React 관련 패키지까지 제외
}
```

### React 18 migration 고려사항

- `createRoot`는 React 18의 핵심 API
- Concurrent Features 활용을 위해 필수
- Legacy `ReactDOM.render`는 점진적 폐기 예정

### pnpm + Vite 환경에서의 베스트 프랙티스

1. **React 관련 패키지는 항상 optimizeDeps.include에 포함**
2. **성능 최적화는 다른 라이브러리로 진행**
3. **Vite 캐시 문제 시 `node_modules/.vite` 삭제**

## 검증 결과

### ✅ 완전 해결 확인

- **Before 앱**: `http://localhost:3003/` 정상 실행
- **createRoot API**: 정상 작동
- **React 18 기능**: 모든 기능 활용 가능
- **성능**: 의도된 저성능 동작 정상 확인

### 향후 적용 가능한 기능들

- Concurrent Features
- Suspense boundaries
- useTransition
- useDeferredValue
- 기타 React 18 신기능

## 커밋 메시지

```
fix: Resolve React 18 createRoot import issue in Vite + pnpm monorepo

- Update vite.config.ts optimizeDeps to include react-dom/client
- Remove .pnpmrc restrictions causing module resolution issues
- Enable full React 18 features including createRoot API
- Clear Vite cache to ensure clean dependency pre-bundling

Fixes: ESM import error for createRoot in browser environment
Tech: Vite 5.4.19 + React 18.3.1 + pnpm monorepo
```
