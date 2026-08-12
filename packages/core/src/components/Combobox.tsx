import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Searchable single-select with a custom listbox. Use native `Select` for short lists. */
export interface ComboboxProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Strings or {value,label,disabled?} pairs */
  options?: (string | ComboboxOption)[];
  /** Uppercase label rendered left of the control */
  label?: string;
  width?: number | string;
  disabled?: boolean;
  placeholder?: string;
  /** Shows a × that clears the value when one is set */
  clearable?: boolean;
  style?: CSSProperties;
}

function normalize(o: string | ComboboxOption): ComboboxOption {
  return typeof o === "string" ? { value: o, label: o } : o;
}

export function Combobox({
  value,
  defaultValue,
  onChange,
  options = [],
  label,
  width = 160,
  disabled = false,
  placeholder,
  clearable = false,
  style,
}: ComboboxProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState<string | undefined>(undefined);
  const [foc, setFoc] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const listId = `gu-combo-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  const opts = useMemo(() => options.map(normalize), [options]);
  const selected = opts.find((o) => o.value === current);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return opts;
    return opts.filter((o) => o.label.toLowerCase().includes(q));
  }, [opts, query]);

  const isPercent = typeof width === "string" && width.trim().endsWith("%");
  const showClear = clearable && !!current && !disabled;
  const active = open || foc;

  const pick = (v: string) => {
    if (disabled) return;
    if (value === undefined) setInternal(v);
    onChange?.(v);
    setOpen(false);
    setQuery("");
  };

  const highlightIn = (list: ComboboxOption[], prefer?: string) => {
    const enabled = list.filter((o) => !o.disabled);
    const match = prefer ? enabled.find((o) => o.value === prefer) : undefined;
    setHighlighted((match ?? enabled[0])?.value);
  };

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    highlightIn(opts, current);
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!open || highlighted == null) return;
    const i = filtered.findIndex((o) => o.value === highlighted);
    if (i < 0) return;
    const el = listRef.current?.querySelector(`[data-combo-idx="${i}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, highlighted, filtered]);

  const move = (delta: number) => {
    const enabled = filtered.filter((o) => !o.disabled);
    if (enabled.length === 0) return;
    const idx = enabled.findIndex((o) => o.value === highlighted);
    let next: number;
    if (idx < 0) next = delta > 0 ? 0 : enabled.length - 1;
    else next = Math.max(0, Math.min(enabled.length - 1, idx + delta));
    setHighlighted(enabled[next].value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) openList();
      else move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) openList();
      else move(-1);
    } else if (e.key === "Home") {
      if (!open) return;
      e.preventDefault();
      const first = filtered.find((o) => !o.disabled);
      if (first) setHighlighted(first.value);
    } else if (e.key === "End") {
      if (!open) return;
      e.preventDefault();
      const enabled = filtered.filter((o) => !o.disabled);
      const last = enabled[enabled.length - 1];
      if (last) setHighlighted(last.value);
    } else if (e.key === "Enter") {
      if (!open) return;
      e.preventDefault();
      const hit = filtered.find((o) => o.value === highlighted && !o.disabled);
      if (hit) pick(hit.value);
    } else if (e.key === "Escape") {
      if (!open) return;
      e.preventDefault();
      setOpen(false);
      setQuery("");
    } else if (e.key === "Tab") {
      setOpen(false);
      setQuery("");
    }
  };

  const inputValue = open || foc ? query : (selected?.label ?? "");
  const inputPlaceholder = open || foc ? (selected?.label || placeholder) : placeholder;
  const hiIdx = highlighted != null ? filtered.findIndex((o) => o.value === highlighted) : -1;
  const hiId = hiIdx >= 0 ? `${listId}-opt-${hiIdx}` : undefined;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", ...(isPercent ? { width, minWidth: 0 } : {}) }}>
      {label && (
        <label htmlFor={listId + "-input"} style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          {label}
        </label>
      )}
      <div ref={rootRef} style={{ position: "relative", display: "inline-block", width: isPercent ? "100%" : width, minWidth: 0 }}>
        <span
          style={{
            position: "relative", display: "inline-flex", alignItems: "center", width: "100%", height: "var(--ctl-h)", minWidth: 0,
            background: "var(--grad-btn)",
            border: `1px solid ${active ? "var(--info)" : "var(--btn-border)"}`,
            borderBottomColor: active ? "var(--info)" : "var(--btn-border-bottom)",
            borderRadius: "var(--radius-1)", boxShadow: "var(--bevel-raised)",
            opacity: disabled ? 0.5 : 1, ...style,
          }}
        >
          <input
            ref={inputRef}
            id={listId + "-input"}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={open ? hiId : undefined}
            aria-autocomplete="list"
            aria-disabled={disabled || undefined}
            disabled={disabled}
            value={inputValue}
            placeholder={inputPlaceholder}
            onChange={(e) => {
              const q = e.target.value;
              setQuery(q);
              setOpen(true);
              const qn = q.trim().toLowerCase();
              const next = opts.filter((o) => !qn || o.label.toLowerCase().includes(qn));
              highlightIn(next, highlighted);
            }}
            autoComplete="off"
            onFocus={() => {
              setFoc(true);
              setQuery("");
              openList();
            }}
            onBlur={() => setFoc(false)}
            onKeyDown={onKeyDown}
            onClick={() => { if (!open) openList(); }}
            style={{
              flex: 1, minWidth: 0, height: "100%", padding: `0 ${showClear ? 36 : 22}px 0 6px`,
              background: "transparent", border: "none", outline: "none",
              fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-1)",
              cursor: disabled ? "not-allowed" : "text",
            }}
          />
          {showClear && (
            <button
              type="button"
              aria-label="Clear"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick("")}
              style={{
                position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
                width: 14, height: 14, padding: 0, border: "none", background: "transparent",
                color: "var(--fg-2)", fontSize: 11, lineHeight: 1, cursor: "pointer", fontFamily: "var(--font-mono)",
              }}
            >×</button>
          )}
          <span aria-hidden style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--fg-2)", fontSize: 8 }}>▼</span>
        </span>
        {open && (
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            onMouseDown={(e) => e.preventDefault()}
            style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
              maxHeight: 180, overflowY: "auto",
              background: "var(--grad-panel)", border: "1px solid var(--line-3)", borderRadius: "var(--radius-1)",
              boxShadow: "var(--shadow-overlay)", padding: 4, fontFamily: "var(--font-mono)",
            }}
          >
            {filtered.length === 0 && (
              <div style={{ padding: "6px 8px", fontSize: 11, color: "var(--fg-3)" }}>No matches</div>
            )}
            {filtered.map((opt, i) => {
              const isHi = opt.value === highlighted;
              const isSel = opt.value === current;
              return (
                <div
                  key={opt.value}
                  id={`${listId}-opt-${i}`}
                  data-combo-idx={i}
                  role="option"
                  aria-selected={isSel}
                  aria-disabled={opt.disabled || undefined}
                  onMouseEnter={() => { if (!opt.disabled) setHighlighted(opt.value); }}
                  onClick={() => { if (!opt.disabled) pick(opt.value); }}
                  style={{
                    padding: "6px 8px", fontSize: 11, borderRadius: "var(--radius-1)",
                    background: isHi && !opt.disabled ? "var(--bg-4)" : "transparent",
                    color: opt.disabled ? "var(--fg-3)" : isSel ? "var(--info)" : "var(--fg-1)",
                    cursor: opt.disabled ? "not-allowed" : "pointer",
                    opacity: opt.disabled ? 0.5 : 1,
                  }}
                >{opt.label}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
