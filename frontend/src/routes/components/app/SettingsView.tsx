import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuBell, LuCloud, LuCreditCard, LuRefreshCw, LuUnplug } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/Panel";
import { TextField } from "@/components/ui/TextField";
import type {
	NotificationPermissionState,
	PremiumEntitlement,
	SyncCursor,
} from "@/features/treatments/domain/types";

interface SettingsViewProps {
	entitlement: PremiumEntitlement;
	notificationPermission: NotificationPermissionState;
	onConnectSync: (email: string) => Promise<void>;
	onDisconnectSync: () => Promise<void>;
	onPurchasePremium: () => Promise<void>;
	onRequestNotifications: () => Promise<void>;
	onRestorePremium: () => Promise<void>;
	onSyncNow: () => Promise<void>;
	sync: SyncCursor;
}

export function SettingsView({
	entitlement,
	notificationPermission,
	onConnectSync,
	onDisconnectSync,
	onPurchasePremium,
	onRequestNotifications,
	onRestorePremium,
	onSyncNow,
	sync,
}: SettingsViewProps) {
	const { t } = useTranslation();
	const [email, setEmail] = useState(sync.connectedEmail ?? "user@gmail.com");
	const premiumActive = entitlement.state === "active" || entitlement.state === "dev";

	return (
		<section className="grid gap-5 lg:grid-cols-3">
			<Panel className="space-y-4 p-5">
				<div>
					<LuBell className="h-5 w-5 text-primary" />
					<h2 className="mt-2 font-semibold text-xl">{t("settings.notifications.title")}</h2>
					<p className="mt-1 text-muted-foreground text-sm">{t("settings.notifications.description")}</p>
				</div>
				<p className="rounded border border-border px-3 py-2 text-sm">
					{t("settings.notifications.permission")}: {t(`notification.permission.${notificationPermission}`)}
				</p>
				<Button onClick={() => void onRequestNotifications()} variant="outline">
					<LuBell className="h-4 w-4" />
					{t("settings.notifications.action")}
				</Button>
			</Panel>
			<Panel className="space-y-4 p-5">
				<div>
					<LuCreditCard className="h-5 w-5 text-primary" />
					<h2 className="mt-2 font-semibold text-xl">{t("settings.premium.title")}</h2>
					<p className="mt-1 text-muted-foreground text-sm">{t("settings.premium.description")}</p>
				</div>
				<p className="rounded border border-border px-3 py-2 text-sm">
					{t("settings.premium.status")}: {t(`premium.state.${entitlement.state}`)}
				</p>
				<div className="grid grid-cols-2 gap-2">
					<Button onClick={() => void onPurchasePremium()}>
						<LuCreditCard className="h-4 w-4" />
						{t("settings.premium.purchase")}
					</Button>
					<Button onClick={() => void onRestorePremium()} variant="outline">
						{t("settings.premium.restore")}
					</Button>
				</div>
			</Panel>
			<Panel className="space-y-4 p-5">
				<div>
					<LuCloud className="h-5 w-5 text-primary" />
					<h2 className="mt-2 font-semibold text-xl">{t("settings.sync.title")}</h2>
					<p className="mt-1 text-muted-foreground text-sm">{t("settings.sync.description")}</p>
				</div>
				<TextField
					disabled={!premiumActive}
					label={t("settings.sync.email")}
					onValueChange={setEmail}
					placeholder="user@gmail.com"
					value={email}
				/>
				<p className="rounded border border-border px-3 py-2 text-sm">
					{t("settings.sync.status")}: {t(`sync.state.${sync.state}`)}
				</p>
				<div className="grid grid-cols-2 gap-2">
					<Button disabled={!premiumActive} onClick={() => void onConnectSync(email)}>
						<LuCloud className="h-4 w-4" />
						{t("settings.sync.connect")}
					</Button>
					<Button disabled={!sync.connectedEmail} onClick={() => void onSyncNow()} variant="outline">
						<LuRefreshCw className="h-4 w-4" />
						{t("settings.sync.syncNow")}
					</Button>
					<Button
						className="col-span-2"
						disabled={!sync.connectedEmail}
						onClick={() => void onDisconnectSync()}
						variant="outline"
					>
						<LuUnplug className="h-4 w-4" />
						{t("settings.sync.disconnect")}
					</Button>
				</div>
			</Panel>
		</section>
	);
}
