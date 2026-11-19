import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { usePanel } from "../PanelContext";
import { EstablishmentSwitcher } from "./EstablishmentSwitcher";

export function PanelHeader({
	title,
	description,
	actions,
}: {
	title: string;
	description?: string;
	actions?: ReactNode;
}) {
	const { establishment } = usePanel();

	return (
		<header className="flex flex-wrap items-center justify-between gap-4">
			<div className="flex flex-col gap-1">
				<h1 className="font-display text-[26px] font-bold tracking-[-0.02em] lg:text-[28px]">{title}</h1>
				{description && <span className="text-sm text-muted-foreground">{description}</span>}
			</div>
			<div className="flex flex-wrap items-center gap-3">
				<EstablishmentSwitcher />
				<a
					href={`/m/${establishment.domain}`}
					target="_blank"
					rel="noreferrer"
					aria-label="Ver menú"
					className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-[15px] font-semibold hover:text-brand"
				>
					<span className="hidden sm:inline">Ver menú</span>
					<ExternalLink size={18} />
				</a>
				{actions}
			</div>
		</header>
	);
}
