import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, QrCode } from "lucide-react";

import { useShowIntro } from "@/hooks/useShowIntro";
import { menuColor, localized } from "@/lib/menu";
import { readableOn } from "@/lib/color";
import es from "@/locale/es";
import { usePublicMenu, type PublicMenu } from "./usePublicMenu";
import { useMenuLang } from "./useMenuLang";
import { MenuError, MenuNotFound, MenuSkeleton, MenuUnavailable } from "./components/MenuStates";
import { MenuHero } from "./components/MenuHero";
import { CategoryNav } from "./components/CategoryNav";
import { SubcategoryGrid } from "./components/SubcategoryGrid";
import { AllergyDialog } from "./components/AllergyDialog";

type SlotProps = { categoryId: string; subcategoryId: string | null };
// Task 5: reemplazar por ProductList (recibe la categoría y subcategoría elegidas).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProductListSlot = (_props: SlotProps) => null;

export default function MenuPage() {
	const { establishmentUrl } = useParams();
	const { pathname } = useLocation();
	const showIntro = useShowIntro();
	const result = usePublicMenu(establishmentUrl);

	if (showIntro && pathname.includes("pandora")) {
		return (
			<div className="mx-auto flex min-h-screen max-w-[560px] flex-col justify-center bg-black">
				<video autoPlay muted loop playsInline src="/pandora-intro.mp4" />
			</div>
		);
	}
	switch (result.status) {
		case "loading": return <MenuSkeleton />;
		case "error": return <MenuError retry={result.retry} />;
		case "not-found": return <MenuNotFound dictionary={es} />;
		case "ready": return <MenuReady menu={result.menu} />;
	}
}

function MenuReady({ menu }: { menu: PublicMenu }) {
	const { establishment, categories, subcategories } = menu;
	const { lang, dictionary, setLang, canSwitch } = useMenuLang(establishment.enableMultiLanguage);
	const navigate = useNavigate();
	const { search } = useLocation();

	const allergyKey = `goqr:allergy:${establishment.id}`;
	const [allergyOpen, setAllergyOpen] = useState(
		() => establishment.showFoodAllergyAndRiskDisclaimer && !localStorage.getItem(allergyKey)
	);

	const params = new URLSearchParams(search);
	const category = categories.find((c) => c.id === params.get("categoryId"));
	const subs = category?.enableSubcategories ? subcategories[category.id] ?? [] : [];
	const hasSubId = params.has("subcategoryId");
	const subcategory = subs.find((s) => s.id === params.get("subcategoryId"));

	useEffect(() => {
		const previous = document.title;
		document.title = `${establishment.name} | GoQR`;
		return () => { document.title = previous; };
	}, [establishment.name]);

	// Enlace viejo o sin categoría: cae a la primera sin dejar entrada extra en el historial.
	useEffect(() => {
		if (establishment.isActive && !category && categories.length) {
			navigate({ search: `?categoryId=${categories[0].id}` }, { replace: true });
		} else if (establishment.isActive && category && hasSubId && !subcategory) {
			// subcategoryId ajeno a la categoría: se quita (sin bucle, la URL nueva ya no lo trae).
			navigate({ search: `?categoryId=${category.id}` }, { replace: true });
		}
	}, [establishment.isActive, category, categories, hasSubId, subcategory, navigate]);

	const color = menuColor(establishment.mainHexColor, establishment.exactColor);
	const closeAllergy = () => {
		localStorage.setItem(allergyKey, "1");
		setAllergyOpen(false);
	};
	const name = (doc: object) => localized(doc as Record<string, unknown>, "name", lang);
	const onColor = readableOn("#FFFFFF", color).ok ? "#FFFFFF" : "#2A1410";

	if (!establishment.isActive) return <MenuUnavailable establishment={establishment} dictionary={dictionary} />;

	return (
		<div className="bg-black/5">
			<div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-white text-foreground">
				<MenuHero
					establishment={establishment}
					lang={lang}
					dictionary={dictionary}
					color={color}
					canSwitch={canSwitch}
					onLangChange={setLang}
				/>
				{categories.length === 0 ? (
					<p className="p-5 text-center text-muted-foreground">{dictionary.menu.emptyMenu}</p>
				) : (
					<>
						<CategoryNav
							categories={categories}
							activeId={category?.id}
							lang={lang}
							color={color}
							onSelect={(id) => navigate({ search: `?categoryId=${id}` })}
						/>
						<main className="flex flex-1 flex-col gap-3.5 p-5">
							{category && category.enableSubcategories && !subcategory && (
								<SubcategoryGrid
									categoryName={name(category)}
									subcategories={subs}
									lang={lang}
									dictionary={dictionary}
									onSelect={(id) => navigate({ search: `?categoryId=${category.id}&subcategoryId=${id}` })}
								/>
							)}
							{category && category.enableSubcategories && subcategory && (
								<button
									type="button"
									onClick={() => navigate({ search: `?categoryId=${category.id}` })}
									className="flex min-h-11 items-center gap-2 self-start text-sm font-semibold"
								>
									<ArrowLeft className="size-4" aria-hidden="true" />{name(category)}
								</button>
							)}
							{category && (!category.enableSubcategories || subcategory) && (
								<>
									{/* Task 5: ProductList */}
									<ProductListSlot categoryId={category.id} subcategoryId={subcategory?.id ?? null} />
								</>
							)}
						</main>
					</>
				)}
				<footer className="flex flex-col items-center gap-2.5 border-t border-border px-5 pt-6 pb-8">
					{establishment.showFoodAllergyAndRiskDisclaimer && (
						<button type="button" onClick={() => setAllergyOpen(true)} className="min-h-11 text-[13px] text-muted-foreground underline">
							{dictionary.menu.allergyInfo}
						</button>
					)}
					<Link to="/" className="flex items-center gap-1.5 text-xs text-powered">
						<QrCode className="size-3.5" aria-hidden="true" />{dictionary.menu.poweredBy}
					</Link>
				</footer>
			</div>
			<AllergyDialog open={allergyOpen} onClose={closeAllergy} dictionary={dictionary} color={color} onColor={onColor} />
		</div>
	);
}
