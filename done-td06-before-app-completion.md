# Before 앱 완료 및 React createRoot 이슈 완전 해결 (TD06)

## 완료된 작업

### 1. Before 앱 성공적 실행 확인

- ✅ 애플리케이션 정상 구동 (`http://localhost:3003`)
- ✅ **React 18 createRoot API 정상 작동** 🎉
- ✅ 의도적 성능 저하 요소들이 정상 작동:
  - 매초 리렌더링 및 무거운 계산
  - 실시간 마우스 트래킹
  - 스크롤 위치 모니터링
  - 그라데이션 애니메이션
- ✅ 성능 정보 패널 실시간 업데이트

### 2. **React 18 createRoot 이슈 완전 해결** 🔧

#### 최종 해결 방법

1. **Vite optimizeDeps 설정 수정** - `apps/before/vite.config.ts`

```typescript
optimizeDeps: {
  // React DOM은 포함시켜야 함 (createRoot 때문에)
  include: ["react-dom/client", "react", "react-dom"],
  // 다른 라이브러리들은 사전 번들링 제외
  exclude: ["lodash", "moment"],
},
```

2. **불필요한 .pnpmrc 파일 삭제**
3. **Vite 캐시 삭제**: `rm -rf node_modules/.vite`

#### 문제의 핵심 원인

- **Vite optimizeDeps에서 `noDiscovery: true`와 `include: []` 설정**으로 인해
- **React DOM이 사전 번들링에서 제외**되어
- **ESM 변환 과정에서 createRoot export 정보 손실**

#### 시도했던 다른 방법들

- ❌ ReactDOM.render legacy 방식 (임시 해결책)
- ❌ 패키지 재설치
- ❌ pnpm 호이스팅 설정 변경

### 3. 현재 상태

#### 정상 동작 기능

- ✅ **React 18 createRoot API 완전 작동**
- ✅ 기본 앱 렌더링
- ✅ React Router 네비게이션
- ✅ 성능 모니터링 정보 표시
- ✅ 의도적 성능 저하 요소들
- ✅ **React 18 Concurrent Features 사용 가능**

#### 경고사항 해결

- ✅ ~~ReactDOM.render is deprecated (React 18)~~ → createRoot 사용
- ⚠️ React Router future flag warnings (기능에 영향 없음)

### 4. 기술적 성과

#### React 18 생태계 완전 활용 가능

- ✅ createRoot API
- ✅ Concurrent Features
- ✅ Suspense boundaries
- ✅ useTransition, useDeferredValue
- ✅ 기타 React 18 신기능

#### Vite + pnpm 모노레포 환경 최적화

- ✅ dependency pre-bundling 최적화
- ✅ ES modules 변환 안정화
- ✅ 개발 환경 성능 향상

### 5. 다음 단계 준비

- ✅ Phase 3: After-Basic 앱 개발 준비 완료
- ✅ React 18 기반 최적화 기법 적용 가능
- ✅ 성능 비교 측정 기반 구축 완료

## 학습 내용

### Vite + pnpm 모노레포 환경의 복잡성

- **dependency pre-bundling**이 React 18 기능에 미치는 영향
- **optimizeDeps 설정**의 중요성
- ES modules 변환 과정에서의 주의사항

### React 18 마이그레이션 베스트 프랙티스

- `createRoot`는 단순한 API 변경이 아닌 **근본적인 아키텍처 변화**
- Concurrent Features 활용을 위한 필수 요구사항
- 빌드 도구와의 호환성 확인 필요

### 모노레포 환경에서의 트러블슈팅 접근법

1. **패키지 버전 확인** → Node.js 환경에서 정상 작동 확인
2. **빌드 도구 설정 검토** → Vite optimizeDeps가 핵심 원인
3. **캐시 및 의존성 재설정** → 근본적 해결

## 성능 측정 준비 완료

- ✅ Before 앱: 의도적 저성능 구현 완료
- ✅ React 18 기반: 최신 기능 활용 가능
- ⏭️ After 앱: 최적화 기법 적용 예정
- ⏭️ 성능 비교: 정확한 측정 기반 마련
