// Performance Metrics Types
export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: any[];
}

export interface CoreWebVitals {
  lcp?: WebVitalsMetric;
  fid?: WebVitalsMetric;
  cls?: WebVitalsMetric;
  fcp?: WebVitalsMetric;
  ttfb?: WebVitalsMetric;
}

export interface PerformanceData {
  url: string;
  timestamp: string;
  webVitals: CoreWebVitals;
  loadTime: number;
  domContentLoaded: number;
  bundleSize: {
    javascript: number;
    css: number;
    images: number;
    total: number;
  };
  networkRequests: {
    count: number;
    totalSize: number;
    cacheable: number;
  };
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  inStock?: boolean;
  featured?: boolean;
  rating?: number;
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  joinedAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// Stream Types
export interface LiveStream {
  id: string;
  title: string;
  description: string;
  streamer: User;
  thumbnail: string;
  viewerCount: number;
  category: string;
  tags: string[];
  isLive: boolean;
  startedAt?: string;
  duration?: number;
  language: string;
}

export interface StreamMessage {
  id: string;
  user: User;
  message: string;
  timestamp: string;
  type: 'message' | 'system' | 'donation' | 'subscription';
}

// Comment Types
export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  parentId?: string;
  isEdited: boolean;
  isDeleted: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event Types
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
  url: string;
}

export interface PerformanceEvent extends AnalyticsEvent {
  name: 'performance_measurement';
  properties: {
    metric: string;
    value: number;
    rating: string;
    app: 'before' | 'after-basic' | 'after-advanced';
  };
}

// Configuration Types
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    analytics: boolean;
    performance: boolean;
    webVitals: boolean;
    realTimeUpdates: boolean;
  };
  limits: {
    maxFileSize: number;
    maxImageSize: number;
    apiRateLimit: number;
  };
}

export interface ThemeConfig {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  breakpoints: Record<string, string>;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorReport {
  error: AppError;
  severity: ErrorSeverity;
  context: {
    url: string;
    userAgent: string;
    userId?: string;
    sessionId: string;
    additionalInfo?: Record<string, any>;
  };
} 