import { useState } from "react";

import type { ProductProps } from "@/types/Product";
import type { DictionaryProps, Lang } from "@/types/Dictionary";
import { ProductDetail } from "./ProductDetail";
import { ProductItem } from "./ProductItem";

type Props = {
	products: ProductProps[];
	categoryId: string;
	subcategoryId: string | null;
	lang: Lang;
	dictionary: DictionaryProps;
	color: string;
};

export const ProductList = ({ products, categoryId, subcategoryId, lang, dictionary, color }: Props) => {
	const [selected, setSelected] = useState<ProductProps | null>(null);
	const [open, setOpen] = useState(false);
	const list = products.filter(
		(p) => p.categoryId === categoryId && (!subcategoryId || p.subcategoryId === subcategoryId)
	);

	if (!list.length) return <p className="py-6 text-center text-muted-foreground">{dictionary.menu.emptyCategory}</p>;
	return (
		<>
			<div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
				{list.map((p) => (
					<ProductItem
						key={p.id}
						product={p}
						lang={lang}
						dictionary={dictionary}
						color={color}
						onOpen={(product) => { setSelected(product); setOpen(true); }}
					/>
				))}
			</div>
			<ProductDetail product={selected} open={open} onOpenChange={setOpen} lang={lang} dictionary={dictionary} color={color} />
		</>
	);
};
