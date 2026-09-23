---
isIndex: false
title: component-tokens
description: Component-scoped CSS design tokens, layer 3 of the architecture, mapping semantic values onto the parts of a component.
weight: 3
icon: puzzle
---

Component tokens are CSS custom properties scoped to a single UI component. They sit at the top of the [DTCG](dtcg/) three-layer model.

```
primitive   →   semantic   →   component
(raw values)    (purpose)      (component-scoped)
```

Where primitive and semantic tokens come from [@uncinq/design-tokens](../design-tokens/), component tokens map those semantic values onto specific parts of a component.

```css
/* semantic token, from @uncinq/design-tokens */
--color-brand: var(--color-sienna-600);

/* component token, from this package */
--btn-color-background: var(--color-brand);
```

A component token answers **"which semantic value does this part of this component use?"**.

## Why the indirection is worth it

A component could read `--color-brand` directly. The extra hop buys two things.

**A seam to override.** A project can restyle buttons alone by setting `--btn-color-background`, without touching the brand color and therefore without moving every other branded element.

**A place to record intent.** `--btn-color-text: var(--color-text-on-brand)` documents that button text has to contrast against the brand color, which is an accessibility decision. Read directly, that decision would be invisible.

The rule that keeps the indirection honest: a component token **always references a semantic token**, never a raw value and never a primitive. When you find yourself wanting a raw value, the semantic layer is usually missing a token.

## What is covered

26 components, one JSON source and one generated CSS file each, 390 tokens in total.

| | | |
| --- | --- | --- |
| `alert` | `figure` | `map` |
| `badge` | `heading` | `media` |
| `breadcrumb` | `hero` | `modal` |
| `button` | `item` | `nav` |
| `card` | `items` | `pagination` |
| `carousel` | `link` | `surtitle` |
| `container` | `list` | `table` |
| `details` | `logo` | |
| `drawer` | | |
| `dropdown` | | |
| `embed` | | |

`card` is an alias layer over `item`, which is the canonical card-like unit. See the [Reference](reference/) for what each one actually declares.

## Installation

This package resolves its references against `@uncinq/design-tokens`, which must be imported first.

```bash
npm install @uncinq/design-tokens @uncinq/component-tokens
```

```css
@import '@uncinq/design-tokens';
@import '@uncinq/component-tokens';
```

Per component, when you only need a few:

```css
@import '@uncinq/design-tokens';
@import '@uncinq/component-tokens/css/components/button.css';
@import '@uncinq/component-tokens/css/components/badge.css';
```

Without a build step:

```html
<link rel="stylesheet" href="https://unpkg.com/@uncinq/design-tokens">
<link rel="stylesheet" href="https://unpkg.com/@uncinq/component-tokens">
```

Import order matters here in a way it does not for most packages. These tokens are `var()` references, resolved by the browser at use time rather than at import time, so a missing design-tokens import does not error: it silently yields invalid values and unstyled components.

## Where to go next

| Page | Covers |
| --- | --- |
| [Naming](naming/) | The naming grammar and the rules that keep it consistent |
| [Customizing](customizing/) | Overriding a component token, and when to add one |
| [Reference](reference/) | Every token for all 26 components, generated from the sources |
| [DTCG format](dtcg/) | The authoring format, including group-level types |
| [Style Dictionary](style-dictionary/) | The build, and how cross-package references resolve |

## References

- [@uncinq/design-tokens](https://github.com/uncinq/design-tokens), the primitive and semantic layers
- [@uncinq/css-components](https://github.com/uncinq/css-components), the CSS that consumes these tokens
- [DTCG specification](https://tr.designtokens.org/format/)
