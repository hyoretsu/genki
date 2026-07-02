import { useTranslation } from "react-i18next";
import { LuArchive, LuPause, LuPlay, LuSquareCheckBig } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/Panel";
import type { PlanState, TreatmentPlan } from "@/features/treatments/domain/types";

interface PlansViewProps {
	onSetPlanState: (planId: string, state: PlanState) => void;
	plans: TreatmentPlan[];
}

export function PlansView({ onSetPlanState, plans }: PlansViewProps) {
	const { t } = useTranslation();

	return (
		<section className="space-y-4">
			<div>
				<h2 className="font-semibold text-2xl">{t("plans.title")}</h2>
				<p className="text-muted-foreground text-sm">{t("plans.description")}</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				{plans.map(plan => (
					<Panel className="p-5" key={plan.id}>
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="font-semibold text-lg">{plan.name}</p>
								<p className="mt-1 text-muted-foreground text-sm">{plan.instructions}</p>
							</div>
							<span className="rounded border border-border px-2 py-1 font-semibold text-xs">
								{t(`plan.state.${plan.state}`)}
							</span>
						</div>
						<dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
							<div>
								<dt className="text-muted-foreground">{t("plans.schedule")}</dt>
								<dd className="font-medium">{plan.scheduledTimes.join(", ")}</dd>
							</div>
							<div>
								<dt className="text-muted-foreground">{t("plans.duration")}</dt>
								<dd className="font-medium">
									{plan.ongoing
										? t("plans.ongoing")
										: t("plans.repetitions", {
												count: plan.repetitionCount ?? 0,
												unit: plan.periodUnit,
											})}
								</dd>
							</div>
						</dl>
						<div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
							<Button onClick={() => onSetPlanState(plan.id, "active")} size="sm" variant="outline">
								<LuPlay className="h-4 w-4" />
								{t("plans.actions.resume")}
							</Button>
							<Button onClick={() => onSetPlanState(plan.id, "paused")} size="sm" variant="outline">
								<LuPause className="h-4 w-4" />
								{t("plans.actions.pause")}
							</Button>
							<Button onClick={() => onSetPlanState(plan.id, "completed")} size="sm" variant="outline">
								<LuSquareCheckBig className="h-4 w-4" />
								{t("plans.actions.complete")}
							</Button>
							<Button onClick={() => onSetPlanState(plan.id, "archived")} size="sm" variant="outline">
								<LuArchive className="h-4 w-4" />
								{t("plans.actions.archive")}
							</Button>
						</div>
					</Panel>
				))}
			</div>
		</section>
	);
}
