import { useState } from "react";
import { Tabs, ThemeProvider, ThemeToggle, ToastProvider } from "@hydra-tv/ui";
import { StatusBar } from "@hydra-tv/broadcast";
import { CoreKitchenSink } from "./pages/CoreKitchenSink";
import { BroadcastKitchenSink } from "./pages/BroadcastKitchenSink";
import { SportsKitchenSink } from "./pages/SportsKitchenSink";
import { GraphicsController } from "./pages/GraphicsController";
import { ClipPlayer } from "./pages/ClipPlayer";
import { MacroPanel } from "./pages/MacroPanel";
import { GameCenter } from "./pages/GameCenter";
import { PitchLab } from "./pages/PitchLab";

const PAGES = [
  { label: "CORE", Component: CoreKitchenSink },
  { label: "BROADCAST", Component: BroadcastKitchenSink },
  { label: "SPORTS", Component: SportsKitchenSink },
  { label: "GFX CONTROLLER", Component: GraphicsController },
  { label: "CLIP PLAYER", Component: ClipPlayer },
  { label: "MACRO PANEL", Component: MacroPanel },
  { label: "GAME CENTER", Component: GameCenter },
  { label: "PITCH LAB", Component: PitchLab },
];

export function App() {
  const [tab, setTab] = useState(0);
  const Page = PAGES[tab].Component;
  return (
    <ThemeProvider>
      <ToastProvider>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg-1)" }}>
          <div style={{ padding: "10px 12px 0", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, letterSpacing: "0.1em", fontSize: 13, color: "var(--fg-1)" }}>@GURLEEN-UI</span>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--fg-3)" }}>playground</span>
            </div>
            <Tabs tabs={PAGES.map((p) => p.label)} active={tab} onChange={setTab} />
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 12 }}>
            <Page />
          </div>
          <StatusBar items={[{ label: "PAGE", value: PAGES[tab].label, kind: "info" }]} right={<ThemeToggle style={{ padding: "0 10px" }} />} />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
