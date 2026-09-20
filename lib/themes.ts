export type CatalogTheme = "theme-novus" | "theme-emerald" | "theme-midnight" | "theme-crimson" | "theme-amber";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
  background: string;
  card: string;
  border: string;
  text: string;
  textSecondary: string;
}

export interface ThemeDarkColors {
  background: string;
  card: string;
  border: string;
  text: string;
  textSecondary: string;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  dark: ThemeDarkColors;
}

export const themeConfigs: Record<CatalogTheme, ThemeConfig> = {
  "theme-novus": {
    name: "Novus Blue",
    colors: {
      primary: "#2563eb",
      primaryHover: "#1d4ed8",
      primaryLight: "#dbeafe",
      accent: "#4f8ef7",
      background: "#f8fafc",
      card: "#ffffff",
      border: "#e2e8f0",
      text: "#0f172a",
      textSecondary: "#64748b",
    },
    dark: {
      background: "#0b1220",
      card: "#1e293b",
      border: "#334155",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
    },
  },
  "theme-emerald": {
    name: "Emerald Garden",
    colors: {
      primary: "#059669",
      primaryHover: "#047857",
      primaryLight: "#d1fae5",
      accent: "#10b981",
      background: "#f0fdf4",
      card: "#ffffff",
      border: "#d1d5db",
      text: "#064e3b",
      textSecondary: "#6b7280",
    },
    dark: {
      background: "#04211a",
      card: "#0b3a2e",
      border: "#14503c",
      text: "#ecfdf5",
      textSecondary: "#93c5b5",
    },
  },
  "theme-midnight": {
    name: "Midnight Royal",
    colors: {
      primary: "#4f46e5",
      primaryHover: "#4338ca",
      primaryLight: "#e0e7ff",
      accent: "#6366f1",
      background: "#faf5ff",
      card: "#ffffff",
      border: "#e5e7eb",
      text: "#1e1b4b",
      textSecondary: "#6b7280",
    },
    dark: {
      background: "#100e1f",
      card: "#1e1b4b",
      border: "#312e81",
      text: "#eef2ff",
      textSecondary: "#a5b4fc",
    },
  },
  "theme-crimson": {
    name: "Crimson Night",
    colors: {
      primary: "#e11d48",
      primaryHover: "#be123c",
      primaryLight: "#ffe4e6",
      accent: "#fb7185",
      background: "#fff1f2",
      card: "#ffffff",
      border: "#fda4af",
      text: "#1c1917",
      textSecondary: "#78716c",
    },
    dark: {
      background: "#1c0a10",
      card: "#4c0519",
      border: "#881337",
      text: "#fff1f2",
      textSecondary: "#fda4af",
    },
  },
  "theme-amber": {
    name: "Amber Sunset",
    colors: {
      primary: "#d97706",
      primaryHover: "#b45309",
      primaryLight: "#fef3c7",
      accent: "#f59e0b",
      background: "#fffbeb",
      card: "#ffffff",
      border: "#fcd34d",
      text: "#78350f",
      textSecondary: "#92400e",
    },
    dark: {
      background: "#1c1206",
      card: "#451a03",
      border: "#78350f",
      text: "#fffbeb",
      textSecondary: "#d8b06a",
    },
  },
};

export function getThemeColors(theme: CatalogTheme, isDark: boolean): ThemeColors {
  const config = themeConfigs[theme];
  return isDark ? { ...config.colors, ...config.dark } : config.colors;
}

export function getThemeClasses(theme: CatalogTheme): string {
  const config = themeConfigs[theme];
  return `
    --theme-primary: ${config.colors.primary};
    --theme-primary-hover: ${config.colors.primaryHover};
    --theme-primary-light: ${config.colors.primaryLight};
    --theme-accent: ${config.colors.accent};
    --theme-background: ${config.colors.background};
    --theme-card: ${config.colors.card};
    --theme-border: ${config.colors.border};
    --theme-text: ${config.colors.text};
    --theme-text-secondary: ${config.colors.textSecondary};
  `;
}
