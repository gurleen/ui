import type { ReactNode } from "react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";

/** Modal confirmation dialog. Renders nothing when `open` is false. */
export interface DialogProps {
  open?: boolean;
  title?: string;
  message?: string;
  detail?: string;
  confirmLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  cancelLabel?: string | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  width?: number | string;
  children?: ReactNode;
}

export function Dialog({ open = true, title = "CONFIRM", message, detail, confirmLabel = "OK", confirmVariant = "accent", cancelLabel = "CANCEL", onConfirm, onCancel, width = 360, children }: DialogProps) {
  if (!open) return null;
  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg-well)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, fontFamily: "var(--font-ui)" }}>
      <div style={{ width, background: "var(--grad-panel)", border: "1px solid var(--line-3)", borderRadius: "var(--radius-1)", boxShadow: "var(--shadow-overlay)" }}>
        <div style={{ height: 24, display: "flex", alignItems: "center", padding: "0 8px", borderBottom: "1px solid var(--line-1)", fontSize: 10, letterSpacing: "var(--label-tracking-wide)", textTransform: "uppercase", color: confirmVariant === "take" ? "var(--tally-pgm)" : "var(--fg-2)", fontWeight: 600 }}>{title}</div>
        <div style={{ padding: 12 }}>
          {message && <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: "var(--fg-1)" }}>{message}</div>}
          {detail && <div style={{ fontSize: 11, color: "var(--fg-2)", marginTop: 4 }}>{detail}</div>}
          {children}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, padding: 8, borderTop: "1px solid var(--line-1)" }}>
          {cancelLabel && <Button label={cancelLabel} onClick={onCancel} />}
          <Button label={confirmLabel} variant={confirmVariant} onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
