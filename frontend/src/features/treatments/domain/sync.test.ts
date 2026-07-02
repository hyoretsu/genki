import { describe, expect, test } from "bun:test";
import { mergeRecords, resolveConflictRecord } from "./sync";
import type { TreatmentPlan } from "./types";

const basePlan: TreatmentPlan = {
	createdAt: "2026-07-01T00:00:00.000Z",
	id: "plan_1",
	instructions: "Take with food.",
	name: "Plan",
	ongoing: true,
	periodDuration: 1,
	periodUnit: "day",
	repetitionCount: null,
	scheduledTimes: ["08:00"],
	startDate: "2026-07-01",
	state: "active",
	updatedAt: "2026-07-01T00:00:00.000Z",
};

describe("sync merge", () => {
	test("keeps both versions as an open conflict when local and remote diverge", () => {
		const local = { ...basePlan, name: "Local", updatedAt: "2026-07-02T00:00:00.000Z" };
		const remote = { ...basePlan, name: "Remote", updatedAt: "2026-07-03T00:00:00.000Z" };
		const result = mergeRecords([local], [remote], "plan");
		expect(result.conflicts).toHaveLength(1);
		expect(result.conflicts[0].localVersion).toEqual(local);
		expect(result.conflicts[0].remoteVersion).toEqual(remote);
	});

	test("marks conflict resolution winner", () => {
		const [conflict] = mergeRecords(
			[{ ...basePlan, name: "Local", updatedAt: "2026-07-02T00:00:00.000Z" }],
			[{ ...basePlan, name: "Remote", updatedAt: "2026-07-03T00:00:00.000Z" }],
			"plan",
		).conflicts;
		expect(resolveConflictRecord(conflict, "local").state).toBe("resolvedLocal");
		expect(resolveConflictRecord(conflict, "remote").state).toBe("resolvedRemote");
	});
});
