# Style Dictionary — build pipeline

[Style Dictionary v5](https://styledictionary.com/) transforms the DTCG JSON token files into CSS custom properties.

## Run the build

```bash
npm run build
```

Output is written to `dist/css/component/`. One CSS file is generated per JSON source file.

```
tokens/component/button.json   →   dist/css/component/button.css
tokens/component/badge.json    →   dist/css/component/badge.css
```

`dist/css/index.css` is **not** auto-generated — it is maintained manually and must be updated when a new component is added.

---

## Cross-package references

Component tokens reference semantic tokens from `@uncinq/design-tokens` using DTCG `{dotted.path}` syntax:

```json
{
  "btn": {
    "border": {
      "radius": { "$value": "{radius.control}", "$type": "dimension" }
    }
  }
}
```

Style Dictionary cannot resolve these references at build time (they live in a separate package), so the build is configured with `log: { errors: { brokenReferences: 'console' } }` to allow it to continue. The format reads `token.original.$value` and converts references manually:

```
{radius.control}   →   var(--radius-control)
{color.text.muted} →   var(--color-text-muted)
```

Path segments named `default` are stripped, mirroring the `@uncinq/design-tokens` convention:

```
{color.brand.default}   →   var(--color-brand)
{color.text.default}    →   var(--color-text)
```

---

## Adding a new component

1. Create `tokens/component/{name}.json` with DTCG structure.
2. Run `npm run build` — `dist/css/component/{name}.css` is generated.
3. Add `@import 'component/{name}.css';` to `dist/css/index.css`.

---

## Token naming

Token JSON paths map directly to CSS custom property names. Use camelCase for compound CSS property names — the build converts them to kebab-case:

| JSON path | CSS variable |
| --- | --- |
| `btn.border.radius` | `--btn-border-radius` |
| `btn.color.background` | `--btn-color-background` |
| `btn.color.background.hover` | `--btn-color-background-hover` |
| `btn.color.textDecoration` | `--btn-color-text-decoration` |
| `btn.color.background.default` | `--btn-color-background` (default stripped) |
| `btn.text.decorationLine` | `--btn-text-decoration-line` |

States (`hover`, `active`, `focus`, `disabled`, `checked`) are nested one level deeper under the property group.

---

## References

- [Style Dictionary v5 docs](https://styledictionary.com/)
- [@uncinq/design-tokens](https://github.com/uncinq/design-tokens) — primitive and semantic tokens referenced by this package
