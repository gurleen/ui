# Spinner

_Added for general use — every non-trivial app needs a loading indicator and none existed in the original handoff._

```jsx
<Spinner />
<Spinner size={24} color="var(--warn)" />
<Button disabled><Spinner size={11} /> LOADING</Button>
```

## Props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `number` | `16` | Diameter in px. |
| `color` | `string` | `"var(--info)"` | The spinning arc color; the track uses `--line-2`. |

Implementation note: this injects a small `<style>` tag with a `@keyframes` rule on every render (harmless — identical `<style>` tags from multiple instances just duplicate a few bytes, there's no JS cost). It's the one component in this library that can't be pure inline styles, since CSS animations require a stylesheet rule.
