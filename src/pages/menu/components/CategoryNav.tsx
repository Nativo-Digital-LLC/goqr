import { cn } from "@/lib/utils";
import { contrastRatio } from "@/lib/color";
import { localized } from "@/lib/menu";
import type { CategoryProps } from "@/types/Category";
import type { Lang } from "@/types/Dictionary";

type Props = {
	categories: CategoryProps[];
	activeId: string | undefined;
	lang: Lang;
	color: string;
	onSelect: (id: string) => void;
};

export const CategoryNav = ({ categories, activeId, lang, color, onSelect }: Props) => {
	const activeText = contrastRatio(color, "#FFFFFF") >= 4.5 ? "#FFFFFF" : "#2A1410";
	return (
		<nav className="sticky top-0 z-20 bg-white py-2.5 shadow-[0_6px_12px_-8px_rgba(42,20,16,0.2)]">
			<div className="flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-2 overflow-x-auto px-5">
				{categories.map((c) => {
					const active = c.id === activeId;
					const name = localized(c as unknown as Record<string, unknown>, "name", lang);
					return (
						<button
							key={c.id}
							type="button"
							onClick={() => onSelect(c.id)}
							aria-current={active || undefined}
							data-umami-event="Category"
							data-umami-event-id={c.id}
							data-umami-event-name={name}
							className={cn(
								"min-h-10 flex-none rounded-full px-4 text-sm",
								active ? "font-semibold" : "border border-border font-medium text-foreground"
							)}
							style={active ? { backgroundColor: color, color: activeText } : undefined}
						>
							{name}
						</button>
					);
				})}
			</div>
		</nav>
	);
};
