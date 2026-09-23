# @uncinq/component-tokens

> Component-scoped CSS design tokens for Un Cinq projects — layer 3 of the design token architecture.

<img width="1280" height="640" alt="share-component-tokens" src="https://github.com/user-attachments/assets/ef2387ee-2c45-4706-9e28-0f0341a100ed" />

Component tokens map semantic values onto the parts of a UI component. 26 components, 390 tokens, authored in [DTCG](https://tr.designtokens.org/format/) JSON and compiled to CSS custom properties.

## Installation

This package references semantic tokens from [@uncinq/design-tokens](https://github.com/uncinq/design-tokens), which must be imported first.

```bash
npm install @uncinq/design-tokens @uncinq/component-tokens
```

```css
@import '@uncinq/design-tokens';
@import '@uncinq/component-tokens';
```

Per component:

```css
@import '@uncinq/design-tokens';
@import '@uncinq/component-tokens/css/components/button.css';
```

Without a build step:

```html
<link rel="stylesheet" href="https://unpkg.com/@uncinq/design-tokens">
<link rel="stylesheet" href="https://unpkg.com/@uncinq/component-tokens">
```

## Where this sits

```
primitive   →   semantic   →   component
(raw values)    (purpose)      (this package)
```

```css
--color-sienna-600: oklch(0.53 0.195 22);    /* primitive */
--color-brand:      var(--color-sienna-600);  /* semantic  */
--btn-color-background: var(--color-brand);   /* component */
```

A component token answers **"which semantic value does this part of this component use?"**. The extra hop is what lets a project restyle buttons alone without moving the brand color, and what records accessibility decisions such as `--btn-color-text: var(--color-text-on-brand)`.

## Overriding

All tokens live in `@layer tokens`. Re-declare any of them after the import, same layer, later source order wins:

```css
@layer tokens {
  :root {
    --btn-color-background: var(--color-light);
    --btn-border-radius: 0;
  }
}
```

Because they are custom properties, a scoped override works too, and is usually the better tool for a contextual variation:

```css
.promo-section {
  --btn-color-background: var(--color-light);
}
```

## Components covered

`alert` `badge` `breadcrumb` `button` `card` `carousel` `container` `details` `drawer` `dropdown` `embed` `figure` `heading` `hero` `item` `items` `link` `list` `logo` `map` `media` `modal` `nav` `pagination` `surtitle` `table`

## Documentation

Full documentation: **[socle.uncinq.dev/docs/component-tokens/](https://socle.uncinq.dev/docs/component-tokens/)**

It is also versioned with the code in [`docs/`](docs/), and ships inside the npm package, so it is readable offline and from `node_modules`:

- [Naming](docs/naming.md) — the grammar, and why colors invert the property order
- [Customizing](docs/customizing.md) — which layer to override, and when to add a token
- [Reference](docs/reference.md) — every token for all 26 components, generated from the sources
- [DTCG format](docs/dtcg.md) — the authoring format
- [Style Dictionary](docs/style-dictionary.md) — the build and cross-package references

## Build

```bash
npm install     # @uncinq/design-tokens is required to resolve references
npm run build   # tokens/**/*.json → dist/css/**
```

Token files are discovered from disk, so adding `tokens/components/{name}.json` needs no other edit: both the component CSS and `dist/css/index.css` are regenerated. `dist/` is generated and committed, never edit it by hand.

## References

- [DTCG specification](https://tr.designtokens.org/format/) — W3C Community Group draft
- [`@uncinq/design-tokens`](https://github.com/uncinq/design-tokens) — primitive and semantic layers
- [`@uncinq/css-components`](https://github.com/uncinq/css-components) — the CSS consuming these tokens
- [MDN: CSS cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)

## License

MIT © [Un Cinq](https://uncinq.dev/)
