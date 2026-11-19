import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteCategory, useSaveCategory } from "@/hooks/useCategories";
import { useDeleteSubcategory, useSaveSubcategory } from "@/hooks/useSubcategories";
import { useDeleteProduct } from "@/hooks/useProducts";
import { useMenuEditor } from "@/hooks/useMenuEditor";
import { moveItem, ordersAfterMove } from "@/lib/panel";
import { saveOrder } from "@/services/order";
import type { CategoryProps } from "@/types/Category";
import type { ProductProps } from "@/types/Product";
import type { SubcategoryProps } from "@/types/Subcategory";
import { usePanel } from "../PanelContext";
import { PanelHeader } from "../components/PanelHeader";
import { CategoryDialog, type CategoryValues } from "./CategoryDialog";
import { CategoryList } from "./CategoryList";
import { ConfirmDialog } from "./ConfirmDialog";
import { MenuPreview } from "./MenuPreview";
import { ProductRows } from "./ProductRows";
import { SubcategoryDialog, type SubcategoryValues } from "./SubcategoryDialog";

const nextOrder = (items: { order?: number }[]) => Math.max(0, ...items.map((i) => i.order ?? 0)) + 1;

type Confirm =
	| { kind: "category"; item: CategoryProps }
	| { kind: "subcategory"; item: SubcategoryProps; category: CategoryProps }
	| { kind: "product"; item: ProductProps };

