# Before 앱 완료 및 React createRoot 이슈 해결 (TD06)

## 완료된 작업

### 1. Before 앱 성공적 실행 확인

- ✅ 애플리케이션 정상 구동 (`http://localhost:3001`)
- ✅ 의도적 성능 저하 요소들이 정상 작동:
  - 매초 리렌더링 및 무거운 계산
  - 실시간 마우스 트래킹
  - 스크롤 위치 모니터링
  - 그라데이션 애니메이션
- ✅ 성능 정보 패널 실시간 업데이트

### 2. 주요 트러블슈팅: React 18 createRoot 이슈

#### 문제점

```
Uncaught SyntaxError: The requested module '/@fs/Users/flik/dev/performance-measurement-monorepo/node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js?v=ab2cbaf1' does not provide an export named 'createRoot' (at main.tsx:2:10)
```

#### 원인 분석

- React DOM 버전 불일치 (19.0.0 vs 18.3.1)
- pnpm 모노레포 환경에서의 의존성 호이스팅 이슈
- Vite의 dependency pre-bundling과 관련된 캐시 문제

#### 해결 과정

1. **패키지 버전 확인**: `node -p "require('react-dom/package.json').version"` → 19.0.0 발견
2. **정확한 버전 재설치**: `pnpm install react@18.3.1 react-dom@18.3.1 --save-exact`
3. **Legacy 방식으로 임시 변경**: `createRoot` → `ReactDOM.render`

#### 최종 해결책

```tsx
// Before (React 18 새로운 방식)
import { createRoot } from "react-dom/client";
const root = createRoot(container);
root.render(<App />);

// After (Legacy 방식으로 변경)
import ReactDOM from "react-dom";
ReactDOM.render(<App />, container);
```

### 3. 현재 상태

#### 정상 동작 기능

- ✅ 기본 앱 렌더링
- ✅ React Router 네비게이션
- ✅ 성능 모니터링 정보 표시
- ✅ 의도적 성능 저하 요소들

#### 남은 경고사항 (기능에 영향 없음)

- ⚠️ ReactDOM.render is deprecated (React 18)
- ⚠️ React Router future flag warnings

### 4. 다음 단계 준비

- Phase 3: After-Basic 앱 개발 준비 완료
- 기본 최적화 기법 적용 예정

## 학습 내용

### pnpm 모노레포 환경에서의 의존성 관리

- 모노레포에서는 의존성 버전 일관성이 매우 중요
- `--save-exact` 플래그를 사용하여 정확한 버전 고정 필요
- workspace 레벨과 패키지 레벨의 의존성 충돌 주의

### React 18 마이그레이션 고려사항

- `createRoot` API는 React 18+에서만 사용 가능
- Legacy 방식도 여전히 지원되지만 향후 제거 예정
- Concurrent Features 사용 시 새로운 API 필수

### Vite 개발 환경 특성

- HMR (Hot Module Replacement) 활용
- dependency pre-bundling으로 인한 캐시 이슈 가능
- ES modules 기반 빠른 빌드

## 성능 측정 결과 (예상)

- 의도적으로 낮은 성능을 위해 구현된 요소들이 정상 작동
- 다음 단계에서 최적화를 통한 성능 개선 효과 측정 예정
