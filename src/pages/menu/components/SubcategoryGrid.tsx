import { localized } from "@/lib/menu";
import type { DictionaryProps, Lang } from "@/types/Dictionary";
import type { SubcategoryProps } from "@/types/Subcategory";

type Props = {
	categoryName: string;
	subcategories: SubcategoryProps[];
	lang: Lang;
	dictionary: DictionaryProps;
	onSelect: (id: string) => void;
};

export const SubcategoryGrid = ({ categoryName, subcategories, lang, dictionary, onSelect }: Props) => (
	<section className="flex flex-col gap-3.5">
		<h2 className="font-display text-[22px] font-bold">{categoryName}</h2>
		<p className="-mt-2 text-sm text-muted-foreground">{dictionary.menu.chooseSubcategory(categoryName)}</p>
		{subcategories.length === 0 && <p className="text-sm text-muted-foreground">{dictionary.menu.emptyCategory}</p>}
		<div className="grid grid-cols-2 gap-3">
			{subcategories.map((s) => (
				<button
					key={s.id}
					type="button"
					onClick={() => onSelect(s.id)}
					className="relative flex h-[130px] items-end overflow-hidden rounded-[18px] bg-line p-3 text-left text-base font-bold text-white"
				>
					{s.photoUrl && <img src={s.photoUrl} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />}
					<span className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" aria-hidden="true" />
					<span className="relative">{localized(s as unknown as Record<string, unknown>, "name", lang)}</span>
				</button>
			))}
		</div>
	</section>
);
