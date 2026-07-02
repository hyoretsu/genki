import { useTranslation } from "react-i18next";
import { HiCloudArrowUp, HiDevicePhoneMobile, HiShieldCheck } from "react-icons/hi2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SyncPremiumCard() {
	const { t } = useTranslation();
	const syncItems = t("home.sync.items", { returnObjects: true }) as Array<{
		description: string;
		title: string;
	}>;

	return (
		<Card className="h-full">
			<CardHeader className="gap-4">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-2">
						<Badge>{t("home.sync.badge")}</Badge>
						<div>
							<CardTitle>{t("home.sync.title")}</CardTitle>
							<CardDescription className="mt-2">{t("home.sync.description")}</CardDescription>
						</div>
					</div>
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
						<HiCloudArrowUp className="h-6 w-6" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-5">
				<div className="rounded-md border bg-background p-4">
					<div className="flex items-center gap-2 font-semibold">
						<HiShieldCheck className="h-5 w-5 text-primary" />
						{t("home.sync.price")}
					</div>
					<p className="mt-2 text-muted-foreground text-sm">{t("home.sync.priceDescription")}</p>
				</div>
				<div className="space-y-3">
					{syncItems.map(item => (
						<div className="flex gap-3 rounded-md border px-3 py-3" key={item.title}>
							<div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
								<HiDevicePhoneMobile className="h-4 w-4" />
							</div>
							<div>
								<p className="font-semibold text-sm">{item.title}</p>
								<p className="mt-1 text-muted-foreground text-xs leading-5">{item.description}</p>
							</div>
						</div>
					))}
				</div>
				<Button className="w-full" type="button" variant="outline">
					{t("home.sync.action")}
				</Button>
			</CardContent>
		</Card>
	);
}
