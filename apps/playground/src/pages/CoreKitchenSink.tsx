import { useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  DataGrid,
  Dialog,
  Divider,
  FieldRow,
  Input,
  LogConsole,
  Menu,
  Panel,
  ProgressBar,
  PropertyEditor,
  RadioGroup,
  Select,
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
