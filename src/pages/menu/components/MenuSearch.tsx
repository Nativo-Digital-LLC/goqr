import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Configure, InstantSearch, useHits, useInstantSearch, useSearchBox } from "react-instantsearch";
import { Search, X } from "lucide-react";

import searchClient from "@/utils/search";
import { isVisibleProduct, localized } from "@/lib/menu";
import type { ProductProps } from "@/types/Product";
import type { CategoryProps } from "@/types/Category";
import type { DictionaryProps, Lang } from "@/types/Dictionary";
import { Button } from "@/components/ui/button";
import { ProductDetail } from "./ProductDetail";
import { ProductItem } from "./ProductItem";

type Props = {
	establishmentId: string;
	categories: CategoryProps[];
	products: ProductProps[];
	lang: Lang;
	dictionary: DictionaryProps;
	color: string;
	onColor: string;
	// Escritorio: el campo vive en la barra superior y los resultados se montan en `resultsEl` (sin overlay).
	inline?: boolean;
	resultsEl?: HTMLElement | null;
	onActiveChange?: (active: boolean) => void;
};

export const MenuSearch = (props: Props) => (
	<InstantSearch searchClient={searchClient} indexName="products" future={{ preserveSharedStateOnUnmount: true }}>
		<Configure filters={`establishmentId="${props.establishmentId}"`} hitsPerPage={50} />
		<SearchArea {...props} />
	</InstantSearch>
);

const SearchArea = ({ categories, products, lang, dictionary, color, onColor, inline, resultsEl, onActiveChange }: Props) => {
	const { query: refined, refine } = useSearchBox();
	const { items, results: hitResults } = useHits<{ $id?: string; id?: string; objectID: string }>();
	const { status } = useInstantSearch();
	const [value, setValue] = useState("");
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<ProductProps | null>(null);
	const [detailOpen, setDetailOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const skipFocus = useRef(false);
	const query = value.trim();
	// Los hits solo valen si son de la consulta actual (nunca mostrar los de la anterior).
	const fresh = hitResults?.query === query || (refined === query && status === "error");

	useEffect(() => {
		const t = setTimeout(() => refine(query), 250);
		return () => clearTimeout(t);
	}, [query, refine]);

	// Datos frescos de Firestore; un hit que no esté en el menú (u oculto) se descarta.
	const groups = useMemo(() => {
		if (!fresh) return [];
		const byId = new Map(products.map((p) => [p.id, p]));
		const found = items
			.map((h) => byId.get(h.$id ?? h.id ?? h.objectID))
			.filter((p): p is ProductProps => !!p && isVisibleProduct(p));
		return categories
			.map((c) => ({ category: c, products: found.filter((p) => p.categoryId === c.id) }))
			.filter((g) => g.products.length);
	}, [items, products, categories, fresh]);
	const total = groups.reduce((n, g) => n + g.products.length, 0);

	const showResults = !!query && (inline || open);
	useEffect(() => {
		onActiveChange?.(!!inline && showResults);
		return () => onActiveChange?.(false);
	}, [inline, showResults, onActiveChange]);

	// Pantalla completa en móvil = modal: el resto de la página queda inerte.
	useEffect(() => {
		if (inline || !open || !overlayRef.current) return;
		const marked: Element[] = [];
		for (let n: Element = overlayRef.current; n.parentElement && n.parentElement !== document.body; n = n.parentElement) {
			for (const s of n.parentElement.children) {
				if (s !== n && !s.hasAttribute("inert")) { s.setAttribute("inert", ""); marked.push(s); }
			}
		}
		return () => marked.forEach((s) => s.removeAttribute("inert"));
	}, [inline, open]);

	const close = () => {
		setValue("");
		setOpen(false);
		skipFocus.current = true;
		inputRef.current?.focus();
		// Si el campo ya tenía foco no hay evento onFocus que limpie la marca.
		setTimeout(() => { skipFocus.current = false; });
	};


	const results = showResults && (
			<div className="flex flex-col gap-3.5 pt-2 pb-8">
				{!fresh ? (
					<p className="py-10 text-center text-sm text-muted-foreground">{lang === "en" ? "Searching…" : "Buscando…"}</p>
				) : total === 0 ? (
					<div className="flex flex-col items-center gap-3 py-10 text-center">
						<p className="text-lg font-bold">{dictionary.menu.noResultsTitle(query)}</p>
						<p className="text-muted-foreground">{dictionary.menu.noResultsBody}</p>
						<Button type="button" onClick={close} style={{ backgroundColor: color, color: onColor }}>
							{dictionary.menu.seeFullMenu}
						</Button>
					</div>
				) : (
					<>
						<p className="text-sm font-semibold text-muted-foreground" aria-hidden="true">
							{dictionary.menu.resultsFor(total, query)}
						</p>
						{groups.map((g) => (
							<section key={g.category.id} className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
								<h2 className="text-sm font-bold uppercase tracking-wide lg:col-span-2">
									{localized(g.category as unknown as Record<string, unknown>, "name", lang)}
								</h2>
								{g.products.map((p) => (
									<ProductItem
										key={p.id}
										product={p}
										lang={lang}
										dictionary={dictionary}
										color={color}
										onOpen={(product) => { setSelected(product); setDetailOpen(true); }}
									/>
								))}
							</section>
						))}
					</>
				)}
			</div>
	);

	return (
		<div
			ref={overlayRef}
			role={!inline && open ? "dialog" : undefined}
			aria-modal={!inline && open ? true : undefined}
			aria-label={!inline && open ? dictionary.menu.search : undefined}
			className={inline ? "" : open ? "fixed inset-0 z-40 overflow-y-auto bg-white" : "px-5 py-3"}
			onKeyDown={(e) => (open || inline) && !detailOpen && e.key === "Escape" && close()}
		>
			<p className="sr-only" aria-live="polite">
				{showResults && fresh ? (total ? dictionary.menu.resultsFor(total, query) : dictionary.menu.noResultsTitle(query)) : ""}
			</p>
			<div className={!inline && open ? "mx-auto max-w-[560px] px-5" : ""}>
				<div className={!inline && open ? "flex items-center gap-2 py-3" : ""}>
					<div className="relative flex-1">
						<Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
						<input
							ref={inputRef}
							type="search"
							value={value}
							placeholder={dictionary.menu.search}
							aria-label={dictionary.menu.search}
							onChange={(e) => setValue(e.target.value)}
							onFocus={() => {
								if (inline) return;
								if (skipFocus.current) skipFocus.current = false;
								else setOpen(true);
							}}
							className="h-11 w-full rounded-full border border-border bg-white pr-10 pl-10 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
						/>
						{value && (
							<button
								type="button"
								aria-label={dictionary.menu.cancel}
								onClick={() => { setValue(""); inputRef.current?.focus(); }}
								className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground"
							>
								<X className="size-4" aria-hidden="true" />
							</button>
						)}
					</div>
					{!inline && open && (
						<button type="button" onClick={close} className="min-h-11 text-sm font-semibold" style={{ color }}>
							{dictionary.menu.cancel}
						</button>
					)}
				</div>
				{!inline && results}
			</div>
			{inline && resultsEl && results && createPortal(results, resultsEl)}
			<ProductDetail product={selected} open={detailOpen} onOpenChange={setDetailOpen} lang={lang} dictionary={dictionary} color={color} />
		</div>
	);
};
