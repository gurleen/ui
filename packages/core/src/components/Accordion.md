# Accordion

_Added for general use — dense settings/property panels (a natural fit for this system's density) need collapsible sections, and nothing in the handoff covered that._

```jsx
<Accordion
  items={[
    { key: "geo", title: "GEOMETRY", content: <PropertyEditor sections={[...]} /> },
    { key: "adv", title: "ADVANCED", content: <div>...</div>, disabled: someCondition },
  ]}
/>
<Accordion multiple defaultOpen={["geo"]} items={items} />
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `AccordionItem[]` | — | `{ key, title, content, disabled? }`. |
| `multiple` | `boolean` | `false` | By default opening a section closes any other open one (single-open accordion). |
| `open` / `defaultOpen` | `string[]` | `[]` | Controlled vs uncontrolled list of open item keys. |
| `onChange` | `(open: string[]) => void` | — | |
