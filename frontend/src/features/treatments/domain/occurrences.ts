import type { OccurrenceState, PeriodUnit, TreatmentOccurrence, TreatmentPlan } from "./types";

const dayMs = 24 * 60 * 60 * 1000;

export function createId(prefix: string) {
	return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export function nowIso() {
	return new Date().toISOString();
}

export function parseLocalDateTime(date: string, time: string) {
	return new Date(`${date}T${time}:00`);
}

export function toDateInputValue(date: Date) {
	return date.toISOString().slice(0, 10);
}

export function toTimeLabel(iso: string) {
	return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function toDateLabel(iso: string) {
	return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" }).format(new Date(iso));
}

export function addPeriod(date: Date, unit: PeriodUnit, duration: number) {
	const next = new Date(date);
	if (unit === "day") next.setDate(next.getDate() + duration);
	if (unit === "week") next.setDate(next.getDate() + duration * 7);
	if (unit === "month") next.setMonth(next.getMonth() + duration);
	return next;
}

export function getOccurrenceState(
	occurrence: TreatmentOccurrence,
	referenceDate = new Date(),
): OccurrenceState {
	if (occurrence.state !== "upcoming") return occurrence.state;
	return new Date(occurrence.scheduledAt).getTime() < referenceDate.getTime() ? "missed" : "upcoming";
}

export function generateFutureOccurrences(
	plan: TreatmentPlan,
	existing: TreatmentOccurrence[] = [],
	referenceDate = new Date(),
	windowDays = 45,
) {
	if (plan.state !== "active") return existing;

	const preserved = existing.filter(occurrence => occurrence.state !== "upcoming");
	const existingKeys = new Set(existing.map(occurrence => occurrence.originalScheduledAt));
	const generated: TreatmentOccurrence[] = [];
	const now = nowIso();
	const windowEnd = new Date(referenceDate.getTime() + windowDays * dayMs);
	const periodTotal = plan.ongoing ? Number.POSITIVE_INFINITY : (plan.repetitionCount ?? 0);

	for (let periodIndex = 0; periodIndex < periodTotal; periodIndex += 1) {
		const periodDate = addPeriod(
			parseLocalDateTime(plan.startDate, "00:00"),
			plan.periodUnit,
			plan.periodDuration * periodIndex,
		);
		if (periodDate > windowEnd) break;

		for (const time of plan.scheduledTimes) {
			const scheduled = parseLocalDateTime(toDateInputValue(periodDate), time);
			if (scheduled < referenceDate && scheduled.toDateString() !== referenceDate.toDateString()) continue;
			const iso = scheduled.toISOString();
			if (existingKeys.has(iso)) continue;
			generated.push({
				completedAt: null,
				createdAt: now,
				id: createId("occ"),
				note: "",
				originalScheduledAt: iso,
				planId: plan.id,
				scheduledAt: iso,
				state: "upcoming",
				updatedAt: now,
			});
		}
	}

	return [...preserved, ...generated].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
}

export function preserveCompletedHistory(
	plan: TreatmentPlan,
	occurrences: TreatmentOccurrence[],
	referenceDate = new Date(),
) {
	return generateFutureOccurrences(plan, occurrences, referenceDate);
}

export function transitionOccurrence(
	occurrence: TreatmentOccurrence,
	state: Exclude<OccurrenceState, "upcoming">,
	note = "",
	scheduledAt?: string,
): TreatmentOccurrence {
	const timestamp = nowIso();
	return {
		...occurrence,
		completedAt: timestamp,
		note,
		scheduledAt: scheduledAt ?? occurrence.scheduledAt,
		state,
		updatedAt: timestamp,
	};
}
