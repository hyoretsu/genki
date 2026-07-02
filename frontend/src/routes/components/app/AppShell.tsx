import type { ComponentType, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { LuBell, LuCalendarDays, LuPlus, LuRefreshCw } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SyncState } from "@/features/treatments/domain/types";
import type { AppView } from "./types";

interface AppShellProps {
	children: ReactNode;
	openConflicts: number;
	onNavigate: (view: AppView) => void;
	syncState: SyncState;
	view: AppView;
}

type NavLabelKey = "app.nav.newPlan" | "app.nav.plans" | "app.nav.sync" | "app.nav.today";

const navItems = [
	{ icon: LuCalendarDays, labelKey: "app.nav.today", view: "today" },
	{ icon: LuBell, labelKey: "app.nav.plans", view: "plans" },
	{ icon: LuPlus, labelKey: "app.nav.newPlan", view: "new-plan" },
	{ icon: LuRefreshCw, labelKey: "app.nav.sync", view: "settings" },
] satisfies Array<{ icon: ComponentType<{ className?: string }>; labelKey: NavLabelKey; view: AppView }>;

export function AppShell({ children, onNavigate, openConflicts, syncState, view }: AppShellProps) {
	const { t } = useTranslation();

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
			<header className="flex flex-col gap-4 border-border border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="font-bold text-3xl tracking-normal">{t("app.name")}</h1>
						<Badge>{t(`sync.state.${syncState}`)}</Badge>
						{openConflicts > 0 ? (
							<Badge className="border-amber-400/40 bg-amber-400/10 text-amber-200">
								{openConflicts} conflicts
							</Badge>
						) : null}
					</div>
					<p className="mt-2 max-w-2xl text-muted-foreground text-sm">{t("app.tagline")}</p>
				</div>
				<nav className="grid grid-cols-2 gap-2 sm:flex">
					{navItems.map(item => {
						const Icon = item.icon;
						return (
							<Button
								aria-current={view === item.view ? "page" : undefined}
								key={item.view}
								onClick={() => onNavigate(item.view)}
								variant={view === item.view ? "default" : "outline"}
							>
								<Icon className="h-4 w-4" />
								{t(item.labelKey)}
							</Button>
						);
					})}
				</nav>
			</header>
			{children}
		</div>
	);
}
