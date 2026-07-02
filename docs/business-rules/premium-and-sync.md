# Premium And Sync

Genki Premium costs `$2.99/month`.

For now, premium is sold through mobile store in-app purchases only. The entitlement unlocks Google Drive sync/backup. Core local treatment planning, reminders, and adherence tracking remain free.

V1 must gate Google Drive sync behind a real mobile store purchase/restore path for release builds. Local development may use a clearly marked developer entitlement so sync flows can be tested without app-store transactions.

The product architecture should leave room for future classic web purchases or checkout flows, but v1 must not require a web purchase flow.

## Premium Rules

- Free users can use all local treatment planning features.
- Premium users can connect Google Drive sync/backup.
- Losing premium access must not delete local data.
- If premium expires, local data remains available and sync pauses.
- Purchase and restore actions must use mobile store IAP on mobile builds.

## Google Drive Sync

Google Drive sync is a premium feature. The intended v1 sync target is the user's own Google Drive account.

Sync must be explicit. The user chooses to enable it, and the app should show sync status clearly.

Sync rules:

- Sync is not required for local use.
- Sync should never overwrite local changes without conflict handling.
- Sync status should distinguish synced, pending, offline, conflict, and error states.
- V1 sync is bidirectional across the user's devices. When local and remote records diverge, Genki must keep both versions, mark the affected record as a conflict, and require manual review before either version is applied.
- Sync errors must not block treatment reminders or local adherence tracking.
