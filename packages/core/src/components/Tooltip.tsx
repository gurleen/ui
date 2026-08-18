import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/** Hover/focus popover label. Wraps a single child; shows `content` near it. */
export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  style?: CSSProperties;
}

export function Tooltip({ content, children, placement = "top", style }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  let posStyle: CSSProperties;
  switch (placement) {
    case "bottom":
      posStyle = { top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" };
      break;
    case "left":
      posStyle = { right: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" };
      break;
    case "right":
      posStyle = { left: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" };
      break;
    default:
      posStyle = { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" };
  }

  return (
    <span
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      style={{ position: "relative", display: "inline-flex", ...style }}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          style={{
            position: "absolute", ...posStyle, zIndex: 300, whiteSpace: "nowrap",
            background: "var(--bg-0)", color: "var(--fg-1)", border: "1px solid var(--line-3)",
            borderRadius: "var(--radius-1)", boxShadow: "var(--shadow-overlay)",
            padding: "4px 6px", fontSize: 10, fontFamily: "var(--font-ui)", pointerEvents: "none",
          }}
        >{content}</span>
      )}
    </span>
  );
}
