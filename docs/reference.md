---
isIndex: false
title: Reference
description: Every token for all 26 components, generated from the JSON sources so it can never drift from the shipped CSS.
weight: 3
icon: table
---

Every table below is generated at build time from `dist/tokens.json`, which Style Dictionary produces from the same JSON sources as the CSS. Nothing here is written by hand, so a token cannot appear in the reference without existing in the package, or change value without the page changing with it.

Values are shown as they ship. A token that references a semantic token shows `var(--the-semantic-token)` rather than a resolved color or length, because that reference is what makes an override of the semantic layer propagate. See [Style Dictionary](../style-dictionary/) for why the build keeps it that way.

{{< alert-block state="info" >}}
Reading this offline, from the repository or from `node_modules`? The tables below are rendered by the documentation site. The same data, in machine-readable form, sits in `dist/tokens.json`, and the final CSS is in `dist/css/components/`.
{{< /alert-block >}}

### alert

Inline notification banner. 9 tokens.

{{< tokens pkg="component" file="components/alert" >}}

### badge

Badge, pill and tag. 12 tokens.

{{< tokens pkg="component" file="components/badge" >}}

### breadcrumb

Breadcrumb navigation. 10 tokens.

{{< tokens pkg="component" file="components/breadcrumb" >}}

### button

Button, all variants and sizes. 28 tokens.

{{< tokens pkg="component" file="components/button" >}}

### card

Card, an alias layer over item. 36 tokens.

{{< tokens pkg="component" file="components/card" >}}

### carousel

Carousel, arrows and pagination. 28 tokens.

{{< tokens pkg="component" file="components/carousel" >}}

### container

Layout container, max-widths and bleed. 17 tokens.

{{< tokens pkg="component" file="components/container" >}}

### details

Native details and accordion. 25 tokens.

{{< tokens pkg="component" file="components/details" >}}

### drawer

Off-canvas panel. 22 tokens.

{{< tokens pkg="component" file="components/drawer" >}}

### dropdown

Dropdown menu. 21 tokens.

{{< tokens pkg="component" file="components/dropdown" >}}

### embed

Video and iframe wrapper. 7 tokens.

{{< tokens pkg="component" file="components/embed" >}}

### figure

Figure and figcaption. 4 tokens.

{{< tokens pkg="component" file="components/figure" >}}

### heading

Heading typography scale. 3 tokens.

{{< tokens pkg="component" file="components/heading" >}}

### hero

Hero and banner section. 17 tokens.

{{< tokens pkg="component" file="components/hero" >}}

### item

Item, the canonical card-like unit. 55 tokens.

{{< tokens pkg="component" file="components/item" >}}

### items

Items grid and list wrapper. 3 tokens.

{{< tokens pkg="component" file="components/items" >}}

### link

Inline link. 4 tokens.

{{< tokens pkg="component" file="components/link" >}}

### list

Styled list. 6 tokens.

{{< tokens pkg="component" file="components/list" >}}

### logo

Logotype. 7 tokens.

{{< tokens pkg="component" file="components/logo" >}}

### map

Embedded map. 5 tokens.

{{< tokens pkg="component" file="components/map" >}}

### media

Media object, image plus text. 4 tokens.

{{< tokens pkg="component" file="components/media" >}}

### modal

Centered dialog. 21 tokens.

{{< tokens pkg="component" file="components/modal" >}}

### nav

Navigation bar. 15 tokens.

{{< tokens pkg="component" file="components/nav" >}}

### pagination

Pagination control. 17 tokens.

{{< tokens pkg="component" file="components/pagination" >}}

### surtitle

Small label above a heading. 8 tokens.

{{< tokens pkg="component" file="components/surtitle" >}}

### table

Data table. 6 tokens.

{{< tokens pkg="component" file="components/table" >}}
