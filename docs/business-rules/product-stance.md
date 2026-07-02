# Product Stance

Genki is an offline-first personal health tracking app. The app helps users define treatment plans, receive reminders, and track adherence without requiring an account, backend, or internet connection.

The first product area is treatment planning: "use X medication with Y instructions at Z time for B repetitions of C periods of time." Other health tracking areas may be added later, but they must follow the same offline-first rule unless a future business rule explicitly changes it.

Genki stores personal health data locally by default. Cloud sync is optional, user-controlled, and premium.

## Offline Storage

All v1 treatment planning and adherence tracking must work locally without internet.

Local data is the source of truth when sync is disabled. The user must be able to create, edit, pause, complete, archive, and review treatment plans while offline.

V1 stores treatment plans, generated occurrences, adherence history, notification schedule records, premium entitlement state, sync cursors, device identity, and sync conflicts in local app storage. The intended native store is local SQLite through the Tauri app layer; backend APIs are not part of the v1 source of truth.

The app should treat sync as a backup and multi-device convenience, not as required infrastructure for core health tracking.

## Health And Safety Boundaries

Genki is a tracking and reminder tool, not a medical authority.

The app must not diagnose, prescribe, change dosage, or tell users to ignore clinician instructions. User-entered instructions are treated as the user's source of truth.

Health copy must be calm and precise. Avoid shaming, urgency theater, or claims that Genki improves medical outcomes.

When safety-relevant ambiguity appears, the product should encourage users to follow their clinician's instructions or consult a qualified professional.
