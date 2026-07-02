import { useState } from "react";
import { useTreatmentApp } from "@/features/treatments/hooks/useTreatmentApp";
import { AppShell } from "./AppShell";
import { ConflictReview } from "./ConflictReview";
import { PlanFormView } from "./PlanFormView";
import { PlansView } from "./PlansView";
import { SettingsView } from "./SettingsView";
import { TodayView } from "./TodayView";
import type { AppView } from "./types";

export function GenkiApp() {
	const [view, setView] = useState<AppView>("today");
	const app = useTreatmentApp();
	const openConflicts = app.snapshot.conflicts.filter(conflict => conflict.state === "open").length;

	return (
		<AppShell
			onNavigate={setView}
			openConflicts={openConflicts}
			syncState={app.snapshot.sync.state}
			view={view}
		>
			<div className="space-y-6">
				<ConflictReview conflicts={app.snapshot.conflicts} onResolve={app.resolveConflict} />
				{view === "today" ? (
					<TodayView
						occurrences={app.todayOccurrences}
						onMark={app.markOccurrence}
						plans={app.snapshot.plans}
					/>
				) : null}
				{view === "plans" ? <PlansView onSetPlanState={app.setPlanState} plans={app.activePlans} /> : null}
				{view === "new-plan" ? <PlanFormView onCreatePlan={app.createPlan} /> : null}
				{view === "settings" ? (
					<SettingsView
						entitlement={app.snapshot.entitlement}
						notificationPermission={app.snapshot.notificationPermission}
						onConnectSync={app.connectSync}
						onDisconnectSync={app.disconnectSync}
						onPurchasePremium={app.purchasePremium}
						onRequestNotifications={app.requestNotifications}
						onRestorePremium={app.restorePremium}
						onSyncNow={app.syncNow}
						sync={app.snapshot.sync}
					/>
				) : null}
			</div>
		</AppShell>
	);
}
