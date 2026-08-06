# Tabs

Hardware-style tab strip; the active tab reads as a raised key. Purely presentational — it does not render tab panels, just the strip.

```jsx
const [tab, setTab] = useState(0);
<Tabs tabs={["RUNDOWN", "LIBRARY", "LOG"]} active={tab} onChange={setTab} />
{tab === 0 && <RundownPanel />}
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `tabs` | `string[]` | `[]` | Captions, uppercased via CSS. |
| `active` / `defaultActive` | `number` | `0` | Controlled vs uncontrolled index. |
| `onChange` | `(index: number) => void` | — | |
