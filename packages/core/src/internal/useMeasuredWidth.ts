import { useEffect, useRef, useState } from "react";

/**
 * Charts need a pixel width to lay out an SVG coordinate system, but callers want
 * to pass `width="100%"` and have the chart fill its panel. When `width` is a
 * number we use it directly; otherwise we measure the wrapper element.
 */
export function useMeasuredWidth(width: number | string | undefined, fallback: number) {
  const ref = useRef<HTMLDivElement>(null);
  const fixed = typeof width === "number" ? width : undefined;
  const [measured, setMeasured] = useState(fallback);

  useEffect(() => {
    if (fixed !== undefined) return;
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setMeasured(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixed]);

  return [ref, fixed ?? measured] as const;
}
