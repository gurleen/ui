import { useState } from "react";
import type { CSSProperties } from "react";

/** Hardware-style tab strip; active tab reads as a raised key. */
export interface TabsProps {
  /** Tab captions (uppercased via CSS) */
  tabs?: string[];
  /** Controlled active index */
  active?: number;
  defaultActive?: number;
  onChange?: (index: number) => void;
  style?: CSSProperties;
}

export function Tabs({ tabs = [], active, defaultActive = 0, onChange, style }: TabsProps) {
  const [internal, setInternal] = useState(defaultActive);
  const idx = active !== undefined ? active : internal;
  return (
    <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--line-2)", fontFamily: "var(--font-ui)", ...style }}>
      {tabs.map((t, i) => {
        const on = i === idx;
        return (
          <button key={i} onClick={() => { if (active === undefined) setInternal(i); if (onChange) onChange(i); }}
            style={{
              height: 24, padding: "0 12px", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "var(--font-ui)", fontWeight: on ? 600 : 400, cursor: "pointer",
              background: on ? "var(--grad-btn)" : "transparent",
              color: on ? "var(--fg-1)" : "var(--fg-3)",
              border: on ? "1px solid var(--btn-border)" : "1px solid transparent",
              borderBottom: on ? "1px solid var(--bg-2)" : "1px solid transparent",
              borderRadius: "2px 2px 0 0", marginBottom: -1,
              boxShadow: on ? "inset 0 1px 0 #ffffff1a" : "none",
            }}>{t}</button>
        );
      })}
    </div>
  );
}
