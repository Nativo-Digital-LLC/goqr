import { TriangleAlert } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { DictionaryProps } from "@/types/Dictionary";

type Props = {
	lang?: string;
	open: boolean;
	onClose: () => void;
	dictionary: DictionaryProps;
	color: string;
	onColor: string;
};

export const AllergyDialog = ({ open, onClose, dictionary, color, onColor, lang }: Props) => {
	const t = dictionary.menu;
	return (
		<Dialog open={open} onOpenChange={(o) => !o && onClose()}>
			<DialogContent closeLabel={lang === "en" ? "Close" : "Cerrar"} className="max-w-[calc(100%-2.5rem)] gap-3.5 rounded-3xl border-0 p-6 sm:max-w-md">
				<div className="flex size-12 items-center justify-center rounded-full bg-warning-bg">
					<TriangleAlert className="size-6 text-warning" aria-hidden="true" />
				</div>
				<DialogTitle className="font-display text-[22px] font-bold">{t.allergyTitle}</DialogTitle>
				<DialogDescription className="text-[15px] leading-[1.55] text-foreground/80">
					{t.foodAllergyAndRiskDisclaimer}
				</DialogDescription>
				<button
					type="button"
					onClick={onClose}
					className="h-12 rounded-[14px] text-base font-semibold"
					style={{ backgroundColor: color, color: onColor }}
				>
					{t.allergyAccept}
				</button>
				<span className="text-center text-xs text-muted-foreground">{t.allergyNote}</span>
			</DialogContent>
		</Dialog>
	);
};
