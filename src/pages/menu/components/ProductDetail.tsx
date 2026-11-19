import { useEffect } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatPrice, localized } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { ProductStatus, type ProductProps } from "@/types/Product";
import type { DictionaryProps, Lang } from "@/types/Dictionary";
import { PANDORA_PRODUCT_ID } from "./ProductItem";

// X legible sobre fotos: círculo blanco, más grande y sin la opacidad base.
const closeX = "[&>button]:size-9 [&>button]:rounded-full [&>button]:bg-white [&>button]:p-0 [&>button]:opacity-100 [&>button]:shadow-md [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:text-foreground";

type Props = {
	product: ProductProps | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	lang: Lang;
	dictionary: DictionaryProps;
	color: string;
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
	const prices = (product.prices ?? []).filter((p) => typeof p.price === "number");
	const closeLabel = lang === "en" ? "Close" : "Cerrar";
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
			<DialogContent closeLabel={closeLabel} className={cn("max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-[520px]", closeX)}>{body}</DialogContent>
		</Dialog>
	) : (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="bottom" closeLabel={closeLabel} className={cn("max-h-[90vh] gap-0 overflow-y-auto rounded-t-[28px] p-0", closeX)}>{body}</SheetContent>
		</Sheet>
	);
};
