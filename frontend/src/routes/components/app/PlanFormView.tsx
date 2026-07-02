import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuPlus } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import type { PeriodUnit, TreatmentPlanInput } from "@/features/treatments/domain/types";

interface PlanFormViewProps {
	onCreatePlan: (input: TreatmentPlanInput) => void;
}

const periodOptions: Array<{ label: string; value: PeriodUnit }> = [
	{ label: "Day", value: "day" },
	{ label: "Week", value: "week" },
	{ label: "Month", value: "month" },
];

export function PlanFormView({ onCreatePlan }: PlanFormViewProps) {
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [instructions, setInstructions] = useState("");
	const [scheduledTimes, setScheduledTimes] = useState("08:00, 20:00");
	const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
	const [periodUnit, setPeriodUnit] = useState<PeriodUnit>("day");
	const [periodDuration, setPeriodDuration] = useState("1");
	const [repetitionCount, setRepetitionCount] = useState("7");
	const [ongoing, setOngoing] = useState(false);

	function submit() {
		const times = scheduledTimes
			.split(",")
			.map(time => time.trim())
			.filter(Boolean);
		if (!name.trim() || !instructions.trim() || times.length === 0) return;
		onCreatePlan({
			instructions: instructions.trim(),
			name: name.trim(),
			ongoing,
			periodDuration: Number.parseInt(periodDuration, 10) || 1,
			periodUnit,
			repetitionCount: ongoing ? null : Number.parseInt(repetitionCount, 10) || 1,
			scheduledTimes: times,
			startDate,
		});
		setName("");
		setInstructions("");
	}

	return (
		<section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
			<div>
				<h2 className="font-semibold text-2xl">{t("planForm.title")}</h2>
				<p className="mt-1 text-muted-foreground text-sm">{t("planForm.description")}</p>
			</div>
			<Panel className="space-y-4 p-5">
				<TextField
					label={t("planForm.fields.name")}
					onValueChange={setName}
					placeholder="Ex: Amoxicillin 500 mg"
					value={name}
				/>
				<TextField
					label={t("planForm.fields.instructions")}
					onValueChange={setInstructions}
					placeholder="Ex: Take with food and water"
					value={instructions}
				/>
				<TextField
					label={t("planForm.fields.times")}
					onValueChange={setScheduledTimes}
					placeholder="08:00, 14:00, 21:00"
					value={scheduledTimes}
				/>
				<div className="grid gap-4 sm:grid-cols-2">
					<TextField
						label={t("planForm.fields.startDate")}
						onValueChange={setStartDate}
						placeholder="2026-07-01"
						value={startDate}
					/>
					<div>
						<p className="mb-2 font-bold text-muted-foreground text-xs uppercase">
							{t("planForm.fields.periodUnit")}
						</p>
						<CustomSelect
							onChange={value => setPeriodUnit(value as PeriodUnit)}
							options={periodOptions}
							value={periodUnit}
						/>
					</div>
					<TextField
						inputMode="numeric"
						label={t("planForm.fields.periodDuration")}
						onValueChange={setPeriodDuration}
						placeholder="1"
						value={periodDuration}
					/>
					<TextField
						disabled={ongoing}
						inputMode="numeric"
						label={t("planForm.fields.repetitions")}
						onValueChange={setRepetitionCount}
						placeholder="7"
						value={repetitionCount}
					/>
				</div>
				<label className="flex items-center gap-3 rounded border border-border p-3 text-sm">
					<input
						checked={ongoing}
						className="h-4 w-4"
						onChange={event => setOngoing(event.currentTarget.checked)}
						type="checkbox"
					/>
					{t("planForm.fields.ongoing")}
				</label>
				<Button onClick={submit}>
					<LuPlus className="h-4 w-4" />
					{t("planForm.actions.create")}
				</Button>
			</Panel>
		</section>
	);
}
