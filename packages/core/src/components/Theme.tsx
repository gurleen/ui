import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Switch } from "./Switch";

export type Theme = "dark" | "light";

const STORAGE_KEY = "hydra-tv-theme";

function systemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children?: ReactNode;
  /** Skip localStorage/system-preference detection and force this theme on first render. */
  defaultTheme?: Theme;
}

/**
 * Mount once near the root of your app. Sets `data-theme` on `<html>` (which
 * `@hydra-tv/tokens`' `[data-theme="light"]` overrides key off) and persists
 * the choice to localStorage. Initial theme is the stored choice, falling
 * back to `prefers-color-scheme`, falling back to dark.
 *
 * To avoid a flash of the wrong theme on first paint, add a small inline
 * script to your HTML shell that sets `data-theme` before React mounts —
 * see `Theme.md` for the snippet.
 */
export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => defaultTheme ?? readStoredTheme() ?? systemTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable (private mode, disabled) — theme still applies for this session
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

/** Access the active theme and switch it from any component under a `<ThemeProvider>`. Throws if used outside one. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

export interface ThemeToggleProps {
  style?: CSSProperties;
}

/** Ready-made DARK/LIGHT switch wired to `useTheme()`. Drop it anywhere under a `<ThemeProvider>`. */
export function ThemeToggle({ style }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  return <Switch label="THEME" labels={["DARK", "LIGHT"]} checked={theme === "light"} onChange={toggleTheme} style={style} />;
}
