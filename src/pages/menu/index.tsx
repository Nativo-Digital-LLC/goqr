import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Row, Typography } from "antd";
import {
	InfiniteHits,
	InstantSearch,
	SearchBox,
	Configure,
} from "react-instantsearch";
import "instantsearch.css/themes/satellite.css";

import { useGetEstablishmentByDomain } from "../../hooks/useEstablishments";
import {
	ModalCategory,
	SubcategoriesList,
	ProductsList,
	ModalSubcategory,
	MenuFooter,
	MenuHeader,
	EstablishmentInfo,
	CategoriesMenu,
	ProductCard,
	Loading,
	UnavailableEstablishment,
	NotFoundEstablishment,
} from "./components";
import { useSessionStore } from "../../store/session";
import searchClient from "../../utils/search";
import { ProductProps } from "../../types/Product";
import { useShowIntro } from "../../hooks/useShowIntro";
import { useFDADisclaimer } from "../../hooks/useFDADisclaimer";
import { useLanguageStore } from "../../store/language";

const { Text } = Typography;

export default function MenuPage() {
	const { establishmentUrl } = useParams();
	const session = useSessionStore(({ session }) => session);
	const location = useLocation();
	const navigate = useNavigate();
	const showIntro = useShowIntro();
	const { dictionary, lang } = useLanguageStore((store) => store);

	const [establishment, loading, error, reload] =
		useGetEstablishmentByDomain(establishmentUrl);
	useFDADisclaimer(
		session,
		establishment?.showFoodAllergyAndRiskDisclaimer && !showIntro
	);
	const [search, setSearch] = useState("");

	const isEditable = useMemo(() => {
		return (
			(establishment &&
				session &&
				session.userId === establishment.userId) ||
			false
		);
	}, [session, establishment]);

	const selected = useMemo(() => {
		const params = new URLSearchParams(location.search);
		const categoryId = params.get("categoryId");
		const subcategoryId = params.get("subcategoryId");

		return {
			categoryId,
			subcategoryId,
		};
	}, [location]);

	const selectedCategory = useMemo(() => {
		if (
			!selected.categoryId ||
			!establishment ||
			establishment.categories.length === 0
		) {
			return null;
		}

		return (
			establishment.categories.find(
				({ $id }) => $id === selected.categoryId
			) || null
		);
	}, [establishment, selected.categoryId]);

	const productsListTitle = useMemo(() => {
		if (selectedCategory?.enableSubcategories) {
			const subcategory = selectedCategory?.subcategories?.find(
				({ $id }) => $id === selected.subcategoryId
			);

			return lang === "es"
				? subcategory?.es_name || ""
				: subcategory?.en_name || "";
		}

		if (selectedCategory) {
			return selectedCategory[(lang + "_name") as "es_name" | "en_name"];
		}

		return "";
	}, [lang, selectedCategory, selected]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const categoryId = params.get("categoryId");

		if (establishment) {
			document.title = `${establishment.name} | GoQR`;
		}

		if (
			!establishment ||
			establishment.categories.length === 0 ||
			categoryId
		) {
			return;
		}

		const categories = establishment.categories.sort(
			(a, b) => a.order - b.order
		);

		if (categories.length > 0) {
			handleUrlChanges("categoryId", categories[0].$id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [establishment]);

	useEffect(() => {
		if (selected.subcategoryId) {
			const div = document.getElementById("main_container");
			if (div) {
				div.scrollTo({
					top: 200,
					behavior: "smooth",
				});
			}
		}
	}, [selected?.subcategoryId]);

	if (error) {
		return <p>Error, {JSON.stringify(error, null, 4)}</p>;
	}

	if (loading && !establishment) {
		return null;
	}

	if (!establishment) {
		return <NotFoundEstablishment />;
	}

	if (!establishment.isActive) {
		return <UnavailableEstablishment />;
	}

	function handleUrlChanges(key: string, value: string, reset = false) {
		const params = new URLSearchParams(location.search);
		if (reset) {
			const keys = Object.keys(Object.fromEntries(params.entries()));

			for (const key of keys) {
				params.delete(key);
			}
		}

		params.set(key, value);
		navigate(`${location.pathname}?${params.toString()}`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function handleSearchInput({ target }: any) {
		setSearch(target.value);
	}

	if (loading || (showIntro && location.pathname.includes("pandora"))) {
		return (
			<Loading showPandoraIntro={location.pathname.includes("pandora")} />
		);
	}

	return (
		<InstantSearch indexName="products" searchClient={searchClient}>
			<Configure filters={`establishmentId="${establishment.$id}"`} />
			<div style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
				<div
					style={{
						maxWidth: 560,
						margin: "0 auto",
						backgroundColor: "#FFF",
						display: "flex",
						flexDirection: "column",
						minHeight: "100vh",
					}}
				>
					<MenuHeader
						bannerUrl={
							establishment.bannerUrl ??
							"https://appwrite.nd.com.do/v1/storage/buckets/66f768f700019e95e2c8/files/67110f2e001cdb14cd8e/view?project=66f768e4001537551adf"
						}
						logoUrl={establishment.logoUrl ?? undefined}
						isEditable={isEditable}
					/>

					<div
						style={{
							borderRadius: 30,
							marginTop: -30,
							width: "100%",
							flex: 1,
							zIndex: 100,
							backgroundColor: "#FFF",
							padding: 20,
						}}
						className="hide-scrollbar-y"
						id="main_container"
					>
						<EstablishmentInfo
							establishment={establishment}
							isEditable={isEditable}
						/>
						<br />
						<br />

						<CategoriesMenu
							categories={establishment.categories}
							selectedCategoryId={
								selected.categoryId ?? undefined
							}
							color={establishment.mainHexColor}
							onSelect={(id) =>
								handleUrlChanges("categoryId", id, true)
							}
							onChange={() => reload(establishmentUrl!)}
							establishmentId={establishment.$id}
							isEditable={isEditable}
						/>
						<br />

						{!isEditable && (
							<SearchBox
								onChangeCapture={handleSearchInput}
								onResetCapture={() => setSearch("")}
								placeholder={dictionary.menu.search}
							/>
						)}

						{search.length > 0 && (
							<InfiniteHits
								hitComponent={({ hit }) => (
									<ProductCard
										key={hit.$id}
										data={hit as unknown as ProductProps}
										color={establishment.mainHexColor}
										preview
									/>
								)}
							/>
						)}

						<SubcategoriesList
							subcategories={
								selectedCategory?.subcategories || []
							}
							mainColor={establishment.mainHexColor}
							isEditable={isEditable}
							category={{
								name: selectedCategory
									? selectedCategory[
											(lang + "_name") as
												| "es_name"
												| "en_name"
									  ]
									: "",
								id: selectedCategory?.$id || "",
							}}
							show={
								!selected.subcategoryId &&
								search.length === 0 &&
								!!selectedCategory?.enableSubcategories
							}
							onChange={() => reload(establishmentUrl!)}
							onPress={(id) =>
								handleUrlChanges("subcategoryId", id)
							}
						/>

						<ProductsList
							show={
								(!!selected.subcategoryId ||
									!selectedCategory?.enableSubcategories) &&
								search.length === 0
							}
							color={establishment.mainHexColor}
							establishmentId={establishment.$id}
							categoryId={selected.categoryId + ""}
							subcategoryId={selected.subcategoryId || null}
							title={productsListTitle}
							isEditable={isEditable}
							enableMultiLanguage={
								establishment?.enableMultiLanguage
							}
						/>

						<Row justify="center">
							<a href="https://goqr.com.do" target="_blank">
								<Text>goqr.com.do</Text>
							</a>
						</Row>
					</div>

					{isEditable && <MenuFooter domain={establishmentUrl!} />}
				</div>

				<ModalCategory
					onFinish={() => reload(establishmentUrl!)}
					enableEnglishVersion={establishment?.enableMultiLanguage}
				/>

				<ModalSubcategory
					onFinish={() => reload(establishmentUrl!)}
					enableEnglishVersion={establishment?.enableMultiLanguage}
				/>
			</div>
		</InstantSearch>
	);
}
