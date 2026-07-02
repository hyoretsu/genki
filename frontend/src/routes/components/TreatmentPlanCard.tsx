import { useTranslation } from "react-i18next";
import { HiBellAlert, HiCalendarDays, HiCheckCircle, HiClock } from "react-icons/hi2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TreatmentPlanCard() {
	const { t } = useTranslation();
	const schedule = t("home.treatment.schedule", { returnObjects: true }) as Array<{
		label: string;
		status: string;
		time: string;
	}>;

	return (
		<Card className="overflow-hidden">
			<CardHeader className="gap-4 border-b bg-secondary/55">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="space-y-2">
						<Badge>{t("home.treatment.badge")}</Badge>
						<div>
							<CardTitle className="text-2xl">{t("home.treatment.title")}</CardTitle>
							<CardDescription className="mt-2 max-w-xl">{t("home.treatment.description")}</CardDescription>
						</div>
					</div>
					<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<HiCalendarDays className="h-6 w-6" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-5 p-5 sm:p-6">
				<div className="grid gap-3 sm:grid-cols-3">
					<div className="rounded-md border bg-background p-3">
						<div className="flex items-center gap-2 font-semibold text-sm">
							<HiClock className="h-4 w-4 text-primary" />
							{t("home.treatment.nextLabel")}
						</div>
						<p className="mt-2 font-bold text-2xl">{t("home.treatment.nextTime")}</p>
					</div>
					<div className="rounded-md border bg-background p-3 sm:col-span-2">
						<div className="flex items-center gap-2 font-semibold text-sm">
							<HiBellAlert className="h-4 w-4 text-primary" />
							{t("home.treatment.instructionsLabel")}
						</div>
						<p className="mt-2 text-muted-foreground text-sm">{t("home.treatment.instructions")}</p>
					</div>
				</div>
				<div className="space-y-3">
					{schedule.map(item => (
						<div
							className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border bg-card px-3 py-3"
							key={`${item.time}-${item.label}`}
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
								<HiCheckCircle className="h-5 w-5" />
							</div>
							<div className="min-w-0">
								<p className="truncate font-semibold text-sm">{item.label}</p>
								<p className="text-muted-foreground text-xs">{item.status}</p>
							</div>
							<p className="font-bold text-sm tabular-nums">{item.time}</p>
						</div>
					))}
				</div>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button className="sm:flex-1" type="button">
						{t("home.treatment.primaryAction")}
					</Button>
					<Button className="sm:flex-1" type="button" variant="outline">
						{t("home.treatment.secondaryAction")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
