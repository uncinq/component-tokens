# @uncinq/component-tokens

> Component-scoped CSS design tokens for Un Cinq projects — layer 3 of the design token architecture.

<img width="1280" height="640" alt="share-component-tokens" src="https://github.com/user-attachments/assets/ef2387ee-2c45-4706-9e28-0f0341a100ed" />

## What are component tokens?

Component tokens are CSS custom properties scoped to a specific UI component. They sit at the top of the [DTCG](https://tr.designtokens.org/format/) three-layer model:

```text
primitive   →   semantic   →   component
(raw values)    (purpose)      (component-scoped)
```

Where primitive and semantic tokens are provided by [@uncinq/design-tokens](https://github.com/uncinq/design-tokens), component tokens map those semantic values to specific parts of a component:

```css
/* semantic token from @uncinq/design-tokens */
--color-brand: var(--color-indigo-600);

/* component token from @uncinq/component-tokens */
--btn-background-color: var(--color-brand);
```

A component token answers: **"which semantic value does this part of this component use?"**

---

## Naming convention

All component tokens follow the pattern: `--{component}-{property}-{sub-property?}-{state?}`

The property mirrors the CSS property name, so the token reads the same way as the CSS declaration it controls.

```text
--{component}                    --btn
  -{property}                    --btn-background-color
    -{sub-property}              --btn-text-decoration-color
      -{state}                   --btn-background-color-hover
```

### Rules

- **Lowercase kebab-case** — always
- **Component name first** — `--btn-*`, `--badge-*`, `--hero-*`
- **`color-[role]` for all color tokens** — `color` is the category prefix, the UI role follows: `color-background`, `color-border`, `color-text`, `color-accent`, `color-placeholder`. This groups all color tokens alphabetically under `color-*`. `background` is never abbreviated: `color-background` not `color-bg`.
- **States at the end** — `-hover`, `-focus`, `-active`, `-disabled`
- **Reference semantic tokens** — never raw values; always `var(--semantic-token)`
- **Alphabetical order** — tokens within a file are sorted alphabetically within each group; group related tokens with a comment when the component has many properties:

| Token | Role | CSS property |
| --- | --- | --- |
| `--btn-color-background` | background | `background-color` |
| `--btn-color-border` | border | `border-color` |
| `--btn-color-text` | text | `color` |
| `--btn-color-text-decoration` | text-decoration | `text-decoration-color` |
| `--form-color-accent` | accent | `color` |
| `--input-color-placeholder` | placeholder | `color` |

```css
/* Border */
--btn-border-radius: var(--radius-control);
--btn-border-width:  var(--border-width-normal);

/* Color */
--btn-color-background:      var(--color-brand);
--btn-color-border:          var(--color-brand);
--btn-color-text:            var(--color-text-on-brand);
--btn-color-text-decoration: transparent;

/* Spacing */
--btn-gap:       var(--spacing-xs);
--btn-padding-x: var(--spacing-control);
--btn-padding-y: var(--spacing-control);
```

### Examples

```css
--btn-color-background: var(--color-brand);
--btn-color-border:     var(--color-brand);
--btn-color-text:       var(--color-text-on-brand);
--btn-border-radius:    var(--radius-control);
--btn-padding-x:        var(--spacing-control);
--btn-padding-y:        var(--spacing-control);

--badge-border-radius:   var(--radius-sm);
--badge-color-background: var(--color-background-muted);

--hero-color-background: var(--color-background);
--hero-color-text:       var(--color-text);
--hero-min-height:       50svh;
```

---

## CSS cascade layers

All tokens are declared inside `@layer config`, the lowest-priority layer in the stack. This means any project can override any token simply by declaring its own `@layer config` block after this package:

```css
@import '@uncinq/component-tokens';

/* your project overrides — same layer, wins by source order */
@layer config {
  :root {
    --btn-color-background: var(--color-secondary);
    --hero-min-height: 80svh;
  }
}
```

---

## Prerequisites

This package references semantic tokens from [@uncinq/design-tokens](https://github.com/uncinq/design-tokens). Import it before this package:

```css
@import '@uncinq/design-tokens';
@import '@uncinq/component-tokens';
```

---

## Installation

```bash
npm install @uncinq/component-tokens
# or
yarn add @uncinq/component-tokens
```

### Usage — full import

```css
@import '@uncinq/design-tokens';
@import '@uncinq/component-tokens';
```

### Usage — per component

```css
@import '@uncinq/design-tokens';
@import '@uncinq/component-tokens/css/component/button.css';
@import '@uncinq/component-tokens/css/component/badge.css';
```

### Usage — CDN (no build step)

```html
<link rel="stylesheet" href="https://unpkg.com/@uncinq/design-tokens">
<link rel="stylesheet" href="https://unpkg.com/@uncinq/component-tokens">
```

---

## Customization

### CSS override (recommended)

Re-declare any token inside `@layer config` after the import. Same layer, later source order wins:

```css
@import '@uncinq/component-tokens';

@layer config {
  :root {
    --btn-color-background: var(--color-secondary);
    --btn-border-radius: 0;
  }
}
```

### JSON + rebuild

For deeper changes (adding new tokens, renaming), fork the JSON source files and run the build pipeline locally:

```bash
npm install
npm run build   # generates dist/css/component/*.css
```

See [docs/STYLE-DICTIONARY.md](docs/STYLE-DICTIONARY.md) for build pipeline details and token naming conventions.

---

## File structure

```text
tokens/                     ← DTCG JSON source files (edit these)
  component/
    alert.json
    badge.json
    button.json
    …

dist/css/                   ← generated CSS (do not edit)
  index.css                 ← imports all component token files
  component/
    alert.css               ← alert / notification banner
    badge.css               ← badge / pill / tag
    breadcrumb.css          ← breadcrumb navigation
    button.css              ← button (all variants)
    card.css                ← card (alias → item tokens)
    container.css           ← layout container + grid columns
    details.css             ← <details> / accordion
    drawer.css              ← off-canvas panel / drawer
    dropdown.css            ← dropdown menu
    embed.css               ← video / iframe embed wrapper
    figure.css              ← <figure> + <figcaption>
    heading.css             ← heading typography scale
    hero.css                ← hero / banner section
    item.css                ← item (canonical card-like unit)
    items.css               ← items grid / list wrapper
    link.css                ← inline link
    list.css                ← styled list
    logo.css                ← logotype
    map.css                 ← embedded map
    media.css               ← media object (image + text)
    nav.css                 ← navigation bar
    pagination.css          ← pagination control
    surtitle.css            ← small label above a heading
    table.css               ← data table
```

---

## References

- [DTCG specification](https://tr.designtokens.org/format/) — W3C Community Group draft
- [@uncinq/design-tokens](https://github.com/uncinq/design-tokens) — primitive + semantic layers
- [MDN: CSS cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)
