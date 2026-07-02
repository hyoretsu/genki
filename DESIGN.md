# Genki Design System

Genki should feel calm, clinical, and human. It is a health tracking tool for repeated daily use, so the interface should prioritize readability, low cognitive load, trust, and fast confirmation over marketing polish.

## Foundations

Use ShadCN-style local primitives as the default component model and Base UI for complex accessible primitives where the app already depends on it. Tailwind CSS variables in `frontend/src/globals.css` are the design-token source for custom UI. Base UI theme values in `frontend/src/lib/baseui-theme.ts` must stay visually aligned with those tokens.

Design direction:

- Warm clinical, not sterile.
- Quiet surfaces with strong information hierarchy.
- Mobile-first controls sized for touch.
- No decorative wellness clichés, gradient blobs, or ornamental cards.
- Rounded corners stay restrained: `8px` or less.
- Icons communicate state and action; labels carry medical clarity.

## Color

The palette uses a warm paper background, ink foreground, green primary, blue sync accent, amber caution, and red destructive state.

Semantic use:

- Primary green: treatment actions, active plans, positive adherence.
- Blue accent: sync, backup, Google Drive, cross-device status.
- Amber: pending reminders, paused plans, restore warnings.
- Red: destructive actions, missed critical setup, permission problems.
- Muted neutrals: secondary text, inactive metadata, dividers.

Do not use raw backend enum values as user-facing labels. Translate status values before rendering them.

## Typography

Use Inter for all product UI. Keep type compact and readable:

- Page titles: strong, brief, and grounded in the task.
- Section headings: direct nouns such as "Today", "Treatment plan", "Sync".
- Body copy: short sentences with medical precision.
- Labels: explicit and example-led.

Avoid oversized hero typography inside tool surfaces. Treatment cards, forms, and reminder rows should use dense but scannable text.

## Layout

Mobile is the primary layout. The first screen should immediately show Genki as a treatment and reminder app, not a generic landing page.

Use:

- Full-width page bands or unframed constrained layouts for sections.
- Cards for individual treatment plans, reminders, premium offers, and modal content.
- Stable dimensions for status chips, icon buttons, reminder rows, and repeated cards.
- Clear separation between today's schedule, plan setup, and sync/premium status.

Do not nest cards inside cards. Do not hide the product behind generic onboarding copy.

## Components

Component conventions:

- Add ShadCN components through the ShadCN CLI.
- Prefer local primitives in `frontend/src/components/ui/` for reusable UI.
- Use Base UI where it provides stronger accessible behavior for overlays, modals, menus, or complex controls.
- Keep private page components colocated in a `components/` folder beside the route.
- Keep each component in its own PascalCase file unless a file intentionally uses a composition pattern.

Forms:

- Do not use native number inputs; use text inputs with parsing and `inputMode`.
- Structured values need placeholders and masks where appropriate.
- Text inputs and textareas should debounce parent updates with `useDebouncedInput`.
- Use `CustomSelect` instead of native `select`.
- Use app dialogs instead of `alert()` or `confirm()`.

Buttons:

- Primary: create/save treatment, mark taken, enable sync.
- Outline: secondary navigation and cancel-like actions.
- Destructive: delete/archive confirmation only.
- Avoid ghost buttons except icon-only toolbars with clear hover states.

## Treatment UI

Treatment cards should show:

- Medication or treatment name.
- Next scheduled time.
- Instructions summary.
- Adherence state for the current occurrence.
- Actions to mark taken, skip, reschedule, pause, or edit.

Occurrence states:

- Upcoming: neutral.
- Taken: primary green.
- Skipped: muted neutral.
- Missed: red, but written without shame.
- Rescheduled: blue accent.
- Paused: amber.

Copy examples:

- "Next dose at 21:00"
- "Take with food"
- "Paused until resumed"
- "Missed at 08:00"

## Notifications

Reminder permission UI should be clear and non-blocking. Denied permission should explain what is unavailable without preventing treatment-plan creation.

Notification setup screens should distinguish:

- Local reminders: scheduled on this device.
- Firebase-capable push: future remote provider for cloud-triggered notifications.
- Sync: Google Drive backup, not required for reminders.

## Premium And Sync UI

Premium should be framed as backup and continuity, not as access to health tracking.

Premium offer copy:

- "$2.99/month"
- "Google Drive sync and backup"
- "Local treatment tracking stays free"

Sync states:

- Synced: blue accent with calm confirmation.
- Pending: amber with short context.
- Offline: muted or amber depending on user action needed.
- Conflict: amber/red depending on data risk.
- Error: red with recoverable next step.

The product should leave room for future web purchases, but mobile builds use store IAP actions first.

## Accessibility

Maintain strong contrast in light and dark themes. Touch targets should be at least 40px high and preferably 44px for primary mobile actions.

Use semantic headings, button elements for actions, and visible focus rings. Do not rely on color alone for treatment or sync status.

Health reminders must avoid alarming phrasing unless the user authored the phrase. Use calm wording and clear recovery actions.
