export type PlanState = "active" | "paused" | "completed" | "archived";
export type OccurrenceState = "upcoming" | "taken" | "skipped" | "missed" | "rescheduled";
export type PeriodUnit = "day" | "week" | "month";
export type SyncState = "synced" | "pending" | "offline" | "conflict" | "error";
export type ConflictState = "open" | "resolvedLocal" | "resolvedRemote";
export type NotificationPermissionState = "unknown" | "granted" | "denied";
export type PremiumEntitlementState = "inactive" | "active" | "expired" | "dev";

export interface TreatmentPlan {
	id: string;
	name: string;
	instructions: string;
	scheduledTimes: string[];
	startDate: string;
	periodUnit: PeriodUnit;
	periodDuration: number;
	repetitionCount: number | null;
	ongoing: boolean;
	state: PlanState;
	createdAt: string;
	updatedAt: string;
}

export interface TreatmentOccurrence {
	id: string;
	planId: string;
	scheduledAt: string;
	originalScheduledAt: string;
	state: OccurrenceState;
	note: string;
	completedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PremiumEntitlement {
	state: PremiumEntitlementState;
	productId: string;
	expiresAt: string | null;
	updatedAt: string;
}

export interface SyncCursor {
	deviceId: string;
	state: SyncState;
	connectedEmail: string | null;
	lastSyncedAt: string | null;
	lastError: string | null;
	updatedAt: string;
}

export interface SyncConflict {
	id: string;
	recordType: "plan" | "occurrence";
	recordId: string;
	localVersion: TreatmentPlan | TreatmentOccurrence;
	remoteVersion: TreatmentPlan | TreatmentOccurrence;
	state: ConflictState;
	createdAt: string;
	resolvedAt: string | null;
}

export interface NotificationScheduleRecord {
	id: string;
	planId: string;
	occurrenceId: string;
	scheduledAt: string;
	providerId: string;
	createdAt: string;
}

export interface TreatmentRepositorySnapshot {
	plans: TreatmentPlan[];
	occurrences: TreatmentOccurrence[];
	entitlement: PremiumEntitlement;
	sync: SyncCursor;
	conflicts: SyncConflict[];
	notificationPermission: NotificationPermissionState;
}

export interface TreatmentPlanInput {
	name: string;
	instructions: string;
	scheduledTimes: string[];
	startDate: string;
	periodUnit: PeriodUnit;
	periodDuration: number;
	repetitionCount: number | null;
	ongoing: boolean;
}

export interface NotificationProvider {
	getPermission(): Promise<NotificationPermissionState>;
	requestPermission(): Promise<NotificationPermissionState>;
	cancelPlanReminders(planId: string): Promise<void>;
	reschedulePlanReminders(plan: TreatmentPlan, occurrences: TreatmentOccurrence[]): Promise<void>;
}

export interface PremiumProvider {
	getEntitlement(): Promise<PremiumEntitlement>;
	purchaseMonthly(): Promise<PremiumEntitlement>;
	restorePurchases(): Promise<PremiumEntitlement>;
}

export interface SyncProvider {
	connect(email: string): Promise<SyncCursor>;
	disconnect(): Promise<SyncCursor>;
	syncNow(snapshot: TreatmentRepositorySnapshot): Promise<{
		cursor: SyncCursor;
		conflicts: SyncConflict[];
		plans?: TreatmentPlan[];
		occurrences?: TreatmentOccurrence[];
	}>;
	resolveConflict(conflict: SyncConflict, winner: "local" | "remote"): Promise<SyncConflict>;
}
