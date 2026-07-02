# Notifications

Genki uses a notification-provider contract.

The local/native scheduled notification provider is required for v1 treatment reminders. It is the baseline provider because reminders must work without a backend and should continue as reliably as the operating system allows while the app is foregrounded, backgrounded, or restarted.

V1 reminder scheduling is driven from local treatment occurrences. The app stores enough local schedule metadata to cancel or reschedule future reminders when a plan is paused, completed, archived, or edited.

Firebase-capable remote push is allowed as a future provider for cloud-driven reminders, cross-device events, or remote notification delivery. Firebase must not be the only v1 reminder path because a fully offline app with no backend cannot rely on remote push delivery for scheduled treatment reminders.

## Rules

- Users must grant notification permission before reminders are scheduled.
- Denied permissions must not block treatment-plan creation.
- The app should explain that reminders require OS notification permission.
- Disabling a plan cancels future reminders for that plan.
- Editing a plan reschedules future reminders for that plan.
- Notification content should include treatment name and concise timing context, but avoid exposing unnecessary health detail on the lock screen.

## Provider Roles

Local/native scheduled notifications are for treatment reminders that can be calculated on device.

Firebase-capable remote push is for future cloud-triggered notifications. It may support cross-device events or cloud sync status, but it cannot become the only reminder source while Genki remains offline-first with no backend.
