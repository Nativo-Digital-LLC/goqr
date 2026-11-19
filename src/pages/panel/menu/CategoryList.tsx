import { useEffect, useRef } from "react";
import { MoreVertical, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CategoryProps } from "@/types/Category";
import type { ProductProps } from "@/types/Product";
import type { SubcategoryProps } from "@/types/Subcategory";

export type CategoryActions = {
	onSelect: (categoryId: string, subcategoryId: string | null) => void;
	onNew: () => void;
	onEdit: (c: CategoryProps) => void;
	onMove: (index: number, delta: -1 | 1) => void;
	onToggleHidden: (c: CategoryProps) => void;
	onAddSubcategory: (c: CategoryProps) => void;
	onDelete: (c: CategoryProps) => void;
	onEditSubcategory: (c: CategoryProps, s: SubcategoryProps) => void;
	onDeleteSubcategory: (c: CategoryProps, s: SubcategoryProps) => void;
};

export function CategoryList({
	categories,
	subcategories,
	products,
	selectedCategoryId,
	selectedSubcategoryId,
	busy,
	actions: a,
}: {
	categories: CategoryProps[];
	subcategories: Record<string, SubcategoryProps[]>;
	products: ProductProps[];
	selectedCategoryId: string | undefined;
	selectedSubcategoryId: string | null;
	busy: boolean;
	actions: CategoryActions;
}) {
	const count = (f: (p: ProductProps) => boolean) => products.filter(f).length;

	return (
		<section aria-label="Categorías" className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-bold">Categorías</h2>
				<Button size="sm" variant="outline" disabled={busy} onClick={a.onNew}><Plus /> Nueva categoría</Button>
			</div>
			{categories.length === 0 && <p className="text-sm text-muted-foreground">Aún no tienes categorías. Crea la primera para empezar.</p>}
			<ul className="flex flex-col gap-1">
				{categories.map((c, i) => {
					const subs = subcategories[c.id] ?? [];
					const active = c.id === selectedCategoryId;
					return (
						<li key={c.id}>
							<div className={`flex items-center gap-1 rounded-xl ${active && !selectedSubcategoryId ? "bg-secondary" : "hover:bg-secondary/60"}`}>
								<button
									type="button"
									onClick={() => a.onSelect(c.id, null)}
									className="flex min-h-11 flex-1 flex-col items-start justify-center gap-1 px-3 py-2 text-left"
								>
									<span className="text-[15px] font-semibold">{c.es_name}</span>
									<span className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
										{count((p) => p.categoryId === c.id)} productos
										{c.enableSubcategories && <Badge variant="outline">Con subcategorías</Badge>}
										{c.hidden && <Badge variant="secondary">Oculta</Badge>}
									</span>
								</button>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" aria-label={`Opciones de ${c.es_name}`} disabled={busy}><MoreVertical /></Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onSelect={() => a.onEdit(c)}>Editar</DropdownMenuItem>
										<DropdownMenuItem disabled={i === 0} onSelect={() => a.onMove(i, -1)}>Subir</DropdownMenuItem>
										<DropdownMenuItem disabled={i === categories.length - 1} onSelect={() => a.onMove(i, 1)}>Bajar</DropdownMenuItem>
										<DropdownMenuItem onSelect={() => a.onToggleHidden(c)}>{c.hidden ? "Mostrar" : "Ocultar"}</DropdownMenuItem>
										{c.enableSubcategories && (
											<DropdownMenuItem disabled={busy} onSelect={() => a.onAddSubcategory(c)}>Agregar subcategoría</DropdownMenuItem>
										)}
										<DropdownMenuSeparator />
										<DropdownMenuItem variant="destructive" onSelect={() => a.onDelete(c)}>Eliminar</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							{subs.length > 0 && (
								<ul className="ml-4 mt-1 flex flex-col gap-1 border-l border-border pl-2">
									{subs.map((s) => (
										<li
											key={s.id}
											className={`flex items-center gap-1 rounded-xl ${s.id === selectedSubcategoryId ? "bg-secondary" : "hover:bg-secondary/60"}`}
										>
											<button
												type="button"
												onClick={() => a.onSelect(c.id, s.id)}
												className="flex min-h-10 flex-1 items-center justify-between gap-2 px-3 text-left text-[14px]"
											>
												<span className="font-medium">{s.es_name}</span>
												<span className="text-[13px] text-muted-foreground">{count((p) => p.subcategoryId === s.id)}</span>
											</button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon-sm" aria-label={`Opciones de ${s.es_name}`} disabled={busy}><MoreVertical /></Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem onSelect={() => a.onEditSubcategory(c, s)}>Editar</DropdownMenuItem>
													<DropdownMenuItem variant="destructive" onSelect={() => a.onDeleteSubcategory(c, s)}>Eliminar</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</li>
									))}
								</ul>
							)}
						</li>
					);
				})}
			</ul>
		</section>
	);
}

/** Carril horizontal de chips (categorías o subcategorías) para el celular. */
export function ChipRow({
	label,
	items,
	activeId,
	onSelect,
}: {
	label: string;
	items: { id: string; name: string; count: number }[];
	activeId: string | undefined;
	onSelect: (id: string) => void;
}) {
	const row = useRef<HTMLDivElement>(null);
	useEffect(() => {
		// Solo desplazamiento horizontal; scrollIntoView movería también la página.
		const r = row.current;
		const chip = r?.querySelector<HTMLElement>("[aria-current]");
		if (r && chip) r.scrollTo({ left: chip.offsetLeft - (r.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
	}, [activeId]);
	return (
		<div ref={row} role="group" aria-label={label} className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{items.map((c) => {
				const active = c.id === activeId;
				return (
					<button
						key={c.id}
						type="button"
						aria-current={active || undefined}
						onClick={() => onSelect(c.id)}
						className={`min-h-10 flex-none rounded-full px-4 text-sm ${active ? "bg-primary font-semibold text-primary-foreground" : "border border-border bg-card font-medium"}`}
					>
						{c.name} · {c.count}
					</button>
				);
			})}
		</div>
	);
}
