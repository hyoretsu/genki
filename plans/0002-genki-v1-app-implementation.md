# Genki V1 App Implementation Plan

## Summary

Build Genki v1 as a local-only Tauri app. Core treatment planning, reminders, adherence tracking, Premium entitlement, and Google Drive sync run without backend dependency. Local app storage is the source of truth; native SQLite is the target persistence layer, with provider boundaries for notifications, mobile IAP, and Google Drive sync.

## Implementation

- Replace the static Genki preview with app screens for Today, treatment plans, plan creation, notification permission, Premium, Google Drive sync, and conflict review.
- Add local domain types for plan state, occurrence state, period unit, sync state, conflict state, notification permission, Premium entitlement, treatment plans, occurrences, sync cursors, notification schedules, and conflicts.
- Add occurrence generation that preserves completed history, updates only future occurrences after plan edits, marks missed occurrences without shaming copy, and supports pause/resume/complete/archive flows.
- Add provider interfaces for notifications, Premium, and sync. V1 UI uses dev-safe local adapters while keeping native Tauri integration points isolated.
- Add manual conflict review: divergent local and Drive records keep both versions and require the user to choose local or remote.
- Rename remaining Tauri template metadata to Genki.

## Tests

- Unit tests cover occurrence generation, completed-history preservation, paused plans, sync conflict detection, and conflict resolution.
- Verification commands:
  - `bun test frontend/src/features/treatments/domain`
  - `bun run check-types`
  - `bun run build`

## Assumptions

- Backend APIs and the SQL workspace package are not part of the v1 user-facing app path.
- Google Drive sync is gated by Premium and uses app-owned Drive storage in the native adapter.
- Release builds must use real mobile IAP; development builds may use a clearly marked developer entitlement.
- Firebase remains a future remote push provider only.
