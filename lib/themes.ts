export type CatalogTheme = "theme-novus" | "theme-emerald" | "theme-midnight" | "theme-crimson" | "theme-amber";

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    accent: string;
    background: string;
    card: string;
    border: string;
    text: string;
    textSecondary: string;
  };
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
  },
};

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
