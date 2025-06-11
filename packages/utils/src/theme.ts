export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
}

export const lightTheme: ThemeColors = {
  background: "0 0% 100%",
  foreground: "222.2 84% 4.9%",
  primary: "221.2 83.2% 53.3%",
  secondary: "210 40% 96%",
  accent: "210 40% 96%",
  muted: "210 40% 96%",
  border: "214.3 31.8% 91.4%",
  input: "214.3 31.8% 91.4%",
  ring: "221.2 83.2% 53.3%",
  destructive: "0 84.2% 60.2%",
};

export const darkTheme: ThemeColors = {
  background: "222.2 84% 4.9%",
  foreground: "210 40% 98%",
  primary: "217.2 91.2% 59.8%",
  secondary: "217.2 32.6% 17.5%",
  accent: "217.2 32.6% 17.5%",
  muted: "217.2 32.6% 17.5%",
  border: "217.2 32.6% 17.5%",
  input: "217.2 32.6% 17.5%",
  ring: "224.3 76.3% 94.1%",
  destructive: "0 62.8% 30.6%",
};

export class ThemeManager {
  private currentTheme: ThemeMode = "system";
  private readonly storageKey = "theme-preference";

  constructor() {
    this.initializeTheme();
  }

  // 테마 설정
  setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    this.applyTheme();
    this.saveTheme();
  }

  // 현재 테마 가져오기
  getTheme(): ThemeMode {
    return this.currentTheme;
  }

  // 시스템 테마 감지
  getSystemTheme(): "light" | "dark" {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }

  // 실제 적용된 테마 (system일 때 해석된 값)
  getEffectiveTheme(): "light" | "dark" {
    return this.currentTheme === "system"
      ? this.getSystemTheme()
      : this.currentTheme;
  }

  // 테마 토글
  toggleTheme(): void {
    const currentEffective = this.getEffectiveTheme();
    this.setTheme(currentEffective === "light" ? "dark" : "light");
  }

  // CSS 변수 적용
  applyCustomProperties(colors: Partial<ThemeColors>): void {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }

  // 시스템 테마 변경 감지
  watchSystemTheme(callback: (theme: "light" | "dark") => void): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (this.currentTheme === "system") {
        callback(e.matches ? "dark" : "light");
        this.applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }

  // Private methods
  private initializeTheme(): void {
    if (typeof window === "undefined") return;

    // 저장된 테마 로드
    const saved = localStorage.getItem(this.storageKey) as ThemeMode;
    if (saved && ["light", "dark", "system"].includes(saved)) {
      this.currentTheme = saved;
    }

    this.applyTheme();
  }

  private applyTheme(): void {
    if (typeof document === "undefined") return;

    const effectiveTheme = this.getEffectiveTheme();
    const colors = effectiveTheme === "dark" ? darkTheme : lightTheme;

    // CSS 클래스 적용
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(effectiveTheme);

    // CSS 변수 적용
    this.applyCustomProperties(colors);

    // meta theme-color 업데이트
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        effectiveTheme === "dark" ? "#0a0a0a" : "#ffffff"
      );
    }
  }

  private saveTheme(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, this.currentTheme);
    }
  }
}

// 전역 테마 매니저 인스턴스
export const themeManager = new ThemeManager();

// 편의 함수들
export const setTheme = (theme: ThemeMode) => themeManager.setTheme(theme);
export const getTheme = () => themeManager.getTheme();
export const getEffectiveTheme = () => themeManager.getEffectiveTheme();
export const toggleTheme = () => themeManager.toggleTheme();
export const watchSystemTheme = (callback: (theme: "light" | "dark") => void) =>
  themeManager.watchSystemTheme(callback);

// React 훅에서 사용할 수 있는 유틸리티
export const createThemeScript = () => {
  return `
    (function() {
      const theme = localStorage.getItem('theme-preference') || 'system';
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const effectiveTheme = theme === 'system' ? systemTheme : theme;
      
      document.documentElement.classList.add(effectiveTheme);
      
      const colors = effectiveTheme === 'dark' ? {
        '--background': '222.2 84% 4.9%',
        '--foreground': '210 40% 98%',
        '--primary': '217.2 91.2% 59.8%'
      } : {
        '--background': '0 0% 100%',
        '--foreground': '222.2 84% 4.9%',
        '--primary': '221.2 83.2% 53.3%'
      };
      
      Object.entries(colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    })();
  `;
};
