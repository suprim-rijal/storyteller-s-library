# Storyteller's Library — Guidelines

## Components

The design system exports these components — import them from `@ws-qixgtx20gw4yqsd3pljk/171753e2-9ce5-4a2d-b0f2-356b45792c42` and compose them before building anything from scratch:

`Badge`, `Button`, `Card`, `ProgressBar`, `StatCard`

Per-component details (import stanzas, props, variants, examples) live in `.lovable/rules/libraries/{slug}/components.md` — on disk, not auto-loaded. Read that file or the component source when the name alone isn't enough.

## Theme Files

The design system's theme is delivered through the following files. The author's original source files carry the full wiring the design system needs — variable declarations, framework-specific directives, provider objects, etc. — and are the canonical import target.

- `@ws-qixgtx20gw4yqsd3pljk/171753e2-9ce5-4a2d-b0f2-356b45792c42/styles.css` (source — preferred import)
- `@ws-qixgtx20gw4yqsd3pljk/171753e2-9ce5-4a2d-b0f2-356b45792c42/dist/tokens.css` (auto-generated flat list of CSS custom properties — a raw-values fallback only; does NOT carry framework-specific wiring that the source files above provide)

