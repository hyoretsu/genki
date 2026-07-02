import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
	const { t } = useTranslation();
	const metrics = t("home.hero.metrics", { returnObjects: true }) as string[];

	return (
		<header className="grid gap-6 py-3 lg:grid-cols-[1fr_auto] lg:items-end">
			<div className="space-y-4">
				<Badge>{t("home.hero.badge")}</Badge>
				<div className="space-y-3">
					<h1 className="max-w-3xl font-bold text-4xl tracking-tight sm:text-5xl">{t("home.hero.title")}</h1>
					<p className="max-w-2xl text-lg text-muted-foreground">{t("home.hero.description")}</p>
				</div>
			</div>
			<div className="grid gap-2 sm:grid-cols-3 lg:w-80 lg:grid-cols-1">
				{metrics.map(metric => (
					<div className="rounded-md border bg-card px-3 py-2 font-medium text-sm shadow-sm" key={metric}>
						{metric}
					</div>
				))}
			</div>
		</header>
	);
}
