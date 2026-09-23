---
isIndex: false
title: Customizing
description: How to override a component token, which layer to reach for, and when a new token is warranted.
weight: 2
---

## CSS override

Every token is declared in `@layer tokens`, the lowest-priority layer in the recommended order. Re-declare any of them in your own `@layer tokens` block after the import. Same layer, later source order wins, and no specificity escalation is needed.

```css
@import '@uncinq/design-tokens';
@import '@uncinq/component-tokens';

@layer tokens {
  :root {
    --btn-color-background: var(--color-light);
    --btn-border-radius: 0;
    --hero-height: 80svh;
  }
}
```

## Choosing the right layer to override

This is the decision that matters, and it is easy to get wrong in a way that only shows up later.

| You want to change | Override | Effect |
| --- | --- | --- |
| The brand color everywhere | `--color-brand` (semantic) | Every component reading brand follows |
| Buttons only | `--btn-color-background` (component) | Buttons alone, brand untouched |
| One button variant | The variant's own token, or a local scope | Narrower still |

Reach for the **semantic** layer by default. Overriding a component token is the right call only when you genuinely mean "buttons differ from everything else here". Doing it because it was the first token you found produces a design system that drifts component by component, which is the exact failure mode the three-layer split exists to prevent.

## Scoped overrides

Because these are custom properties, they inherit. Setting one on a container rather than on `:root` restyles a region without a new class or a new token.

```css
.promo-section {
  --btn-color-background: var(--color-light);
  --btn-color-text: var(--color-text-on-light);
}
```

Every button inside `.promo-section` picks it up. This is usually better than inventing `--btn-promo-color-background`, because the variation is contextual rather than a new permanent concept.

Note that this works outside `@layer tokens` too. A scoped override is a normal declaration on a normal selector, so it competes on specificity like any other rule, not on layer order.

## Adding a token

Only add a component token when a component genuinely needs a knob that does not exist. Before doing so, check three things:

1. **Does a semantic token already express it?** If so, reference it rather than creating a new name.
2. **Does the semantic layer need it instead?** If two components would want the same value for the same reason, it belongs in [@uncinq/design-tokens](../../design-tokens/), not here.
3. **Does the name follow the grammar?** See [Naming](../naming/). A token that does not sort with its siblings will be missed by whoever looks for it next.

To add one, edit the JSON source and rebuild:

```bash
npm install
npm run build
```

Nothing else needs updating. Both the per-component CSS and `dist/css/index.css` are generated from files discovered on disk, so a new `tokens/components/*.json` is picked up automatically. See [Style Dictionary](../style-dictionary/).

## What not to do

**Do not edit `dist/`.** Every file there carries a generated header and is overwritten on the next build.

**Do not override a token to a raw value when a semantic one exists.** `--btn-color-background: #3f51b5` works, but it leaves dark mode, theming and contrast pairing behind. `var(--color-indigo-600)` keeps the value inside the system.

**Do not fork the package to change values.** The CSS override above exists so that you do not have to. A fork means inheriting the maintenance of 26 components for what is usually a handful of lines.
