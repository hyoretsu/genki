import { useTranslation } from "react-i18next";
import { LuCheck, LuClock, LuForward, LuX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/Panel";
import { toDateLabel, toTimeLabel } from "@/features/treatments/domain/occurrences";
import type { OccurrenceState, TreatmentOccurrence, TreatmentPlan } from "@/features/treatments/domain/types";

interface TodayViewProps {
	onMark: (
		occurrenceId: string,
		state: Exclude<OccurrenceState, "upcoming">,
		note?: string,
		scheduledAt?: string,
	) => void;
	occurrences: TreatmentOccurrence[];
	plans: TreatmentPlan[];
}

export function TodayView({ occurrences, onMark, plans }: TodayViewProps) {
	const { t } = useTranslation();
	const plansById = new Map(plans.map(plan => [plan.id, plan]));

	return (
		<section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
			<div className="space-y-4">
				<div>
					<h2 className="font-semibold text-2xl">{t("today.title")}</h2>
					<p className="text-muted-foreground text-sm">{t("today.description")}</p>
				</div>
				{occurrences.length === 0 ? (
					<Panel className="p-5">
						<p className="font-medium">{t("today.emptyTitle")}</p>
						<p className="mt-1 text-muted-foreground text-sm">{t("today.emptyDescription")}</p>
					</Panel>
				) : (
					<div className="space-y-3">
						{occurrences.map(occurrence => {
							const plan = plansById.get(occurrence.planId);
							return (
								<Panel className="p-4" key={occurrence.id}>
									<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
										<div className="min-w-0">
											<p className="text-muted-foreground text-xs">{toDateLabel(occurrence.scheduledAt)}</p>
											<h3 className="mt-1 font-semibold text-lg">{plan?.name ?? t("today.unknownPlan")}</h3>
											<p className="mt-1 text-sm">{plan?.instructions}</p>
											<p className="mt-2 inline-flex rounded border border-border px-2 py-1 font-semibold text-xs">
												<LuClock className="mr-1 h-4 w-4" />
												{toTimeLabel(occurrence.scheduledAt)} · {t(`occurrence.state.${occurrence.state}`)}
											</p>
										</div>
										<div className="grid grid-cols-3 gap-2 sm:w-[290px]">
											<Button onClick={() => onMark(occurrence.id, "taken")} size="sm">
												<LuCheck className="h-4 w-4" />
												{t("today.actions.taken")}
											</Button>
											<Button onClick={() => onMark(occurrence.id, "skipped")} size="sm" variant="outline">
												<LuX className="h-4 w-4" />
												{t("today.actions.skip")}
											</Button>
											<Button
												onClick={() =>
													onMark(
														occurrence.id,
														"rescheduled",
														"",
														new Date(Date.now() + 30 * 60 * 1000).toISOString(),
													)
												}
												size="sm"
												variant="outline"
											>
												<LuForward className="h-4 w-4" />
												{t("today.actions.reschedule")}
											</Button>
										</div>
									</div>
								</Panel>
							);
						})}
					</div>
				)}
			</div>
			<Panel className="h-fit p-5">
				<p className="font-semibold text-lg">{t("today.safetyTitle")}</p>
				<p className="mt-2 text-muted-foreground text-sm">{t("today.safetyDescription")}</p>
			</Panel>
		</section>
	);
}
