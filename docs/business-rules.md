# Business Rules

This file is the index and LLM routing guide for Genki product and domain rules. The actual rules are organized in topical Markdown files under `docs/business-rules/`.

## Usage Guide

- For broad product, domain modeling, requirements, or epic planning, read every file listed below.
- For focused changes, read the matching topical file first, then read adjacent topics if the change crosses boundaries.
- Keep objective blocking rules separate from softer guidance.
- Do not invent product rules. If a rule is missing, surface the open point in the relevant file.
- Add new business-rule topics as new Markdown files instead of expanding this index into a long rule document.

## Topics

- [Product stance](business-rules/product-stance.md): Genki's offline-first product boundaries and safety posture.
- [Treatment plans](business-rules/treatment-plans.md): Plan structure, occurrence generation, adherence states, and edit behavior.
- [Notifications](business-rules/notifications.md): Notification-provider contract, local reminders, and Firebase-capable future push.
- [Premium and sync](business-rules/premium-and-sync.md): Premium pricing, mobile IAP, Google Drive sync, and future web purchases.
