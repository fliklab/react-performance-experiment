export interface ObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export interface ObserverCallback {
  (entry: IntersectionObserverEntry, observer: IntersectionObserver): void;
}

export class IntersectionObserverManager {
  private static instance: IntersectionObserverManager;
  private observers: Map<string, IntersectionObserver> = new Map();
  private callbacks: Map<Element, ObserverCallback[]> = new Map();

  static getInstance(): IntersectionObserverManager {
    if (!IntersectionObserverManager.instance) {
      IntersectionObserverManager.instance = new IntersectionObserverManager();
    }
    return IntersectionObserverManager.instance;
  }

  // 요소 관찰 시작
  observe(
    element: Element,
    callback: ObserverCallback,
    options: ObserverOptions = {}
  ): () => void {
    const observerKey = this.getObserverKey(options);

    // 기존 Observer가 없으면 새로 생성
    if (!this.observers.has(observerKey)) {
      const observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          root: options.root,
          rootMargin: options.rootMargin || "0px",
          threshold: options.threshold || 0,
        }
      );
      this.observers.set(observerKey, observer);
    }

    const observer = this.observers.get(observerKey)!;

    // 콜백 등록
    if (!this.callbacks.has(element)) {
      this.callbacks.set(element, []);
    }
    this.callbacks.get(element)!.push(callback);

    // 요소 관찰 시작
    observer.observe(element);

    // 관찰 중단 함수 반환
    return () => this.unobserve(element, callback, observerKey);
  }

  // 요소 관찰 중단
  unobserve(
    element: Element,
    callback?: ObserverCallback,
    _observerKey?: string
  ): void {
    const callbacks = this.callbacks.get(element);

    if (callbacks) {
      if (callback) {
        // 특정 콜백만 제거
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      } else {
        // 모든 콜백 제거
        callbacks.length = 0;
      }

      // 콜백이 더 이상 없으면 요소 관찰 중단
      if (callbacks.length === 0) {
        this.callbacks.delete(element);

        // 모든 observer에서 요소 제거
        this.observers.forEach((observer) => {
          observer.unobserve(element);
        });
      }
    }
  }

  // 모든 관찰 중단
  disconnect(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.callbacks.clear();
  }

  // Private methods
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      const callbacks = this.callbacks.get(entry.target);
      if (callbacks) {
        callbacks.forEach((callback) => {
          callback(entry, entry.target as any);
        });
      }
    });
  }

  private getObserverKey(options: ObserverOptions): string {
    return `${options.root || "null"}-${options.rootMargin || "0px"}-${JSON.stringify(options.threshold || 0)}`;
  }
}

// 편의 함수들
export const observeElement = (
  element: Element,
  callback: ObserverCallback,
  options?: ObserverOptions
) => {
  return IntersectionObserverManager.getInstance().observe(
    element,
    callback,
    options
  );
};

export const unobserveElement = (
  element: Element,
  callback?: ObserverCallback
) => {
  IntersectionObserverManager.getInstance().unobserve(element, callback);
};

// 지연 로딩을 위한 특화된 함수들
export const observeForLazyLoading = (
  element: Element,
  onVisible: () => void,
  options: ObserverOptions = {}
): (() => void) => {
  return observeElement(
    element,
    (entry) => {
      if (entry.isIntersecting) {
        onVisible();
        if (options.once !== false) {
          unobserveElement(entry.target);
        }
      }
    },
    { threshold: 0.1, ...options, once: true }
  );
};

// 이미지 지연 로딩
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  options: ObserverOptions = {}
): (() => void) => {
  return observeForLazyLoading(
    img,
    () => {
      img.src = src;
      img.classList.add("loaded");
    },
    options
  );
};

// 컴포넌트 지연 로딩
export const lazyLoadComponent = (
  element: Element,
  loadComponent: () => Promise<void>,
  options: ObserverOptions = {}
): (() => void) => {
  return observeForLazyLoading(
    element,
    () => {
      loadComponent().catch((error) => {
        console.error("Failed to load component:", error);
      });
    },
    options
  );
};

// 무한 스크롤
export const observeForInfiniteScroll = (
  trigger: Element,
  loadMore: () => Promise<void>,
  options: ObserverOptions = {}
): (() => void) => {
  let isLoading = false;

  return observeElement(
    trigger,
    async (entry) => {
      if (entry.isIntersecting && !isLoading) {
        isLoading = true;
        try {
          await loadMore();
        } finally {
          isLoading = false;
        }
      }
    },
    { threshold: 0.1, ...options }
  );
};

// 뷰포트 진입 감지
export const observeViewportEntry = (
  element: Element,
  onEnter: () => void,
  onExit?: () => void,
  options: ObserverOptions = {}
): (() => void) => {
  return observeElement(
    element,
    (entry) => {
      if (entry.isIntersecting) {
        onEnter();
      } else if (onExit) {
        onExit();
      }
    },
    { threshold: 0.1, ...options }
  );
};
