import {
	generateFutureOccurrences,
	nowIso,
	preserveCompletedHistory,
	transitionOccurrence,
} from "../domain/occurrences";
import type {
	NotificationPermissionState,
	OccurrenceState,
	PremiumEntitlement,
	SyncConflict,
	SyncCursor,
	TreatmentOccurrence,
	TreatmentPlan,
	TreatmentPlanInput,
	TreatmentRepositorySnapshot,
} from "../domain/types";

const storageKey = "genki:v1:treatments";

interface PersistedState extends TreatmentRepositorySnapshot {}

function defaultEntitlement(): PremiumEntitlement {
	return {
		expiresAt: null,
		productId: "genki_premium_monthly",
		state: "inactive",
		updatedAt: nowIso(),
	};
}

function defaultSync(): SyncCursor {
	return {
		connectedEmail: null,
		deviceId: crypto.randomUUID(),
		lastError: null,
		lastSyncedAt: null,
		state: "offline",
		updatedAt: nowIso(),
	};
}

function defaultState(): PersistedState {
	return {
		conflicts: [],
		entitlement: defaultEntitlement(),
		notificationPermission: "unknown",
		occurrences: [],
		plans: [],
		sync: defaultSync(),
	};
}

function readState(): PersistedState {
	if (typeof localStorage === "undefined") return defaultState();
	const raw = localStorage.getItem(storageKey);
	if (!raw) return seedState();
	try {
		return { ...defaultState(), ...JSON.parse(raw) };
	} catch {
		return seedState();
	}
}

function writeState(state: PersistedState) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(storageKey, JSON.stringify(state));
}

function seedState() {
	const timestamp = nowIso();
	const nextDose = new Date(Date.now() + 30 * 60 * 1000);
	const nextDoseTime = nextDose.toTimeString().slice(0, 5);
	const plan: TreatmentPlan = {
		createdAt: timestamp,
		id: "plan_seed_amoxicillin",
		instructions: "Take with food and a full glass of water.",
		name: "Amoxicillin 500 mg",
		ongoing: false,
		periodDuration: 1,
		periodUnit: "day",
		repetitionCount: 7,
		scheduledTimes: [nextDoseTime, "14:00", "21:00"],
		startDate: new Date().toISOString().slice(0, 10),
		state: "active",
		updatedAt: timestamp,
	};
	const state = defaultState();
	state.plans = [plan];
	state.occurrences = generateFutureOccurrences(plan, [], new Date(), 21);
	writeState(state);
	return state;
}

export class LocalTreatmentRepository {
	getSnapshot(): TreatmentRepositorySnapshot {
		const state = readState();
		const occurrences: TreatmentOccurrence[] = [];
		for (const plan of state.plans) {
			const planOccurrences = state.occurrences.filter(occurrence => occurrence.planId === plan.id);
			occurrences.push(...generateFutureOccurrences(plan, planOccurrences));
		}
		const snapshot = { ...state, occurrences };
		writeState(snapshot);
		return snapshot;
	}

	createPlan(input: TreatmentPlanInput): TreatmentRepositorySnapshot {
		const state = readState();
		const timestamp = nowIso();
		const plan: TreatmentPlan = {
			...input,
			createdAt: timestamp,
			id: crypto.randomUUID(),
			state: "active",
			updatedAt: timestamp,
		};
		state.plans = [...state.plans, plan];
		state.occurrences = [...state.occurrences, ...generateFutureOccurrences(plan)];
		state.sync = markPending(state.sync);
		writeState(state);
		return this.getSnapshot();
	}

	updatePlan(planId: string, input: TreatmentPlanInput): TreatmentRepositorySnapshot {
		const state = readState();
		const timestamp = nowIso();
		state.plans = state.plans.map(plan =>
			plan.id === planId ? { ...plan, ...input, updatedAt: timestamp } : plan,
		);
		const plan = state.plans.find(each => each.id === planId);
		if (plan) {
			const otherOccurrences = state.occurrences.filter(occurrence => occurrence.planId !== planId);
			const planOccurrences = state.occurrences.filter(occurrence => occurrence.planId === planId);
			state.occurrences = [...otherOccurrences, ...preserveCompletedHistory(plan, planOccurrences)];
		}
		state.sync = markPending(state.sync);
		writeState(state);
		return this.getSnapshot();
	}