export default function MenuEditorPage() {
	const { establishment: est } = usePanel();
	const { categories, subcategories, products, loading, error, reload } = useMenuEditor(est.id);

	const [params] = useSearchParams();
	const [sel, setSel] = useState<{ categoryId?: string; subcategoryId: string | null }>({
		categoryId: params.get("categoryId") ?? undefined,
		subcategoryId: params.get("subcategoryId"),
	});
	const [search, setSearch] = useState("");
	const [draft, setDraft] = useState<ProductProps[] | null>(null); // no es null mientras se reordena
	const [previewKey, setPreviewKey] = useState(0);
	const [writing, setWriting] = useState(false); // escritura o recarga en curso
	const [catDialog, setCatDialog] = useState<{ category: CategoryProps | null } | null>(null);
	const [subDialog, setSubDialog] = useState<{ category: CategoryProps; sub: SubcategoryProps | null } | null>(null);
	const [confirm, setConfirm] = useState<Confirm | null>(null);

	const [saveCategory, savingCategory, saveCategoryError] = useSaveCategory();
	const [saveSubcategory, savingSub, saveSubError] = useSaveSubcategory();
	const [deleteCategory, deletingCategory, deleteCategoryError] = useDeleteCategory();
	const [deleteSubcategory, deletingSub, deleteSubError] = useDeleteSubcategory();
	const [deleteProduct, deletingProduct, deleteProductError] = useDeleteProduct();

	useEffect(() => {
		if (saveCategoryError ?? saveSubError ?? deleteCategoryError ?? deleteSubError ?? deleteProductError) toast.error("No pudimos guardar los cambios. Intenta de nuevo.");
	}, [saveCategoryError, saveSubError, deleteCategoryError, deleteSubError, deleteProductError]);

	const busy = writing || savingCategory || savingSub || deletingCategory || deletingSub || deletingProduct;
	const locked = busy || !!draft;

	const category = categories.find((c) => c.id === sel.categoryId) ?? categories[0];
	const subs = category ? subcategories[category.id] ?? [] : [];
	const subcategory = category?.enableSubcategories ? subs.find((s) => s.id === sel.subcategoryId) ?? null : null;
	const needsSub = !!category?.enableSubcategories && !subcategory;

	const list = useMemo(
		() => (!category || needsSub ? [] : products.filter((p) => p.categoryId === category.id && (!subcategory || p.subcategoryId === subcategory.id))),
		[products, category, subcategory, needsSub]
	);
	const q = search.trim().toLowerCase();
	const shown = draft ?? (q ? list.filter((p) => `${p.es_name} ${p.en_name ?? ""}`.toLowerCase().includes(q)) : list);

	const done = async () => {
		setWriting(true);
		try {
			const ok = await reload();
			setPreviewKey((k) => k + 1);
			if (ok) toast.success("Guardado");
			else toast.error("Guardamos los cambios, pero no pudimos actualizar la lista. Recarga la página.");
		} finally {
			setWriting(false);
		}
	};
	// Escrituras de orden: en lote; si falla, se avisa y se recarga lo que hay en el servidor.
	const writeOrder = async (fn: () => Promise<void>) => {
		setWriting(true);
		try {
			await fn();
		} catch (e) {
			console.error(e);
			toast.error("No pudimos guardar el orden. Intenta de nuevo.");
			setDraft(null);
			try { await reload(); } finally { setWriting(false); }
			return false;
		}
		await done();
		return true;
	};

	const select = (categoryId: string, subcategoryId: string | null) => {
		if (locked) return;
		setSel({ categoryId, subcategoryId });
		setSearch("");
	};

	const moveCategory = (index: number, delta: -1 | 1) =>
		writeOrder(() => saveOrder("categories", est.id, ordersAfterMove(moveItem(categories, index, delta))));

	const toggleReorder = async () => {
		if (!draft) {
			setSearch("");
			return setDraft(list);
		}
		const ok = await writeOrder(() => saveOrder("products", est.id, ordersAfterMove(draft)));
		if (ok) setDraft(null);
	};

	const onSaveCategory = (v: CategoryValues) =>
		!busy &&
		saveCategory(
			{ ...v, id: catDialog?.category?.id, establishmentId: est.id, order: nextOrder(categories) },
			() => {
				setCatDialog(null);
				done();
			}
		);

	const onSaveSub = (v: SubcategoryValues) => {
		if (!subDialog || busy) return;
		saveSubcategory(
			{
				...v,
				id: subDialog.sub?.id,
				categoryId: subDialog.category.id,
				establishmentId: est.id,
				order: nextOrder(subcategories[subDialog.category.id] ?? []),
			},
			() => {
				setSubDialog(null);
				done();
			}
		);
	};

	const onConfirm = () => {
		if (!confirm) return;
		const finish = () => {
			setConfirm(null);
			done();
		};
		if (confirm.kind === "category") deleteCategory(confirm.item.id, est.id, finish);
		else if (confirm.kind === "subcategory") deleteSubcategory(confirm.item.id, confirm.category.id, est.id, finish);
		else deleteProduct(confirm.item.id, finish);
	};

	const confirmCopy = confirm && {
		title: `¿Eliminar «${confirm.item.es_name}»?`,
		body: confirm.kind === "product" ? "El producto dejará de verse en el menú." : "Sus productos dejarán de verse en el menú.",
	};

	const newProductUrl = category
		? `/dashboard/menu/product/new?categoryId=${category.id}${subcategory ? `&subcategoryId=${subcategory.id}` : ""}`
		: "/dashboard/menu/product/new";
	const title = subcategory?.es_name ?? category?.es_name ?? "Menú";

	return (
		<>
			<PanelHeader title="Menú" description="Edita tus categorías y productos. Los cambios se ven al instante." />

			{error && !loading && (
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4">
					<span className="text-[15px] text-muted-foreground">No pudimos cargar tu menú.</span>
					<Button variant="outline" onClick={() => reload()}>Reintentar</Button>
				</div>
			)}

			{loading && <p className="text-[15px] text-muted-foreground" role="status">Cargando tu menú…</p>}

			{!loading && !error && (
				<div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
					<CategoryList
						categories={categories}
						subcategories={subcategories}
						products={products}
						selectedCategoryId={category?.id}
						selectedSubcategoryId={subcategory?.id ?? null}
						busy={locked}
						actions={{
							onSelect: select,
							onNew: () => setCatDialog({ category: null }),
							onEdit: (c) => setCatDialog({ category: c }),
							onMove: moveCategory,
							onToggleHidden: (c) =>
								saveCategory(
									{ id: c.id, establishmentId: est.id, es_name: c.es_name, en_name: c.en_name, enableSubcategories: c.enableSubcategories, hidden: !c.hidden },
									done
								),
							onAddSubcategory: (c) => setSubDialog({ category: c, sub: null }),
							onDelete: (c) => setConfirm({ kind: "category", item: c }),
							onEditSubcategory: (c, s) => setSubDialog({ category: c, sub: s }),
							onDeleteSubcategory: (c, s) => setConfirm({ kind: "subcategory", item: s, category: c }),
						}}
					/>

					<section aria-label="Productos" className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card p-4">
						{!category ? (
							<p className="text-sm text-muted-foreground">Crea una categoría para empezar a agregar productos.</p>
						) : (
							<>
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div className="flex flex-col">
										<h2 className="text-lg font-bold">{title}</h2>
										{!needsSub && (
											<span className="text-sm text-muted-foreground">
												{list.length} {list.length === 1 ? "producto" : "productos"} · {category.hidden ? "Oculta" : "Visible en el menú"}
											</span>
										)}
									</div>
									{!needsSub && (
										<div className="flex flex-wrap gap-2">
											{list.length > 1 && (
												<Button variant="outline" loading={writing && !!draft} disabled={busy} onClick={toggleReorder}>
													{draft ? "Guardar orden" : "Reordenar"}
												</Button>
											)}
											<Button asChild><Link to={newProductUrl} aria-disabled={locked} tabIndex={locked ? -1 : undefined} className={locked ? "pointer-events-none opacity-50" : undefined}><Plus /> Nuevo producto</Link></Button>
										</div>
									)}
								</div>

								{needsSub ? (
									<div className="flex flex-col items-start gap-3 rounded-xl bg-secondary p-4">
										<p className="text-[15px]">
											{subs.length ? "Elige una subcategoría de la lista para ver sus productos." : "Esta categoría usa subcategorías. Crea la primera para agregar productos."}
										</p>
										<Button variant="outline" disabled={locked} onClick={() => setSubDialog({ category, sub: null })}><Plus /> Agregar subcategoría</Button>
									</div>
								) : (
									<>
										<div className="relative">
											<Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
											<Input
												className="pl-10"
												placeholder="Buscar producto"
												aria-label="Buscar producto"
												value={search}
												disabled={!!draft}
												onChange={(e) => setSearch(e.target.value)}
											/>
										</div>
										{shown.length === 0 ? (
											<p className="text-sm text-muted-foreground">{q ? "No encontramos productos con ese nombre." : "Aún no hay productos aquí."}</p>
										) : (
											<ProductRows
												products={shown}
												reordering={!!draft}
												busy={busy}
												onMove={(i, d) => setDraft((cur) => (cur ? moveItem(cur, i, d) : cur))}
												onDelete={(p) => setConfirm({ kind: "product", item: p })}
											/>
										)}
									</>
								)}
							</>
						)}
					</section>

					<MenuPreview domain={est.domain} reloadKey={previewKey} />
				</div>
			)}

			{catDialog && (
				<CategoryDialog
					category={catDialog.category}
					lockSubcategories={
						!!catDialog.category &&
						(subcategories[catDialog.category.id] ?? []).some((s) => products.some((p) => p.subcategoryId === s.id))
					}
					loading={savingCategory}
					onSave={onSaveCategory}
					onClose={() => setCatDialog(null)}
				/>
			)}
			{subDialog && (
				<SubcategoryDialog subcategory={subDialog.sub} loading={savingSub} onSave={onSaveSub} onClose={() => setSubDialog(null)} />
			)}
			<ConfirmDialog
				open={!!confirm}
				title={confirmCopy?.title ?? ""}
				body={confirmCopy?.body ?? ""}
				confirmLabel="Eliminar"
				destructive
				loading={deletingCategory || deletingSub || deletingProduct}
				onConfirm={onConfirm}
				onOpenChange={(o) => !o && setConfirm(null)}
			/>
		</>
	);
}
