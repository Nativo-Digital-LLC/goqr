import { cn } from "@/lib/utils";
import type { Lang } from "@/types/Dictionary";

export const LanguageToggle = ({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) => (
	<div className="flex gap-1 rounded-full bg-muted p-1" role="group" aria-label={lang === "en" ? "Language" : "Idioma"}>
		{(["es", "en"] as const).map((l) => (
			<button
				key={l}
				type="button"
				onClick={() => onChange(l)}
				aria-pressed={lang === l}
				className={cn(
					"min-h-9 rounded-full px-3.5 text-[13px] font-semibold",
					lang === l ? "bg-white text-foreground shadow-xs" : "text-muted-foreground"
				)}
			>
				{l.toUpperCase()}
			</button>
		))}
	</div>
);
