import { useId, useState } from "react";
import type { CSSProperties } from "react";

/** Numeric drag/range input, styled as a hardware fader. */
export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  /** Uppercase label left of the track */
  label?: string;
  /** Unit suffix after the numeric readout, e.g. "%", "dB" */
  unit?: string;
  width?: number | string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, onChange, label, unit = "", width = 160, disabled = false, style }: SliderProps) {
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;

  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)" }}>
      {label && <span style={{ fontSize: 10, color: "var(--fg-2)", letterSpacing: "var(--label-tracking)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>}
      <style>{`
        .gu-slider-${id} { -webkit-appearance: none; appearance: none; background: transparent; }
        .gu-slider-${id}::-webkit-slider-runnable-track { height: 4px; background: var(--line-2); border-radius: 2px; }
        .gu-slider-${id}::-webkit-slider-thumb { -webkit-appearance: none; margin-top: -5px; width: 14px; height: 14px; border-radius: var(--radius-1); background: var(--grad-btn); border: 1px solid var(--btn-border); box-shadow: var(--bevel-raised); cursor: ${disabled ? "not-allowed" : "pointer"}; }
        .gu-slider-${id}::-moz-range-track { height: 4px; background: var(--line-2); border-radius: 2px; }
        .gu-slider-${id}::-moz-range-thumb { width: 14px; height: 14px; border-radius: var(--radius-1); background: var(--grad-btn); border: 1px solid var(--btn-border); box-shadow: var(--bevel-raised); cursor: ${disabled ? "not-allowed" : "pointer"}; }
      `}</style>
      <input
        className={`gu-slider-${id}`}
        type="range" min={min} max={max} step={step} disabled={disabled}
        value={current}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (value === undefined) setInternal(v);
          onChange?.(v);
        }}
        style={{ width, height: 14, ...style }}
      />
      <span style={{ fontSize: 11, color: "var(--fg-2)", minWidth: 32, textAlign: "right", fontFeatureSettings: '"tnum" 1, "zero" 1' }}>{current}{unit}</span>
    </label>
  );
}
