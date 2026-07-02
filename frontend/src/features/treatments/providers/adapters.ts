import { nowIso } from "../domain/occurrences";
import { mergeRecords, resolveConflictRecord } from "../domain/sync";
import type {
	NotificationPermissionState,
	NotificationProvider,
	PremiumEntitlement,
	PremiumProvider,
	SyncConflict,
	SyncCursor,
	SyncProvider,
	TreatmentRepositorySnapshot,
} from "../domain/types";

function isTauriRuntime() {
	return "__TAURI_INTERNALS__" in window;
}

export class LocalNotificationProvider implements NotificationProvider {
	async getPermission(): Promise<NotificationPermissionState> {
		if (!("Notification" in window)) return "unknown";
		if (Notification.permission === "granted") return "granted";
		if (Notification.permission === "denied") return "denied";
		return "unknown";
	}

	async requestPermission(): Promise<NotificationPermissionState> {
		if (!("Notification" in window)) return "denied";
		const permission = await Notification.requestPermission();
		return permission === "granted" ? "granted" : permission === "denied" ? "denied" : "unknown";
	}

	async cancelPlanReminders(_planId: string): Promise<void> {
		return;
	}

	async reschedulePlanReminders(): Promise<void> {
		return;
	}
}

export class MobilePremiumProvider implements PremiumProvider {
	async getEntitlement(): Promise<PremiumEntitlement> {
		return {
			expiresAt: null,
			productId: "genki_premium_monthly",
			state: import.meta.env.DEV ? "dev" : "inactive",
			updatedAt: nowIso(),
		};
	}

	async purchaseMonthly(): Promise<PremiumEntitlement> {
		return {
			expiresAt: null,
			productId: "genki_premium_monthly",
			state: import.meta.env.DEV || !isTauriRuntime() ? "dev" : "active",
			updatedAt: nowIso(),
		};
	}

	async restorePurchases(): Promise<PremiumEntitlement> {
		return this.purchaseMonthly();
	}
}

export class GoogleDriveSyncProvider implements SyncProvider {
	async connect(email: string): Promise<SyncCursor> {
		return {
			connectedEmail: email,
			deviceId: getDeviceId(),
			lastError: null,
			lastSyncedAt: null,
			state: "pending",
			updatedAt: nowIso(),
		};
	}

	async disconnect(): Promise<SyncCursor> {
		return {
			connectedEmail: null,
			deviceId: getDeviceId(),
			lastError: null,
			lastSyncedAt: null,
			state: "offline",
			updatedAt: nowIso(),
		};
	}

	async syncNow(snapshot: TreatmentRepositorySnapshot): Promise<{
		cursor: SyncCursor;
		conflicts: SyncConflict[];
		plans?: TreatmentRepositorySnapshot["plans"];
		occurrences?: TreatmentRepositorySnapshot["occurrences"];
	}> {
		if (snapshot.entitlement.state !== "active" && snapshot.entitlement.state !== "dev") {
			return {
				conflicts: [],
				cursor: {
					...snapshot.sync,
					lastError: "Premium is required for Google Drive sync.",
					state: "error",
					updatedAt: nowIso(),
				},
			};
		}

		const remote = readRemoteSnapshot();
		if (!remote) {
			writeRemoteSnapshot(snapshot);
			return {
				conflicts: [],
				cursor: {
					...snapshot.sync,
					lastError: null,
					lastSyncedAt: nowIso(),
					state: "synced",
					updatedAt: nowIso(),
				},
			};
		}

		const planMerge = mergeRecords(snapshot.plans, remote.plans, "plan");
		const occurrenceMerge = mergeRecords(snapshot.occurrences, remote.occurrences, "occurrence");
		const conflicts = [...planMerge.conflicts, ...occurrenceMerge.conflicts];
		const nextSnapshot = {
			...snapshot,
			occurrences: occurrenceMerge.records,
			plans: planMerge.records,
		};
		writeRemoteSnapshot(nextSnapshot);

		return {
			conflicts,
			cursor: {
				...snapshot.sync,
				lastError: null,
				lastSyncedAt: nowIso(),
				state: conflicts.length > 0 ? "conflict" : "synced",
				updatedAt: nowIso(),
			},
			occurrences: occurrenceMerge.records,
			plans: planMerge.records,
		};
	}

	async resolveConflict(conflict: SyncConflict, winner: "local" | "remote") {
		return resolveConflictRecord(conflict, winner);
	}
}

function getDeviceId() {
	const key = "genki:v1:device-id";
	const existing = localStorage.getItem(key);
	if (existing) return existing;
	const next = crypto.randomUUID();
	localStorage.setItem(key, next);
	return next;
}

function readRemoteSnapshot(): TreatmentRepositorySnapshot | null {
	const raw = localStorage.getItem("genki:v1:drive-snapshot");
	return raw ? JSON.parse(raw) : null;
}

function writeRemoteSnapshot(snapshot: TreatmentRepositorySnapshot) {
	localStorage.setItem("genki:v1:drive-snapshot", JSON.stringify(snapshot));
}

export const notificationProvider = new LocalNotificationProvider();
export const premiumProvider = new MobilePremiumProvider();
export const syncProvider = new GoogleDriveSyncProvider();
