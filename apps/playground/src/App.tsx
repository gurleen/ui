import { useState } from "react";
import { Tabs, ToastProvider } from "@gurleen-ui/core";
import { StatusBar } from "@gurleen-ui/broadcast";
import { CoreKitchenSink } from "./pages/CoreKitchenSink";
import { BroadcastKitchenSink } from "./pages/BroadcastKitchenSink";
import { GraphicsController } from "./pages/GraphicsController";
import { ClipPlayer } from "./pages/ClipPlayer";
import { MacroPanel } from "./pages/MacroPanel";

const PAGES = [
  { label: "CORE", Component: CoreKitchenSink },
  { label: "BROADCAST", Component: BroadcastKitchenSink },
  { label: "GFX CONTROLLER", Component: GraphicsController },
  { label: "CLIP PLAYER", Component: ClipPlayer },
  { label: "MACRO PANEL", Component: MacroPanel },
];

export function App() {
  const [tab, setTab] = useState(0);
  const Page = PAGES[tab].Component;
  return (
    <ToastProvider>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg-1)" }}>
        <div style={{ padding: "10px 12px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, letterSpacing: "0.1em", fontSize: 13, color: "var(--fg-1)" }}>@GURLEEN-UI</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)" }}>playground</span>
          </div>
          <Tabs tabs={PAGES.map((p) => p.label)} active={tab} onChange={setTab} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 12 }}>
          <Page />
        </div>
        <StatusBar items={[{ label: "PAGE", value: PAGES[tab].label, kind: "info" }]} />
      </div>
    </ToastProvider>
  );
}
