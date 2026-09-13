# RootBridge Platform Refactor

## Goal
Polish the learner experience around two clear destinations: the Language Learning Course and the Practice Garden, while strengthening multimodal lessons, achievements, and parent controls.

## What will change

### 1. Navigation and course structure
- Rework the child navbar around two primary destinations: Course and Practice Garden.
- Keep Class and Achievements as supporting destinations, with Profile separated from rewards.
- Add an accessible Nepali, Hindi, and English interface-language dropdown with a saved preference.
- Add an adult PIN prompt before leaving child mode, and keep active navigation states clear on every screen.
- Remove unnecessary motion and avoid transition libraries so route changes remain immediate.

### 2. Course map and module cleanup
- Rebuild the vertical course map with stable grid columns, aligned nodes, continuous connector lines, and clear mastered, active, available, and locked states.
- Standardize Devanagari and Latin typography, line height, and fallback fonts across learning screens.
- Simplify module pages by removing the redundant game-option panel and tightening lesson, review, and quest hierarchy.
- Rewrite visible copy to be warm and direct, removing em dashes and robotic phrasing.

### 3. Multimodal lessons and scoring
- Expand the exercise model to rotate through listening, typing, matra assembly, speaking, matching, and mini-game presentations.
- Add reliable browser speech playback with replay, pause, visible playback status, and written alternatives.
- Add keyboard and pointer interactions, accessible instructions, four-step hints, and reduced-motion behavior to every activity.
- Track accuracy, independence, matra placement, stroke/order awareness, and retries in the lesson summary instead of only correct/incorrect.
- Keep speaking feedback coaching-only and never block progress when microphone access is unavailable.

### 4. Achievements and profile
- Merge the current Treasures and badge collection into one Achievements & Badges page.
- Make the Profile page focus on learner identity, curated avatar selection, reading aids, and calm-mode preferences.
- Remove profile theme selection while preserving existing learner progress.

### 5. Parent controls and classroom joining
- Add a four-digit parent PIN setup/unlock flow and an email recovery screen.
- Add a parent-only progress reset confirmation.
- Show current modules and historical learning activity using clear charts and track-specific progress.
- Add classroom-code entry with validation and a safe linked/unlinked state.
- Use Lovable Cloud for secure PIN recovery, parent email, classroom membership, and cross-device progress. Keep child-facing progress usable while signed out.

### 6. Design-system and quality checks
- Add reusable Dialog, Dropdown Menu, Tabs, Progress, and Badge primitives inside the RootBridge design system and use them for interactive controls.
- Keep theme tokens self-contained for attached projects and correct dependency/version metadata where it applies to this locally authored system.
- Verify all content routes have unique metadata.
- Validate desktop and mobile flows in the browser, including navbar switching, map navigation, audio controls, lesson alternatives, PIN lock, profile avatars, achievements, reset confirmation, and classroom joining.

## Technical details
- Preserve TanStack Start routing and the existing curriculum data.
- Extend the local progress schema with migration-safe defaults for language, avatar, performance history, and active modules.
- Validate PIN, email, classroom codes, and exercise inputs on both client and server with Zod.
- Parent and classroom operations will use authenticated server functions; no private credential will be stored in browser storage.
- No hearts, lives, timers, ranking, punitive loss, or microphone-gated progression will be introduced.
