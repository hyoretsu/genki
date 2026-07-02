import { describe, expect, test } from "bun:test";
import { generateFutureOccurrences, preserveCompletedHistory, transitionOccurrence } from "./occurrences";
import type { TreatmentPlan } from "./types";

const plan: TreatmentPlan = {
	createdAt: "2026-07-01T00:00:00.000Z",
	id: "plan_1",
	instructions: "Take with food.",
	name: "Amoxicillin",
	ongoing: false,
	periodDuration: 1,
	periodUnit: "day",
	repetitionCount: 3,
	scheduledTimes: ["08:00", "20:00"],
	startDate: "2026-07-01",
	state: "active",
	updatedAt: "2026-07-01T00:00:00.000Z",
};

describe("generateFutureOccurrences", () => {
	test("generates occurrences for each scheduled time and repetition", () => {
		const occurrences = generateFutureOccurrences(plan, [], new Date("2026-07-01T00:00:00.000Z"));
		expect(occurrences).toHaveLength(6);
		expect(occurrences.map(occurrence => occurrence.state)).toEqual(Array(6).fill("upcoming"));
	});

	test("keeps completed history when plan schedule changes", () => {
		const [first] = generateFutureOccurrences(plan, [], new Date("2026-07-01T00:00:00.000Z"));
		const taken = transitionOccurrence(first, "taken", "No issue.");
		const updatedPlan = { ...plan, scheduledTimes: ["09:00"] };
		const occurrences = preserveCompletedHistory(updatedPlan, [taken], new Date("2026-07-01T00:00:00.000Z"));
		expect(occurrences.some(occurrence => occurrence.id === taken.id && occurrence.state === "taken")).toBe(
			true,
		);
		expect(occurrences.some(occurrence => occurrence.originalScheduledAt.endsWith("09:00:00.000Z"))).toBe(
			true,
		);
	});

	test("does not generate reminders for paused plans", () => {
		const occurrences = generateFutureOccurrences(
			{ ...plan, state: "paused" },
			[],
			new Date("2026-07-01T00:00:00.000Z"),
		);
		expect(occurrences).toEqual([]);
	});
});
