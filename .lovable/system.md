# RootBridge design system

RootBridge is a warm, calm learning system for children and their caregivers. Use plain, encouraging language and treat mistakes as useful practice. Never add rankings, streak pressure, lives, countdowns, or punitive loss.

## Foundations

- Build with React, TypeScript, Tailwind CSS, and the components exported from the RootBridge barrel.
- Use semantic color, type, radius, and shadow tokens. Do not introduce raw visual values in product components.
- Use Nunito for Latin text and Noto Sans Devanagari for Nepali and Hindi. Keep both scripts clear and consistent.
- Child surfaces use soft corners, generous targets, playful pastel accents, and short direct copy. Parent surfaces are calmer and more analytical.
- Keep navigation immediate. Avoid decorative route transitions and honor reduced-motion preferences.

## Components

- Compose Button, Card, Badge, Progress, Dialog, DropdownMenu, and Tabs before creating new primitives.
- Use semantic HTML, visible keyboard focus, descriptive labels, and at least 44px touch targets for core child actions.
- Every audio-led task also needs written instructions, replay and pause controls, a pointer alternative, and a keyboard alternative.
- Speaking practice must remain optional and must never block progress when a microphone is unavailable.

## Voice

Write warmly and directly. Avoid em dashes, robotic summaries, vague praise, and competitive language. Explain the next action in one short sentence.