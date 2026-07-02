import { useTranslation } from "react-i18next";
import { LuCheck } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/Panel";
import type { SyncConflict } from "@/features/treatments/domain/types";

interface ConflictReviewProps {
	conflicts: SyncConflict[];
	onResolve: (conflictId: string, winner: "local" | "remote") => void;
}

export function ConflictReview({ conflicts, onResolve }: ConflictReviewProps) {
	const { t } = useTranslation();
	const openConflicts = conflicts.filter(conflict => conflict.state === "open");
	if (openConflicts.length === 0) return null;

	return (
		<section className="space-y-3">
			<h2 className="font-semibold text-xl">{t("conflicts.title")}</h2>
			{openConflicts.map(conflict => (
				<Panel className="grid gap-4 p-4 md:grid-cols-2" key={conflict.id}>
					<div>
						<p className="font-semibold">{t("conflicts.local")}</p>
						<pre className="mt-2 overflow-auto rounded border border-border bg-muted p-3 text-xs">
							{JSON.stringify(conflict.localVersion, null, 2)}
						</pre>
						<Button className="mt-3" onClick={() => onResolve(conflict.id, "local")} size="sm">
							<LuCheck className="h-4 w-4" />
							{t("conflicts.keepLocal")}
						</Button>
					</div>
					<div>
						<p className="font-semibold">{t("conflicts.remote")}</p>
						<pre className="mt-2 overflow-auto rounded border border-border bg-muted p-3 text-xs">
							{JSON.stringify(conflict.remoteVersion, null, 2)}
						</pre>
						<Button
							className="mt-3"
							onClick={() => onResolve(conflict.id, "remote")}
							size="sm"
							variant="outline"
						>
							<LuCheck className="h-4 w-4" />
							{t("conflicts.keepRemote")}
						</Button>
					</div>
				</Panel>
			))}
		</section>
	);
}
