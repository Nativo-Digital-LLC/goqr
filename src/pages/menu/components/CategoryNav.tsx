import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { localized } from "@/lib/menu";
import type { CategoryProps } from "@/types/Category";
import type { Lang } from "@/types/Dictionary";

type Props = {
	categories: CategoryProps[];
	activeId: string | undefined;
	lang: Lang;
	color: string;
	onColor: string;
	onSelect: (id: string) => void;
};

export const CategoryNav = ({ categories, activeId, lang, color, onColor, onSelect }: Props) => {
	const activeText = onColor;
	const chips = useRef<HTMLDivElement>(null);
	useEffect(() => {
		// Solo desplazamiento horizontal del carril; scrollIntoView movería también la página.
		const row = chips.current;
		const chip = row?.querySelector<HTMLElement>("[aria-current]");
		if (row && chip) row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
	}, [activeId]);
	const umami = (c: CategoryProps) => ({
		"data-umami-event": "Category",
		"data-umami-event-id": c.id,
		"data-umami-event-name": c.es_name,
	});
	return (
		<>
		<nav className="sticky top-0 z-20 bg-white lg:hidden py-2.5 shadow-[0_6px_12px_-8px_rgba(42,20,16,0.2)]">
			<div ref={chips} className="relative flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-2 overflow-x-auto px-5">
				{categories.map((c) => {
					const active = c.id === activeId;
					const name = localized(c as unknown as Record<string, unknown>, "name", lang);
					return (
						<button
							key={c.id}
							type="button"
							onClick={() => onSelect(c.id)}
							aria-current={active || undefined}
							{...umami(c)}
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
		<nav className="sticky top-[88px] hidden max-h-[calc(100vh-104px)] self-start overflow-y-auto lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:block">
			<ul className="flex flex-col gap-1">
				{categories.map((c) => {
					const active = c.id === activeId;
					const name = localized(c as unknown as Record<string, unknown>, "name", lang);
					return (
						<li key={c.id}>
							<button
								type="button"
								onClick={() => onSelect(c.id)}
								aria-current={active || undefined}
								{...umami(c)}
								className={cn(
									"min-h-10 w-full rounded-xl px-4 text-left text-sm",
									active ? "font-semibold" : "font-medium text-foreground hover:bg-muted"
								)}
								style={active ? { backgroundColor: color, color: activeText } : undefined}
							>
								{name}
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
		</>
	);
};
