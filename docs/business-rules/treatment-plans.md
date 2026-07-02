# Treatment Plans

A treatment plan describes an intended medication or treatment routine. A valid plan must have:

- Medication or treatment name.
- User-visible instructions.
- One or more scheduled times.
- Start date.
- Period unit and period duration.
- Repetition count, unless the user marks the plan as ongoing.

Examples of period units include day, week, and month. Examples of repetitions include "3 times per day for 7 days" and "once per week for 8 weeks."

The app must preserve the user's wording for instructions. Genki can offer structured fields for schedule calculation, but it must not rewrite medical instructions in a way that could change their meaning.

## Plan States

A plan can be active, paused, completed, or archived:

- Active plans generate upcoming occurrences and reminders.
- Paused plans keep history but do not generate new reminders until resumed.
- Completed plans keep history and no longer generate reminders.
- Archived plans stay out of primary views but remain available in history.

Editing a plan must not silently rewrite completed occurrence history. If an edit changes future scheduling, the app should apply it to future occurrences and keep past adherence records intact.

## Treatment Occurrences

A treatment occurrence is a scheduled instance generated from a treatment plan. Occurrences are local records and can exist without network access.

An occurrence can be:

- Upcoming: scheduled for the future.
- Taken: user confirmed the medication/treatment was taken.
- Skipped: user intentionally skipped it.
- Missed: scheduled time passed without confirmation.
- Rescheduled: user moved it to another time.

The app should allow a user to add a note when marking an occurrence taken, skipped, missed, or rescheduled.

Missed status is a tracking state, not a punishment. The interface must avoid shaming language.
