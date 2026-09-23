---
isIndex: false
title: Style Dictionary
description: How component token JSON is compiled to CSS, and how cross-package references to design-tokens are resolved.
weight: 5
---


[Style Dictionary v5](https://styledictionary.com/) transforms the DTCG JSON token files into CSS custom properties.

## Run the build

```bash
npm run build
```

Output is written to `dist/css/components/`. One CSS file is generated per JSON source file.

```
tokens/components/button.json   →   dist/css/components/button.css
tokens/components/badge.json    →   dist/css/components/badge.css
```

`dist/css/index.css` is auto-generated too, in a step that runs after Style Dictionary. It discovers the token files from disk, so adding a JSON source needs no manual edit anywhere. Each generated file declares its own `@layer tokens`, which is why a plain `@import` is enough and no `layer()` qualifier is used.

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

The design-tokens sources are loaded as `include`, from `node_modules/@uncinq/design-tokens/tokens`, so these references do resolve at build time. The build fails fast with a clear message if that package is missing:

```js
const designTokensPath = './node_modules/@uncinq/design-tokens/tokens';
if (!fs.existsSync(designTokensPath)) {
  throw new Error('Missing @uncinq/design-tokens — run npm install first.');
}
```

Resolution is only used for validation, though. The output deliberately keeps the reference rather than the resolved value: the format reads `token.original.$value` and rewrites the DTCG reference as a CSS `var()`.

```
{radius.control}   →   var(--radius-control)
{color.text.muted} →   var(--color-text-muted)
```

That is what makes the layering work at runtime. A project that overrides `--color-brand` moves every component token pointing at it, because the component CSS still says `var(--color-brand)` rather than a baked-in color.

`log: { errors: { brokenReferences: 'console' } }` remains set as a safety net, so a typo in a reference reports on the console instead of aborting the whole build.

Path segments named `default` are stripped, mirroring the `@uncinq/design-tokens` convention:

```
{color.brand.default}   →   var(--color-brand)
{color.text.default}    →   var(--color-text)
```

---

## Adding a new component

1. Create `tokens/components/{name}.json` with DTCG structure.
2. Run `npm run build`.

That is the whole procedure. `dist/css/components/{name}.css` is generated, and the `@import` is added to `dist/css/index.css` automatically, because both the build and the index step discover token files from disk rather than from a hardcoded list.

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

---

## The JSON manifest

Alongside the CSS, the build writes `dist/tokens.json`: a flat array of every token the package ships.

```json
[
  {
    "name": "--btn-color-background",
    "value": "var(--color-brand)",
    "type": "color",
    "file": "components/button",
    "description": ""
  }
]
```

The documentation site renders its reference tables from this file, which is why the reference cannot drift from the stylesheets.

The guarantee comes from a single shared function. `tokenToCssValue()` serializes a token to its CSS value, and **both** the CSS format and the manifest format call it. There is no second implementation of the naming or the value logic to fall out of step, and the build asserts the equivalence: the manifest holds exactly one entry per declaration emitted in `dist/css/`, with the same name and the same value.

`description` comes from the DTCG `$description` key. Adding one to a token source makes it appear in the published reference with no other change.
