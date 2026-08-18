import type { CSSProperties } from "react";
import { Input } from "./Input";
import { Select } from "./Select";
import { Checkbox } from "./Checkbox";
import { Switch } from "./Switch";
import { FieldRow } from "./FieldRow";

/** Sectioned label/control property sheet (110px label gutter). Composes Input/Select/Checkbox/Switch. */
export interface PropertyField {
  key: string;
  label: string;
  type?: "text" | "select" | "checkbox" | "switch" | "readonly";
  value?: any;
  /** For select */
  options?: (string | { value: string; label: string })[];
  /** For checkbox: text next to the box */
  caption?: string;
  /** For switch */
  labels?: [string, string];
  /** For text: unit suffix */
  unit?: string;
  align?: "left" | "right";
}

export interface PropertyEditorProps {
  sections?: { title?: string; fields: PropertyField[] }[];
  onChange?: (key: string, value: any) => void;
  style?: CSSProperties;
}

export function PropertyEditor({ sections = [], onChange, style }: PropertyEditorProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "var(--font-ui)", ...style }}>
      {sections.map((sec, si) => (
        <div key={si}>
          {sec.title && (
            <div style={{ padding: "6px 0 3px", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-3)", borderBottom: "1px solid var(--line-1)", marginBottom: 4 }}>{sec.title}</div>
          )}
          {(sec.fields || []).map((f, fi) => {
            const fire = (v: any) => onChange && onChange(f.key, v);
            let ctl;
            if (f.type === "select") ctl = <Select options={f.options} value={f.value} width="100%" onChange={fire} />;
            else if (f.type === "checkbox") ctl = <Checkbox checked={f.value} label={f.caption} onChange={fire} />;
            else if (f.type === "switch") ctl = <Switch checked={f.value} labels={f.labels} onChange={fire} />;
            else if (f.type === "readonly") ctl = <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{f.value}</span>;
            else ctl = <Input value={f.value} unit={f.unit} width="100%" align={f.align} onChange={fire} />;
            return <FieldRow key={fi} label={f.label}>{ctl}</FieldRow>;
          })}
        </div>
      ))}
    </div>
  );
}
