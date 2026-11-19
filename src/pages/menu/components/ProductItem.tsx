import { Badge } from "@/components/ui/badge";
import { formatPrice, localized } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { ProductStatus, type ProductProps } from "@/types/Product";
import type { DictionaryProps, Lang } from "@/types/Dictionary";

// Cliente con carta sin precio único visible.
export const PANDORA_PRODUCT_ID = "67466c610004d4e7c5bf";

declare global {
	interface Window {
		umami?: { track: (event: string, data?: Record<string, unknown>) => void };
	}
}

type Props = {
	product: ProductProps;
	lang: Lang;
	dictionary: DictionaryProps;
	color: string;
	onOpen: (product: ProductProps) => void;
};

export const ProductItem = ({ product, lang, dictionary, color, onOpen }: Props) => {
	const doc = product as unknown as Record<string, unknown>;
	const description = localized(doc, "description", lang);
	const soldOut = product.status === ProductStatus.NotAvailable;
	const prices = (product.prices ?? []).filter((p) => typeof p.price === "number");
	const hidePrice = product.id === PANDORA_PRODUCT_ID && prices.length === 1;

	return (
		<button
			type="button"
			onClick={() => onOpen(product)}
			className={cn(
				"flex w-full items-start gap-3.5 rounded-[20px] border border-border bg-white p-3.5 text-left",
				soldOut && "opacity-60"
			)}
		>
			<span className="flex min-w-0 flex-1 flex-col gap-1.5">
				{(product.bestSeller || soldOut) && (
					<span className="flex flex-wrap gap-1.5">
						{product.bestSeller && (
							<Badge className="bg-platano px-2.5 py-1 font-bold text-foreground">{dictionary.menu.product.bestSeller}</Badge>
						)}
						{soldOut && (
							<Badge variant="secondary" className="px-2.5 py-1 font-bold">{dictionary.menu.product.notAvailable}</Badge>
						)}
					</span>
				)}
				<span className="text-base font-bold">{localized(doc, "name", lang)}</span>
				{description && <span className="line-clamp-2 text-sm text-muted-foreground">{description}</span>}
				{!hidePrice && prices.length === 1 && (
					<span className="text-base font-bold" style={{ color }}>{formatPrice(prices[0].price, lang)}</span>
				)}
				{prices.length > 1 && (
					<span className="text-sm font-bold" style={{ color }}>
						{prices.map((p) => (p.label ? `${p.label} ${formatPrice(p.price, lang)}` : formatPrice(p.price, lang))).join(" · ")}
					</span>
				)}
			</span>
			{product.photoUrl && (
				<img src={product.photoUrl} alt="" loading="lazy" className="size-24 shrink-0 rounded-2xl object-cover" />
			)}
		</button>
	);
};
