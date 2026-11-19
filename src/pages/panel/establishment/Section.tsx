import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

export type FormValues = {
	name: string;
	domain: string;
	description: string;
	mainHexColor: string;
	exactColor: boolean;
	address: string;
	addressLink: string;
	phone: string;
	whatsapp: string;
	week: { open: boolean; from: string; to: string }[];
	social: { platform: string; link: string; displayName?: string }[];
	enableMultiLanguage: boolean;
	showFoodAllergyAndRiskDisclaimer: boolean;
	requiresTaxReceipt: boolean;
	rnc: string;
	companyName: string;
};

export const textarea =
	"w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm";

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
	return (
		<section id={id} className="flex scroll-mt-6 flex-col gap-4 rounded-2xl border border-border bg-card p-5">
			<h2 className="font-display text-lg font-bold">{title}</h2>
			{children}
		</section>
	);
}

export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label htmlFor={id}>{label}</Label>
			{children}
			{error ? <span className="text-sm text-destructive">{error}</span> : hint && <span className="text-[13px] text-muted-foreground">{hint}</span>}
		</div>
	);
}

export function SwitchRow({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex flex-col gap-0.5">
				<Label htmlFor={id}>{label}</Label>
				{hint && <span className="text-sm text-muted-foreground">{hint}</span>}
			</div>
			{children}
		</div>
	);
}
