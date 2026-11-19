import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, localized } from "@/lib/menu";
import { ProductStatus, type ProductProps } from "@/types/Product";
import type { DictionaryProps, Lang } from "@/types/Dictionary";
import { PANDORA_PRODUCT_ID } from "./ProductItem";

type Props = {
	product: ProductProps | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	lang: Lang;
	dictionary: DictionaryProps;
	color: string;
};

const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
	useEffect(() => {
		const mq = window.matchMedia(query);
		const update = () => setMatches(mq.matches);
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, [query]);
	return matches;
};

export const ProductDetail = ({ product, open, onOpenChange, lang, dictionary, color }: Props) => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const id = product?.id;
	const esName = product?.es_name;

	useEffect(() => {
		if (open && id) window.umami?.track("Product", { id, name: esName });
	}, [open, id, esName]);

	if (!product) return null;
	const doc = product as unknown as Record<string, unknown>;
	const description = localized(doc, "description", lang);
	const prices = product.prices ?? [];
	const hidePrice = product.id === PANDORA_PRODUCT_ID && prices.length === 1;

	const body = (
		<>
			{product.photoUrl && <img src={product.photoUrl} alt="" className="h-[300px] w-full shrink-0 object-cover lg:h-[280px]" />}
			<div className="flex flex-col gap-4 p-[22px] pb-7">
				{(product.bestSeller || product.status === ProductStatus.NotAvailable) && (
					<div className="flex flex-wrap gap-1.5">
						{product.bestSeller && <Badge className="bg-platano px-2.5 py-1 font-bold text-foreground">{dictionary.menu.product.bestSeller}</Badge>}
						{product.status === ProductStatus.NotAvailable && (
							<Badge variant="secondary" className="px-2.5 py-1 font-bold">{dictionary.menu.product.notAvailable}</Badge>
						)}
					</div>
				)}
				{isDesktop ? (
					<DialogTitle className="font-display text-[28px] font-extrabold tracking-tight">{localized(doc, "name", lang)}</DialogTitle>
				) : (
					<SheetTitle className="font-display text-[28px] font-extrabold tracking-tight">{localized(doc, "name", lang)}</SheetTitle>
				)}
				{isDesktop ? (
					<DialogDescription className="whitespace-pre-line text-base leading-relaxed text-foreground/80">{description}</DialogDescription>
				) : (
					<SheetDescription className="whitespace-pre-line text-base leading-relaxed text-foreground/80">{description}</SheetDescription>
				)}
				{!hidePrice && prices.length > 0 && (
					<ul className="flex flex-col rounded-2xl border border-border">
						{prices.map((p, i) => (
							<li key={i} className="flex justify-between border-b border-border px-4 py-3.5 last:border-b-0">
								<span className="font-medium">{p.label}</span>
								<strong style={{ color }}>{formatPrice(p.price, lang)}</strong>
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);

	return isDesktop ? (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-[520px]">{body}</DialogContent>
		</Dialog>
	) : (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="bottom" className="max-h-[90vh] gap-0 overflow-y-auto rounded-t-[28px] p-0">{body}</SheetContent>
		</Sheet>
	);
};
