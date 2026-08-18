import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

export interface AccordionItem {
  key: string;
  /** Uppercase section title */
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

/** Collapsible section list — good for dense settings/property panels. */
export interface AccordionProps {
  items: AccordionItem[];
  /** Allow more than one section open at once (default: only one) */
  multiple?: boolean;
  defaultOpen?: string[];
  /** Controlled list of open section keys */
  open?: string[];
  onChange?: (open: string[]) => void;
  style?: CSSProperties;
}

export function Accordion({ items, multiple = false, defaultOpen = [], open, onChange, style }: AccordionProps) {
  const [internal, setInternal] = useState<string[]>(defaultOpen);
  const current = open !== undefined ? open : internal;

  const toggle = (key: string) => {
    const next = current.includes(key) ? current.filter((k) => k !== key) : multiple ? [...current, key] : [key];
    if (open === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--line-1)", fontFamily: "var(--font-ui)", ...style }}>
      {items.map((item) => {
        const isOpen = current.includes(item.key);
        return (
          <div key={item.key} style={{ borderBottom: "1px solid var(--line-1)" }}>
            <div
              onClick={() => !item.disabled && toggle(item.key)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", height: "var(--panel-title-h)",
                padding: "0 8px", cursor: item.disabled ? "not-allowed" : "pointer", opacity: item.disabled ? 0.5 : 1,
                background: isOpen ? "var(--bg-3)" : "transparent", userSelect: "none",
              }}
            >
              <span style={{ fontFamily: "var(--font-label)", fontSize: 10, letterSpacing: "var(--label-tracking-wide)", textTransform: "uppercase", color: "var(--fg-2)", fontWeight: 600 }}>{item.title}</span>
              <span style={{ fontSize: 8, color: "var(--fg-3)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform var(--t-med)" }}>▼</span>
            </div>
            {isOpen && <div style={{ padding: 8 }}>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
