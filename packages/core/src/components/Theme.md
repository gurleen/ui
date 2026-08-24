# Theme (`ThemeProvider` / `useTheme` / `ThemeToggle`)

_Added for general use — `@hydra-tv/tokens` ships both a dark and a light palette (see its README), and this is the mechanism client apps use to switch between them._

```jsx
// once, near your app root, after importing "@hydra-tv/tokens":
<ThemeProvider>
  <App />
</ThemeProvider>

// anywhere under it — a ready-made switch:
<ThemeToggle />

// or read/drive the theme yourself:
function CustomToggle() {
  const { theme, setTheme, toggleTheme } = useTheme();
  return <Button label={theme === "dark" ? "GO LIGHT" : "GO DARK"} onClick={toggleTheme} />;
}
```

## API
- **`<ThemeProvider defaultTheme?>`** — mount once, wraps your app. Sets `data-theme="dark" | "light"` on `<html>` (which is what `@hydra-tv/tokens`' `[data-theme="light"]` overrides key off) and persists the choice to `localStorage` under `hydra-tv-theme`. Initial theme: the stored choice, else `prefers-color-scheme`, else dark. Pass `defaultTheme` to skip detection and force a theme (e.g. for a themed embed).
- **`useTheme()`** → `{ theme, setTheme, toggleTheme }`. Throws if called outside a `ThemeProvider`.
- **`<ThemeToggle style?>`** — a `Switch` labeled DARK/LIGHT, wired to `useTheme()`. Renders nothing on its own beyond the switch; place it in a nav bar, status bar, settings panel, wherever.

## Avoiding a flash of the wrong theme

`ThemeProvider` applies the theme in a `useEffect`, which runs after first paint — fine for most apps, but if your stored preference is `light` you may see one dark frame first. To avoid it, set `data-theme` before your bundle even loads by adding this inline script to your HTML shell's `<head>`, before anything else renders:

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem("hydra-tv-theme");
      if (t !== "light" && t !== "dark") {
        t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      }
      document.documentElement.setAttribute("data-theme", t);
    } catch (e) {}
  })();
</script>
```

`ThemeProvider` reads the same storage key and logic on mount, so it picks up exactly what the script already set — no mismatch, no re-render flash.
