export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoffFactor?: number;
  maxDelay?: number;
  jitter?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

export class RetryError extends Error {
  constructor(
    public originalError: Error,
    public attempts: number,
    message?: string
  ) {
    super(
      message || `Failed after ${attempts} attempts: ${originalError.message}`
    );
    this.name = "RetryError";
  }
}

// 기본 재시도 함수
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoffFactor = 2,
    maxDelay = 30000,
    jitter = true,
    onRetry,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // 마지막 시도인 경우 실패
      if (attempt === maxAttempts) {
        throw new RetryError(lastError, attempt);
      }

      // 재시도 여부 확인
      if (!shouldRetry(lastError)) {
        throw new RetryError(lastError, attempt, "Retry condition not met");
      }

      // 재시도 콜백 실행
      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // 지연 시간 계산
      const currentDelay = Math.min(
        delay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );

      // Jitter 추가 (랜덤 지연)
      const finalDelay = jitter
        ? currentDelay + Math.random() * currentDelay * 0.1
        : currentDelay;

      await new Promise((resolve) => setTimeout(resolve, finalDelay));
    }
  }

  throw new RetryError(lastError!, maxAttempts);
}

// 조건부 재시도
export const retryWithCondition = async <T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: RetryOptions = {}
): Promise<T> => {
  return retry(async () => {
    const result = await fn();
    if (!condition(result)) {
      throw new Error("Condition not met");
    }
    return result;
  }, options);
};

// HTTP 에러 기반 재시도
export const retryHttpRequest = <T>(
  requestFn: () => Promise<T>,
  options: RetryOptions = {}
) => {
  return retry(requestFn, {
    ...options,
    shouldRetry: (error: Error) => {
      // Network errors나 5xx 에러만 재시도
      if (error.name === "NetworkError" || error.name === "TypeError") {
        return true;
      }

      // HTTP status가 있는 경우 5xx 에러만 재시도
      const status = (error as any).status;
      if (status && status >= 500) {
        return true;
      }

      return false;
    },
  });
};

// 지수 백오프 계산 함수
export const calculateBackoffDelay = (
  attempt: number,
  baseDelay: number = 1000,
  backoffFactor: number = 2,
  maxDelay: number = 30000,
  jitter: boolean = true
): number => {
  const exponentialDelay = Math.min(
    baseDelay * Math.pow(backoffFactor, attempt - 1),
    maxDelay
  );

  if (jitter) {
    return exponentialDelay + Math.random() * exponentialDelay * 0.1;
  }

  return exponentialDelay;
};

// 재시도 가능한 함수로 래핑
export const withRetry = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: RetryOptions = {}
) => {
  return (...args: TArgs): Promise<TReturn> => {
    return retry(() => fn(...args), options);
  };
};

// 특정 에러 타입에 대한 재시도
export const retryOnError = <T>(
  fn: () => Promise<T>,
  errorTypes: (new (...args: any[]) => Error)[],
  options: RetryOptions = {}
) => {
  return retry(fn, {
    ...options,
    shouldRetry: (error: Error) => {
      return errorTypes.some((ErrorType) => error instanceof ErrorType);
    },
  });
};

// 브라우저 환경에서 네트워크 재시도
export const retryWithNetworkCheck = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  return retry(fn, {
    ...options,
    shouldRetry: (error: Error) => {
      // 네트워크 연결 확인
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        return false; // 오프라인이면 재시도하지 않음
      }

      // 기본 재시도 조건 적용
      return options.shouldRetry ? options.shouldRetry(error) : true;
    },
    onRetry: (attempt, error) => {
      console.warn(`Retry attempt ${attempt}: ${error.message}`);
      if (options.onRetry) {
        options.onRetry(attempt, error);
      }
    },
  });
};