	setPlanState(planId: string, stateValue: TreatmentPlan["state"]): TreatmentRepositorySnapshot {
		const state = readState();
		state.plans = state.plans.map(plan =>
			plan.id === planId ? { ...plan, state: stateValue, updatedAt: nowIso() } : plan,
		);
		state.sync = markPending(state.sync);
		writeState(state);
		return this.getSnapshot();
	}

	markOccurrence(
		occurrenceId: string,
		stateValue: Exclude<OccurrenceState, "upcoming">,
		note = "",
		scheduledAt?: string,
	): TreatmentRepositorySnapshot {
		const state = readState();
		state.occurrences = state.occurrences.map(occurrence =>
			occurrence.id === occurrenceId
				? transitionOccurrence(occurrence, stateValue, note, scheduledAt)
				: occurrence,
		);
		state.sync = markPending(state.sync);
		writeState(state);
		return this.getSnapshot();
	}

	setNotificationPermission(permission: NotificationPermissionState): TreatmentRepositorySnapshot {
		const state = readState();
		state.notificationPermission = permission;
		writeState(state);
		return this.getSnapshot();
	}

	setEntitlement(entitlement: PremiumEntitlement): TreatmentRepositorySnapshot {
		const state = readState();
		state.entitlement = entitlement;
		if (entitlement.state === "expired" || entitlement.state === "inactive") {
			state.sync = { ...state.sync, state: "offline", updatedAt: nowIso() };
		}
		writeState(state);
		return this.getSnapshot();
	}

	setSync(sync: SyncCursor, conflicts: SyncConflict[] = []): TreatmentRepositorySnapshot {
		const state = readState();
		state.sync = sync;
		state.conflicts = mergeConflicts(state.conflicts, conflicts);
		writeState(state);
		return this.getSnapshot();
	}

	applySyncResult(
		sync: SyncCursor,
		conflicts: SyncConflict[] = [],
		plans?: TreatmentPlan[],
		occurrences?: TreatmentOccurrence[],
	): TreatmentRepositorySnapshot {
		const state = readState();
		state.sync = sync;
		state.conflicts = mergeConflicts(state.conflicts, conflicts);
		if (plans) state.plans = plans;
		if (occurrences) state.occurrences = occurrences;
		writeState(state);
		return this.getSnapshot();
	}

	resolveConflict(conflictId: string, winner: "local" | "remote"): TreatmentRepositorySnapshot {
		const state = readState();
		const conflict = state.conflicts.find(each => each.id === conflictId);
		if (!conflict) return this.getSnapshot();
		const resolvedAt = nowIso();
		const winnerRecord = winner === "local" ? conflict.localVersion : conflict.remoteVersion;
		if (conflict.recordType === "plan") {
			state.plans = state.plans.map(plan =>
				plan.id === winnerRecord.id ? (winnerRecord as TreatmentPlan) : plan,
			);
		} else {
			state.occurrences = state.occurrences.map(occurrence =>
				occurrence.id === winnerRecord.id ? (winnerRecord as TreatmentOccurrence) : occurrence,
			);
		}
		state.conflicts = state.conflicts.map(each =>
			each.id === conflictId
				? { ...each, resolvedAt, state: winner === "local" ? "resolvedLocal" : "resolvedRemote" }
				: each,
		);
		state.sync = markPending({
			...state.sync,
			state: state.conflicts.some(each => each.state === "open") ? "conflict" : "pending",
		});
		writeState(state);
		return this.getSnapshot();
	}
}

function markPending(sync: SyncCursor): SyncCursor {
	return {
		...sync,
		state: sync.connectedEmail ? "pending" : "offline",
		updatedAt: nowIso(),
	};
}

function mergeConflicts(current: SyncConflict[], incoming: SyncConflict[]) {
	const byKey = new Map(
		current.map(conflict => [`${conflict.recordType}:${conflict.recordId}:${conflict.state}`, conflict]),
	);
	for (const conflict of incoming) {
		byKey.set(`${conflict.recordType}:${conflict.recordId}:${conflict.state}`, conflict);
	}
	return [...byKey.values()];
}

export const localTreatmentRepository = new LocalTreatmentRepository();
