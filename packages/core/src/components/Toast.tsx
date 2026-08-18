import { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";

export type ToastLevel = "info" | "ok" | "warn" | "err";

export interface ToastOptions {
  /** Provide to replace/update an existing toast instead of adding a new one */
  id?: string;
  message: string;
  detail?: string;
  level?: ToastLevel;
  /** ms before auto-dismiss; 0 disables auto-dismiss */
  duration?: number;
}

interface ToastItem {
  id: string;
  message: string;
  detail?: string;
  level: ToastLevel;
}

interface ToastContextValue {
  /** Show a toast. Pass a string for a plain info message, or a `ToastOptions` object. Returns the toast id. */
  show: (opts: ToastOptions | string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Mount once near the root of your app. Renders its own fixed-position viewport for active toasts. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((opts: ToastOptions | string) => {
    const o: ToastOptions = typeof opts === "string" ? { message: opts } : opts;
    const id = o.id || `toast-${++counter.current}`;
    const level = o.level || "info";
    setToasts((t) => [...t.filter((x) => x.id !== id), { id, message: o.message, detail: o.detail, level }]);
    const duration = o.duration ?? 4000;
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/** Access the toast API from any component under a `<ToastProvider>`. Throws if used outside one. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast() must be used within a <ToastProvider>");
  return ctx;
}

const LEVELS: Record<ToastLevel, { color: string; tag: string }> = {
  info: { color: "var(--info)", tag: "INF" },
  ok: { color: "var(--ok-text)", tag: "OK" },
  warn: { color: "var(--warn)", tag: "WRN" },
  err: { color: "var(--err)", tag: "ERR" },
};

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div style={{ position: "fixed", right: 12, bottom: 12, zIndex: 1000, display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-ui)" }}>
      {toasts.map((t) => {
        const lv = LEVELS[t.level];
        return (
          <div
            key={t.id}
            role="status"
            onClick={() => onDismiss(t.id)}
            style={{
              minWidth: 220, maxWidth: 320, padding: "8px 10px", cursor: "pointer",
              background: "var(--grad-panel)", border: "1px solid var(--line-2)", borderLeft: `2px solid ${lv.color}`,
              borderRadius: "var(--radius-1)", boxShadow: "var(--shadow-overlay)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: lv.color }}>{lv.tag}</span>
              <span style={{ fontSize: 11, color: "var(--fg-1)", fontWeight: 600 }}>{t.message}</span>
            </div>
            {t.detail && <div style={{ fontSize: 10, color: "var(--fg-2)", marginTop: 2 }}>{t.detail}</div>}
          </div>
        );
      })}
    </div>
  );
}
