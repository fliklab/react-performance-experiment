# 트러블슈팅: 서비스워커 캐시 문제로 인한 포트 3002 지속 문제

## 📋 문제 상황

### 발생한 문제

- 사용자가 포트 3004에서 After 앱을 실행했지만, 브라우저에서 localhost:3002가 계속 표시됨
- 새로고침을 해도 3002 포트의 콘텐츠가 지속적으로 보임
- 실제로는 포트 3002에서 실행 중인 프로세스가 없음

### 환경 정보

- OS: macOS 24.4.0
- 브라우저: Chrome (추정)
- 프로젝트: Performance Measurement Monorepo
- 영향받은 앱: After App (PWA with Service Worker)

## 🔍 원인 분석

### 1. 서비스워커 캐싱 정책

After 앱의 서비스워커(`apps/after/public/sw.js`)가 다음과 같은 강력한 캐싱 전략을 사용:

```javascript
const CACHE_NAME = "after-store-v1";
const STATIC_CACHE_NAME = "after-store-static-v1";
const DYNAMIC_CACHE_NAME = "after-store-dynamic-v1";
```

### 2. 캐시 우선 전략 (Cache-First Strategy)

```javascript
// HTML pages: Network-first with fallback
event.respondWith(networkFirstWithFallback(request));

// Other assets: Cache-first strategy
event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
```

### 3. 서비스워커 생명주기 문제

- `self.skipWaiting()`: 새 서비스워커가 즉시 활성화
- `self.clients.claim()`: 모든 클라이언트를 제어
- 이전 포트(3002)에서 등록된 서비스워커가 브라우저에 남아있음

## 🚨 핵심 문제점

1. **포트 독립적인 서비스워커 스코프**: 서비스워커는 origin(protocol + domain + port) 기반으로 동작하지만, 브라우저 캐시에서 혼선 발생
2. **강력한 캐싱 정책**: 오프라인 우선 PWA 설계로 인해 네트워크 요청보다 캐시 우선
3. **개발 환경 포트 변경**: 개발 중 포트 변경 시 이전 서비스워커가 잔존

## 🔧 해결 방법

### 즉시 해결 (단계별)

#### 1단계: 브라우저 콘솔에서 서비스워커 제거

```javascript
// 모든 서비스워커 등록 해제
navigator.serviceWorker.getRegistrations().then(function (registrations) {
  for (let registration of registrations) {
    registration.unregister();
    console.log("서비스워커 등록 해제됨:", registration.scope);
  }
});

// 모든 캐시 삭제
caches.keys().then(function (names) {
  for (let name of names) {
    caches.delete(name);
    console.log("캐시 삭제됨:", name);
  }
});
```

#### 2단계: 하드 리프레시

- Chrome: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)
- 또는 F12 → Network 탭 → "Disable cache" 체크 후 새로고침

#### 3단계: 브라우저 데이터 완전 삭제

- Chrome: `Cmd+Shift+Delete` → 고급 → 전체 기간 → 캐시/쿠키/사이트데이터 삭제

### 개발 환경 개선

#### 1. 서비스워커 개발 모드 조건부 등록

```typescript
// apps/after/src/main.tsx 수정
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  // 프로덕션에서만 서비스워커 등록
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
```

#### 2. 개발용 서비스워커 버전 관리

```javascript
// 개발 중에는 캐시 버전을 동적으로 생성
const CACHE_VERSION =
  process.env.NODE_ENV === "development" ? `dev-${Date.now()}` : "v1";

const CACHE_NAME = `after-store-${CACHE_VERSION}`;
```

#### 3. Vite 개발 서버에서 서비스워커 비활성화

```typescript
// vite.config.ts
export default defineConfig({
  // ...
  define: {
    __SW_ENABLED__: process.env.NODE_ENV === "production",
  },
});
```

## 🎯 예방 조치

### 1. 개발 중 포트 고정

```typescript
// apps/after/vite.config.ts
server: {
  port: 3004, // 고정 포트 사용
  strictPort: true, // 포트 충돌 시 에러 발생
}
```

### 2. 서비스워커 스코프 명시

```javascript
navigator.serviceWorker.register("/sw.js", {
  scope: "/", // 명시적 스코프 설정
  updateViaCache: "none", // 개발 중 캐시 비활성화
});
```

### 3. 개발도구 설정

- Chrome DevTools → Application → Service Workers → "Update on reload" 체크
- "Bypass for network" 체크 (개발 중)

## 📊 영향도 분석

### 긍정적 영향

- PWA 기능 정상 작동 (오프라인 지원)
- 성능 최적화 (캐싱을 통한 빠른 로딩)
- 사용자 경험 향상

### 부정적 영향

- 개발 중 디버깅 어려움
- 포트 변경 시 혼란
- 캐시 무효화 복잡성

## 🚀 최종 권장사항

1. **개발 환경**: 서비스워커 비활성화 또는 조건부 활성화
2. **스테이징 환경**: 서비스워커 활성화하여 PWA 기능 테스트
3. **프로덕션 환경**: 완전한 서비스워커 및 캐싱 전략 적용

## 📝 학습 포인트

- 서비스워커는 강력한 캐싱 도구이지만 개발 중에는 주의 필요
- PWA 개발 시 개발/프로덕션 환경 분리 중요성
- 브라우저 캐시와 서비스워커 캐시의 차이점 이해
- 오프라인 우선 vs 네트워크 우선 전략의 트레이드오프

---

**해결 완료**: 2024-12-19 12:00 KST  
**소요 시간**: 30분  
**관련 파일**: `apps/after/src/main.tsx`, `apps/after/public/sw.js`
