import { createId, nowIso } from "./occurrences";
import type { SyncConflict, TreatmentOccurrence, TreatmentPlan } from "./types";

type SyncableRecord = TreatmentPlan | TreatmentOccurrence;

function isNewer(left: SyncableRecord, right: SyncableRecord) {
	return new Date(left.updatedAt).getTime() > new Date(right.updatedAt).getTime();
}

function sameRecord(left: SyncableRecord, right: SyncableRecord) {
	return JSON.stringify(left) === JSON.stringify(right);
}

export function mergeRecords<T extends SyncableRecord>(
	localRecords: T[],
	remoteRecords: T[],
	recordType: SyncConflict["recordType"],
) {
	const records = new Map<string, T>();
	const conflicts: SyncConflict[] = [];
	const remoteById = new Map(remoteRecords.map(record => [record.id, record]));

	for (const local of localRecords) {
		const remote = remoteById.get(local.id);
		if (!remote) {
			records.set(local.id, local);
			continue;
		}

		if (sameRecord(local, remote)) {
			records.set(local.id, local);
			continue;
		}

		const localChanged = Boolean(local.updatedAt);
		const remoteChanged = Boolean(remote.updatedAt);
		if (localChanged && remoteChanged && local.updatedAt !== remote.updatedAt) {
			conflicts.push({
				createdAt: nowIso(),
				id: createId("conflict"),
				localVersion: local,
				recordId: local.id,
				recordType,
				remoteVersion: remote,
				resolvedAt: null,
				state: "open",
			});
			records.set(local.id, isNewer(local, remote) ? local : remote);
			continue;
		}

		records.set(local.id, isNewer(local, remote) ? local : remote);
	}

	for (const remote of remoteRecords) {
		if (!records.has(remote.id)) records.set(remote.id, remote);
	}

	return {
		conflicts,
		records: [...records.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
	};
}

export function resolveConflictRecord(conflict: SyncConflict, winner: "local" | "remote"): SyncConflict {
	return {
		...conflict,
		resolvedAt: nowIso(),
		state: winner === "local" ? "resolvedLocal" : "resolvedRemote",
	};
}
