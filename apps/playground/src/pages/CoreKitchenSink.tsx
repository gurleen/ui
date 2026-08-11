import { useState } from "react";
import {
  Accordion,
  Badge,
  Breadcrumb,
  Button,
  Checkbox,
  DataGrid,
  Dialog,
  Divider,
  FieldRow,
  Input,
  LauncherTile,
  LogConsole,
  Menu,
  NavBar,
  Panel,
  ProgressBar,
  PropertyEditor,
  RadioGroup,
  Select,
  SideNav,
  Slider,
  Spinner,
  Switch,
  Tabs,
  Tooltip,
  useToast,
} from "@gurleen-ui/core";

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
