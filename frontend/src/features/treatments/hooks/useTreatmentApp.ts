import { useCallback, useMemo, useState } from "react";
import { getOccurrenceState } from "../domain/occurrences";
import type { OccurrenceState, TreatmentPlanInput } from "../domain/types";
import { notificationProvider, premiumProvider, syncProvider } from "../providers/adapters";
import { localTreatmentRepository } from "../providers/localRepository";

export function useTreatmentApp() {
	const [snapshot, setSnapshot] = useState(() => localTreatmentRepository.getSnapshot());

	const refresh = useCallback(() => {
		setSnapshot(localTreatmentRepository.getSnapshot());
	}, []);

	const todayOccurrences = useMemo(() => {
		const today = new Date().toDateString();
		return snapshot.occurrences
			.filter(occurrence => new Date(occurrence.scheduledAt).toDateString() === today)
			.map(occurrence => ({ ...occurrence, state: getOccurrenceState(occurrence) }))
			.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
	}, [snapshot.occurrences]);

	const activePlans = useMemo(
		() =>
			snapshot.plans
				.filter(plan => plan.state !== "archived")
				.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
		[snapshot.plans],
	);

	const createPlan = useCallback((input: TreatmentPlanInput) => {
		setSnapshot(localTreatmentRepository.createPlan(input));
	}, []);

	const updatePlan = useCallback((planId: string, input: TreatmentPlanInput) => {
		setSnapshot(localTreatmentRepository.updatePlan(planId, input));
	}, []);

	const setPlanState = useCallback(
		(planId: string, state: "active" | "paused" | "completed" | "archived") => {
			setSnapshot(localTreatmentRepository.setPlanState(planId, state));
			void notificationProvider.cancelPlanReminders(planId);
		},
		[],
	);

	const markOccurrence = useCallback(
		(
			occurrenceId: string,
			state: Exclude<OccurrenceState, "upcoming">,
			note?: string,
			scheduledAt?: string,
		) => {
			setSnapshot(localTreatmentRepository.markOccurrence(occurrenceId, state, note, scheduledAt));
		},
		[],
	);

	const requestNotifications = useCallback(async () => {
		const permission = await notificationProvider.requestPermission();
		setSnapshot(localTreatmentRepository.setNotificationPermission(permission));
	}, []);

	const purchasePremium = useCallback(async () => {
		const entitlement = await premiumProvider.purchaseMonthly();
		setSnapshot(localTreatmentRepository.setEntitlement(entitlement));
	}, []);

	const restorePremium = useCallback(async () => {
		const entitlement = await premiumProvider.restorePurchases();
		setSnapshot(localTreatmentRepository.setEntitlement(entitlement));
	}, []);

	const connectSync = useCallback(async (email: string) => {
		const cursor = await syncProvider.connect(email);
		setSnapshot(localTreatmentRepository.setSync(cursor));
	}, []);

	const disconnectSync = useCallback(async () => {
		const cursor = await syncProvider.disconnect();
		setSnapshot(localTreatmentRepository.setSync(cursor));
	}, []);

	const syncNow = useCallback(async () => {
		const result = await syncProvider.syncNow(localTreatmentRepository.getSnapshot());
		setSnapshot(
			localTreatmentRepository.applySyncResult(
				result.cursor,
				result.conflicts,
				result.plans,
				result.occurrences,
			),
		);
	}, []);

	const resolveConflict = useCallback((conflictId: string, winner: "local" | "remote") => {
		setSnapshot(localTreatmentRepository.resolveConflict(conflictId, winner));
	}, []);

	return {
		activePlans,
		connectSync,
		createPlan,
		disconnectSync,
		markOccurrence,
		purchasePremium,
		refresh,
		requestNotifications,
		resolveConflict,
		restorePremium,
		setPlanState,
		snapshot,
		syncNow,
		todayOccurrences,
		updatePlan,
	};
}
