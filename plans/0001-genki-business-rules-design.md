# Genki Business Rules And Design Plan

## Summary
- Replace placeholder business rules with a Genki v1 index and topical product/domain rule files.
- Create `DESIGN.md` for a calm, clinical, offline-first health tracking app.
- Apply a full visual pass to the current frontend template so first screen reflects Genki, while preserving route/provider infrastructure and avoiding backend work.
- Define notifications through a provider adapter: local scheduled reminders first, Firebase-capable push later.

## Key Changes
- Business rules:
  - Genki is offline-first and works without account, backend, or internet.
  - V1 treatment plans define medication, instructions, scheduled time(s), start date, duration period, repetition count, and adherence tracking.
  - Generated occurrences can be marked taken, skipped, missed, or rescheduled.
  - Premium is `$2.99/month`, mobile store IAP only for now, unlocking Google Drive sync/backup.
  - Leave room for future web/classic purchases without implementing them now.
- Notification contract:
  - Introduce notification providers as product architecture.
  - Local/native scheduled notification provider is required for offline reminders.
  - Firebase provider is allowed for future remote push paths, but cannot be the sole v1 reminder source without backend/network dependency.
- Design system:
  - Document ShadCN + Base UI usage, token ownership, component rules, health-state colors, accessibility, empty states, reminders, medication cards, and premium/sync UI.
  - Theme direction: warm clinical, low-noise, high trust, readable, mobile-first.
- Frontend visual pass:
  - Update Tailwind CSS variables, Base UI theme, and browser theme color.
  - Replace current template/home content with Genki-specific first-screen content for treatment planning, reminders, offline use, and premium sync.
  - Keep existing providers, router setup, app shell mechanics, generated API files, and backend untouched.

## Test Plan
- Run `bun run check-types`.
- Run affected frontend build, preferably from `frontend/` with `bun run build`.
- Verify docs contain no leftover template wording.
- Verify business rules are organized as an index plus multiple topical Markdown files.
- Verify no files under `frontend/src/lib/api/generated/` are edited.
- Manually inspect the first screen for responsive layout, readable text, no overlaps, and theme consistency.

## Execution

- [x] Create repo plan file.
- [x] Update business rules as an index plus topical Markdown files.
- [x] Create `DESIGN.md`.
- [x] Update Tailwind/Base UI/browser theme tokens.
- [x] Replace template home content with Genki first-screen content.
- [x] Run scoped verification.
- [x] Commit the completed task.

## Verification Result

- `bunx biome check` passed on touched docs, theme, i18n, and route files.
- `bun run check-types` and `bun run build` in `frontend/` are blocked because `frontend/src/lib/api/index.ts` imports missing generated module `./generated/api`.
- Headless Chrome rendered `http://127.0.0.1:5173/` and captured mobile/desktop screenshots with expected Genki treatment and premium sync content.

## Assumptions
- “Full visual pass” means updating the current visible frontend experience, not changing routing/provider infrastructure.
- No backend or cloud sender is implemented in this task.
- Firebase docs confirm FCM is remote push infrastructure; Tauri notification docs cover local notification capability:
  - https://firebase.google.com/docs/cloud-messaging/android/receive-messages
  - https://firebase.google.com/docs/cloud-messaging/ios/receive-messages
  - https://v2.tauri.app/plugin/notification/
