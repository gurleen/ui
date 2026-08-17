import { useState } from "react";
import {
  Accordion,
  Badge,
  BarChart,
  Breadcrumb,
  Button,
  Checkbox,
  Combobox,
  DataGrid,
  Dialog,
  Divider,
  FieldRow,
  HeatGrid,
  Input,
  LauncherTile,
  LineChart,
  LogConsole,
  Menu,
  NavBar,
  Panel,
  PercentileBar,
  ProgressBar,
  PropertyEditor,
  RadioGroup,
  ScatterPlot,
  Select,
  SideNav,
  Slider,
  Sparkline,
  Spinner,
  Stat,
  Switch,
  Tabs,
  Tooltip,
  useToast,
} from "@hydra-tv/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel title={title} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>{children}</div>
    </Panel>
  );
}

export function CoreKitchenSink() {
  const { show } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(false);
  const [radio, setRadio] = useState("b");
  const [slider, setSlider] = useState(40);
  const [combo, setCombo] = useState("h264");
  const [accordionOpen, setAccordionOpen] = useState<string[]>(["a"]);
  const [sideActive, setSideActive] = useState("library");
  const [reorderRows, setReorderRows] = useState([
    { id: "a", name: "Intro", size: "0:30" },
    { id: "b", name: "Segment A", size: "4:12" },
    { id: "c", name: "Outro", size: "0:15" },
  ]);

  return (
    <div style={{ position: "relative", maxWidth: 900 }}>
      <Section title="Buttons">
        <Button label="Default" />
        <Button label="Accent" variant="accent" />
        <Button label="Take" variant="take" />
        <Button label="Armed" variant="armed" active />
        <Button label="Disabled" disabled />
        <Button label="XL" size="xl" variant="accent" />
      </Section>

      <Section title="Launcher tiles">
        <LauncherTile
          label="RUNDOWNS"
          description="Playout and templates"
          icon={
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
            </svg>
          }
          onClick={() => show({ message: "Rundowns", level: "ok" })}
        />
        <LauncherTile label="SETTINGS" description="Coming soon" disabled size={140} />
      </Section>

      <Section title="Inputs">
        <Input label="Name" defaultValue="report.pdf" width={160} />
        <Input label="Size" defaultValue="2.1" unit="MB" align="right" width={100} />
        <Select label="Format" options={["PDF", "CSV", "JSON"]} defaultValue="PDF" />
        <Combobox
          label="Export"
          options={["PDF", "CSV", "JSON", "XML", "YAML", "TOML", "HTML", "Markdown", "TSV", "Parquet", "Avro", "ORC", "Excel"]}
          defaultValue="JSON"
          width={180}
        />
        <Combobox
          label="Codec"
          options={[
            { value: "h264", label: "H.264" },
            { value: "h265", label: "H.265" },
            { value: "prores", label: "ProRes" },
            { value: "dnxhd", label: "DNxHD" },
            { value: "av1", label: "AV1" },
            { value: "vp9", label: "VP9" },
            { value: "mjpeg", label: "MJPEG", disabled: true },
          ]}
          value={combo}
          onChange={setCombo}
          placeholder="Choose…"
          clearable
          width={160}
        />
        <Checkbox label="AUTO-SAVE" checked={checked} onChange={setChecked} />
        <Switch label="Notify" labels={["OFF", "ON"]} checked={switched} onChange={setSwitched} />
        <RadioGroup direction="row" options={[{ value: "a", label: "A" }, { value: "b", label: "B" }, { value: "c", label: "C" }]} value={radio} onChange={setRadio} />
        <Slider label="Volume" unit="%" value={slider} onChange={setSlider} />
      </Section>

      <Section title="Feedback">
        <Badge kind="neutral" label="DRAFT" />
        <Badge kind="info" dot label="ACTIVE" />
        <Badge kind="warn" label="LATE" />
        <Badge kind="err" label="FAILED" />
        <Spinner />
        <ProgressBar value={62} label="UPLOADING" width={160} />
        <ProgressBar indeterminate label="PROCESSING" width={160} />
        <Button label="Show toast" onClick={() => show({ message: "Saved", level: "ok" })} />
        <Button label="Open dialog" onClick={() => setDialogOpen(true)} />
        <Tooltip content="Hover/focus popover"><Badge label="HOVER ME" kind="info" /></Tooltip>
        <Menu
          trigger={<Button label="Menu ▾" />}
          items={[
            { key: "rename", label: "Rename" },
            { key: "duplicate", label: "Duplicate" },
            { key: "delete", label: "Delete", divider: true, danger: true },
          ]}
          onSelect={(key) => show({ message: `Menu: ${key}` })}
        />
      </Section>

      <Section title="Layout">
        <Tabs tabs={["RUNDOWN", "LIBRARY", "LOG"]} active={tab} onChange={setTab} />
        <Divider orientation="vertical" style={{ height: 24 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-2)" }}>Active tab index: {tab}</span>
      </Section>

      <Section title="Navigation">
        <Breadcrumb
          items={[
            { label: "Projects", onClick: () => {} },
            { label: "Broadcast" },
          ]}
        />
        <div style={{ width: "100%" }}>
          <NavBar
            brand={<span style={{ fontWeight: 600 }}>STUDIO</span>}
            actions={<Button label="Sync" variant="accent" size="sm" />}
          >
            <a href="#" style={{ color: "var(--fg-2)", textDecoration: "none", padding: "0 10px" }}>Rundown</a>
            <a href="#" style={{ color: "var(--fg-1)", textDecoration: "none", padding: "0 10px" }}>Library</a>
            <a href="#" style={{ color: "var(--fg-2)", textDecoration: "none", padding: "0 10px" }}>Log</a>
          </NavBar>
        </div>
        <div style={{ display: "flex", gap: 12, width: "100%" }}>
          <SideNav
            items={[
              { key: "rundown", label: "Rundown", icon: <Spinner size={12} color="var(--ch-1)" /> },
              { key: "library", label: "Library", icon: <Spinner size={12} color="var(--ch-2)" /> },
              { key: "log", label: "Log", icon: <Spinner size={12} color="var(--ch-3)" /> },
            ]}
            active={sideActive}
            onChange={setSideActive}
          />
          <SideNav
            collapsed
            items={[
              { key: "rundown", label: "Rundown", icon: <Spinner size={12} color="var(--ch-1)" /> },
              { key: "library", label: "Library", icon: <Spinner size={12} color="var(--ch-2)" /> },
              { key: "log", label: "Log", icon: <Spinner size={12} color="var(--ch-3)" /> },
            ]}
            defaultActive="rundown"
          />
          <em style={{ fontSize: 11, color: "var(--fg-2)" }}>Active: {sideActive}</em>
        </div>
      </Section>
      <Divider label="ACCORDION" />
      <div style={{ marginTop: 8, marginBottom: 12 }}>
        <Accordion
          items={[
            { key: "a", title: "SECTION A", content: <span style={{ fontSize: 11, color: "var(--fg-2)" }}>Content for section A.</span> },
            { key: "b", title: "SECTION B", content: <span style={{ fontSize: 11, color: "var(--fg-2)" }}>Content for section B.</span> },
          ]}
          open={accordionOpen}
          onChange={setAccordionOpen}
        />
      </div>

      <Section title="Data">
        <div style={{ width: "100%" }}>
          <DataGrid
            columns={[
              { key: "id", label: "#", width: "36px", dim: true },
              { key: "name", label: "Name" },
              { key: "size", label: "Size", width: "80px", align: "right", dim: true },
            ]}
            rows={[
              { id: "001", name: "report.pdf", size: "2.1 MB" },
              { id: "002", name: "archive.zip", size: "18 MB", _state: "selected" },
              { id: "003", name: "notes.txt", size: "4 KB" },
            ]}
            height={110}
          />
        </div>
        <div style={{ width: "100%" }}>
          <DataGrid
            columns={[
              { key: "name", label: "Segment" },
              { key: "size", label: "Dur", width: "60px", align: "right", dim: true },
            ]}
            rows={reorderRows}
            height={110}
            reorderable
            onReorder={(from, to) => {
              setReorderRows((prev) => {
                const next = [...prev];
                const [item] = next.splice(from, 1);
                next.splice(to, 0, item!);
                return next;
              });
            }}
          />
        </div>
        <div style={{ width: "100%" }}>
          <LogConsole
            height={90}
            lines={[
              { time: "14:02:11", level: "ok", text: "Build succeeded" },
              { time: "14:02:40", level: "warn", text: "Deprecated API used in utils.ts" },
              { time: "14:03:02", level: "err", text: "Connection lost: worker-3" },
            ]}
          />
        </div>
        <div style={{ width: "100%" }}>
          <PropertyEditor
            sections={[{
              title: "GENERAL",
              fields: [
                { key: "name", label: "Name", value: "My Doc" },
                { key: "shared", label: "Shared", type: "checkbox", value: true, caption: "PUBLIC" },
                { key: "fmt", label: "Format", type: "select", value: "PDF", options: ["PDF", "CSV"] },
              ],
            }]}
          />
        </div>
        <FieldRow label="Custom"><em style={{ fontSize: 11, color: "var(--fg-2)" }}>any custom control here</em></FieldRow>
      </Section>

      <Section title="Stats & sparklines">
        <Stat label="Throughput" value="1,284" unit="req/s" delta={12.4} deltaKind="good" deltaUnit="%" />
        <Stat label="Error rate" value="0.42" unit="%" delta={-0.18} deltaKind="good" caption="Last 24 hours" />
        <Stat label="P99 latency" value={312} unit="ms" delta={41} deltaKind="bad" deltaUnit="ms" size="lg" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Sparkline data={[12, 18, 9, 24, 22, 31, 28, 35]} showLast />
          <Sparkline data={[12, 18, 9, 24, 22, 31, 28, 35]} color="var(--ch-3)" fill baseline={20} width={120} height={28} />
        </div>
      </Section>

      <Section title="Bar charts">
        <div style={{ width: 280 }}>
          <BarChart
            data={[
              { label: "Rim", value: 214 },
              { label: "Mid-range", value: 88 },
              { label: "Corner 3", value: 131 },
              { label: "Above break", value: 196 },
            ]}
          />
        </div>
        <BarChart
          orientation="vertical"
          height={110}
          style={{ width: 240 }}
          data={[
            { label: "Q1", value: [12, 9] },
            { label: "Q2", value: [18, 14] },
            { label: "Q3", value: [8, 21] },
            { label: "Q4", value: [24, 16] },
          ]}
        />
      </Section>

      <Section title="Line chart">
        <div style={{ width: "100%" }}>
          <LineChart
            height={170}
            yDomain={[0, 100]}
            referenceLine={50}
            band={[40, 60]}
            legend
            series={[
              { label: "Home", color: "var(--ch-1)", fill: true, points: [[0, 50], [8, 61], [16, 47], [24, 55], [32, 71], [40, 66], [48, 84]] },
              { label: "Away", color: "var(--ch-2)", dashed: true, points: [[0, 50], [8, 39], [16, 53], [24, 45], [32, 29], [40, 34], [48, 16]] },
            ]}
          />
        </div>
      </Section>

      <Section title="Scatter plot & heat grid">
        <div style={{ width: 300 }}>
          <ScatterPlot
            height={190}
            xDomain={[0, 100]}
            yDomain={[0, 60]}
            grid
            points={[
              { x: 12, y: 40, title: "A · 12/40" },
              { x: 26, y: 18, color: "var(--ch-2)", shape: "ring" },
              { x: 48, y: 32, color: "var(--ch-3)", shape: "square" },
              { x: 63, y: 51, shape: "triangle", color: "var(--ch-2)" },
              { x: 77, y: 24, shape: "cross", color: "var(--warn)" },
              { x: 88, y: 44, label: "9", size: 7 },
            ]}
          />
        </div>
        <HeatGrid
          rowLabels={["Fastball", "Slider", "Changeup"]}
          colLabels={["0-0", "0-1", "1-0", "2-2", "3-2"]}
          data={[
            [62, 55, 71, 48, 74],
            [21, 30, 14, 33, 12],
            [17, 15, 15, 19, null],
          ]}
          showValues
          legend
        />
      </Section>

      <Section title="Percentile bars">
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 5 }}>
          <PercentileBar label="Exit velocity" percentile={88} value="94.1" />
          <PercentileBar label="Chase rate" percentile={31} value="28.4%" color="var(--ch-4)" />
          <PercentileBar label="Barrel rate" percentile={64} value="9.7%" color="var(--ch-3)" showScale />
        </div>
      </Section>

      <Dialog
        open={dialogOpen}
        message="DELETE ITEM?"
        detail="This cannot be undone."
        confirmLabel="DELETE"
        confirmVariant="take"
        onConfirm={() => { setDialogOpen(false); show({ message: "Deleted", level: "err" }); }}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
