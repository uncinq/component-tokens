---
isIndex: false
title: Naming
description: The component token naming grammar, the rules behind it, and why colors invert the usual property order.
weight: 1
icon: tag
---

Every component token follows one pattern:

```
--{component}-{property}-{sub-property?}-{state?}
```

| Pattern | Example |
| --- | --- |
| `--{component}` | `--btn` |
| `--{component}-{property}` | `--btn-padding-inline` |
| `--{component}-{property}-{sub-property}` | `--btn-color-text-decoration` |
| `--{component}-{property}-{state}` | `--btn-color-background-hover` |

The property mirrors the CSS property name, so a token reads the same way as the declaration it controls. `--btn-padding-inline` drives `padding-inline`. Colors are the one exception, explained below.

## Rules

**Lowercase kebab-case**, always.

**Component name first**: `--btn-*`, `--badge-*`, `--hero-*`. This is what makes the tokens greppable and what keeps them sorted together in the generated CSS.

**Reference a semantic token whenever the value is a shared design decision.** Colors, spacing, radii, typography and motion should all be `var(--some-semantic-token)`, so that overriding the semantic layer moves every component at once.

About 80% of the tokens in this package do exactly that. The remaining fifth carry raw values, and legitimately so. They fall into four groups:

| Group | Examples |
| --- | --- |
| CSS keywords with no semantic equivalent | `transparent`, `none`, `solid`, `start`, `auto`, `underline` |
| Identity values | `--badge-border-width: 0`, `--container-max-width-mobile: 100%` |
| Geometry specific to one component | `--drawer-width: 320px`, `--dropdown-min-width: 12rem`, `--drawer-translate: translateX(100%)` |
| Content and computed values | `--breadcrumb-separator: "/"`, `--hero-height: clamp(...)`, `--hero-media-brightness: 0.5` |

The test to apply is whether another component would ever want the same value for the same reason. If yes, it belongs in the semantic layer and should be referenced from there. If no, a raw value here is correct, and inventing a semantic token for it would only add a hop that means nothing.

**States go last**: `-hover`, `-focus`, `-active`, `-disabled`.

**Alphabetical order within each group**, with a comment introducing each group once a component has many properties.

```css
/* Border */
--btn-border-radius: var(--radius-control);
--btn-border-width:  var(--border-width-sm);

/* Color */
--btn-color-background:      var(--color-brand);
--btn-color-border:          var(--color-brand);
--btn-color-text:            var(--color-text-on-brand);
--btn-color-text-decoration: transparent;

/* Spacing */
--btn-gap:            var(--spacing-xs);
--btn-padding-block:  var(--spacing-control);
--btn-padding-inline: var(--spacing-control);
```

## Why colors invert the order

For every other property the token mirrors the CSS property name. For colors it does not: `color` leads and the UI role follows.

| Token | Role | CSS property it drives |
| --- | --- | --- |
| `--btn-color-background` | background | `background-color` |
| `--btn-color-border` | border | `border-color` |
| `--btn-color-text` | text | `color` |
| `--btn-color-text-decoration` | text-decoration | `text-decoration-color` |
| `--form-color-accent` | accent | `color` |
| `--input-color-placeholder` | placeholder | `color` |

Writing `--btn-background-color` would have been more faithful to CSS, but it scatters a component's colors across the alphabet, between `--btn-border-radius` and `--btn-padding-block`. Leading with `color` groups them into one contiguous block in the generated file and in an editor's autocomplete.

It also makes the component token mirror the global one. `--color-background` becomes `--btn-color-background`, so the relationship between the two layers is visible in the name.

`background` is never abbreviated. It is `color-background`, never `color-bg`.

## The `default` convention

In the JSON source, a state lives in a nested key, and `default` is the unstated one. The build strips it from the generated name.

```json
{
  "btn": {
    "color": {
      "background": {
        "default": { "$value": "{color.brand.default}", "$type": "color" },
        "hover":   { "$value": "{color.brand.hover}",   "$type": "color" }
      }
    }
  }
}
```

produces:

```css
--btn-color-background: var(--color-brand);
--btn-color-background-hover: var(--color-brand-hover);
```

Note that the stripping happens on both sides. `{color.brand.default}` becomes `var(--color-brand)`, matching what `@uncinq/design-tokens` actually emits.

## Compound CSS properties

A CSS property with a hyphen is written in camelCase in JSON, and the build converts it back.

| JSON path | CSS custom property |
| --- | --- |
| `btn.paddingInline` | `--btn-padding-inline` |
| `btn.color.textDecoration` | `--btn-color-text-decoration` |
| `item.borderRadius` | `--item-border-radius` |

Use logical properties (`inline`, `block`, `inlineStart`, `blockEnd`) rather than physical ones (`left`, `right`, `top`, `bottom`), so that a component works in a right-to-left context without a second set of tokens. See [DTCG format](../dtcg/) for the full list of conventions.
