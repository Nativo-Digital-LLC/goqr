import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenuEditor } from "@/hooks/useMenuEditor";
import { useDeleteProduct, useSaveProduct } from "@/hooks/useProducts";
import { parsePrice } from "@/lib/price";
import { ProductStatus, type ProductProps } from "@/types/Product";
import { usePanel } from "../PanelContext";
import { PanelHeader } from "../components/PanelHeader";
import { ConfirmDialog } from "./ConfirmDialog";
import { PhotoField } from "./PhotoField";
import { PricesField } from "./PricesField";

const schema = z.object({
	es_name: z.string().trim().min(1, "Escribe el nombre del producto."),
	en_name: z.string(),
	es_description: z.string(),
	en_description: z.string(),
	prices: z
		.array(z.object({ label: z.string(), price: z.string().refine((v) => parsePrice(v) !== null, "Escribe un precio válido.") }))
		.min(1),
	categoryId: z.string().min(1, "Elige una categoría."),
	subcategoryId: z.string(),
	status: z.enum(ProductStatus),
	bestSeller: z.boolean(),
});
type Values = z.infer<typeof schema>;

const NONE = "none"; // Radix Select no admite value vacío

const menuUrl = (categoryId?: string, subcategoryId?: string | null) =>
	categoryId ? `/dashboard/menu?categoryId=${categoryId}${subcategoryId ? `&subcategoryId=${subcategoryId}` : ""}` : "/dashboard/menu";

const textarea =
	"w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm";

export default function ProductEditPage() {
	const { productId } = useParams();
	const { establishment: est } = usePanel();
	const editor = useMenuEditor(est.id);
	const product = productId ? editor.products.find((p) => p.id === productId) : undefined;

	return (
		<>
			<PanelHeader title={productId ? "Editar producto" : "Nuevo producto"} />
			{editor.error && !editor.loading ? (
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4">
					<span className="text-[15px] text-muted-foreground">No pudimos cargar tu menú.</span>
					<Button variant="outline" onClick={() => editor.reload()}>Reintentar</Button>
				</div>
			) : editor.loading ? (
				<p className="text-[15px] text-muted-foreground" role="status">Cargando…</p>
			) : productId && !product ? (
				<div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-card px-5 py-4">
					<p className="text-[15px]">No encontramos este producto.</p>
					<Button asChild variant="outline"><Link to="/dashboard/menu">Volver al menú</Link></Button>
				</div>
			) : (
				<ProductForm key={product?.id ?? "new"} product={product} editor={editor} establishmentId={est.id} />
			)}
		</>
	);
}

function ProductForm({
	product,
	editor,
	establishmentId,
}: {
	product?: ProductProps;
	editor: ReturnType<typeof useMenuEditor>;
	establishmentId: string;
}) {
	const { categories, subcategories, products } = editor;
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const [save, saving, saveError] = useSaveProduct();
	const [remove, deleting, deleteError] = useDeleteProduct();
	const [photo, setPhoto] = useState<File | null | undefined>(undefined);
	const [lang, setLang] = useState("es");
	const [confirmOpen, setConfirmOpen] = useState(false);
	const busy = saving || deleting;

	useEffect(() => {
		if (saveError ?? deleteError) toast.error("No pudimos guardar los cambios. Intenta de nuevo.");
	}, [saveError, deleteError]);

	const form = useForm<Values>({
		resolver: zodResolver(schema),
		defaultValues: {
			es_name: product?.es_name ?? "",
			en_name: product?.en_name ?? "",
			es_description: product?.es_description ?? "",
			en_description: product?.en_description ?? "",
			prices: product?.prices?.length
				? product.prices.map((p) => ({ label: p.label ?? "", price: String(p.price) }))
				: [{ label: "", price: "" }],
			categoryId: product?.categoryId ?? params.get("categoryId") ?? categories[0]?.id ?? "",
			subcategoryId: product?.subcategoryId ?? params.get("subcategoryId") ?? "",
			status: product?.status ?? ProductStatus.Visible,
			bestSeller: product?.bestSeller ?? false,
		},
	});
	const { register, watch, setValue, setError, formState: { errors } } = form;
	const categoryId = watch("categoryId");
	const subs = subcategories[categoryId] ?? [];
	const usesSubs = !!categories.find((c) => c.id === categoryId)?.enableSubcategories;
	const subValue = usesSubs && subs.some((s) => s.id === watch("subcategoryId")) ? watch("subcategoryId") : "";

	const onSubmit = form.handleSubmit(
		(v) => {
			if (usesSubs && !subValue) return setError("subcategoryId", { message: "Elige una subcategoría." });
			const subId = usesSubs ? subValue : null;
			// Orden solo al crear; al editar (incluso cambiando de categoría) se conserva.
			const siblings = products.filter((p) => p.categoryId === v.categoryId && (p.subcategoryId ?? null) === subId);
			save(
				{
					id: product?.id,
					establishmentId,
					es_name: v.es_name.trim(),
					en_name: v.en_name.trim(),
					es_description: v.es_description.trim(),
					en_description: v.en_description.trim(),
					prices: v.prices.map((p) => {
						const label = p.label.trim();
						return { ...(label && { label }), price: parsePrice(p.price)! };
					}),
					categoryId: v.categoryId,
					subcategoryId: subId,
					status: v.status,
					bestSeller: v.bestSeller,
					...(!product && { order: Math.max(0, ...siblings.map((p) => p.order ?? 0)) + 1 }),
					photo: product ? photo : photo ?? null,
				},
				() => {
					toast.success("Guardado");
					navigate(menuUrl(v.categoryId, subId));
				}
			);
		},
		(errs) => {
			if (errs.es_name) setLang("es"); // el error no puede quedar en la pestaña oculta
		}
	);

	const onDelete = () =>
		remove(product!.id, () => {
			toast.success("Eliminado");
			navigate(menuUrl(product!.categoryId, product!.subcategoryId));
		});

	return (
		<FormProvider {...form}>
			<form onSubmit={onSubmit} className="flex max-w-[640px] flex-col gap-6" noValidate>
				<PhotoField value={photo} currentUrl={product?.photoUrl ?? null} onChange={setPhoto} disabled={busy} />

				<Tabs value={lang} onValueChange={setLang} className="gap-4">
					<TabsList className="self-start">
						<TabsTrigger value="es">Español</TabsTrigger>
						<TabsTrigger value="en">English</TabsTrigger>
					</TabsList>
					{(["es", "en"] as const).map((l) => (
						<TabsContent key={l} value={l} className="flex flex-col gap-4">
							<div className="flex flex-col gap-1.5">
								<Label htmlFor={`${l}_name`}>Nombre</Label>
								<Input id={`${l}_name`} aria-invalid={!!errors[`${l}_name`]} disabled={busy} {...register(`${l}_name`)} />
								{errors[`${l}_name`] && <span className="text-sm text-destructive">{errors[`${l}_name`]?.message}</span>}
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor={`${l}_description`}>Descripción</Label>
								<textarea id={`${l}_description`} rows={3} className={textarea} disabled={busy} {...register(`${l}_description`)} />
								<span className="text-[13px] text-muted-foreground">Opcional. Cuéntale al cliente qué lleva.</span>
							</div>
						</TabsContent>
					))}
				</Tabs>

				<PricesField disabled={busy} />

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="category">Categoría</Label>
					<Select
						value={categoryId}
						disabled={busy}
						onValueChange={(v) => {
							setValue("categoryId", v);
							setValue("subcategoryId", "");
						}}
					>
						<SelectTrigger id="category" className="w-full"><SelectValue placeholder="Elige una categoría" /></SelectTrigger>
						<SelectContent>
							{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.es_name}</SelectItem>)}
						</SelectContent>
					</Select>
					{errors.categoryId && <span className="text-sm text-destructive">{errors.categoryId.message}</span>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="subcategory">Subcategoría</Label>
					<Select
						value={usesSubs ? subValue : NONE}
						disabled={busy || !usesSubs}
						onValueChange={(v) => setValue("subcategoryId", v, { shouldValidate: true })}
					>
						<SelectTrigger id="subcategory" className="w-full" aria-invalid={!!errors.subcategoryId}>
							<SelectValue placeholder="Elige una subcategoría" />
						</SelectTrigger>
						<SelectContent>
							{!usesSubs && <SelectItem value={NONE}>No aplica</SelectItem>}
							{subs.map((s) => <SelectItem key={s.id} value={s.id}>{s.es_name}</SelectItem>)}
						</SelectContent>
					</Select>
					{errors.subcategoryId && <span className="text-sm text-destructive">{errors.subcategoryId.message}</span>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="status">Estado</Label>
					<Select value={watch("status")} disabled={busy} onValueChange={(v) => setValue("status", v as ProductStatus)}>
						<SelectTrigger id="status" className="w-full"><SelectValue /></SelectTrigger>
						<SelectContent>
							<SelectItem value={ProductStatus.Visible}>Visible</SelectItem>
							<SelectItem value={ProductStatus.NotAvailable}>Agotado</SelectItem>
							<SelectItem value={ProductStatus.Hidden}>Oculto</SelectItem>
						</SelectContent>
					</Select>
					<span className="text-[13px] text-muted-foreground">Agotado se muestra atenuado en el menú. Oculto no aparece.</span>
				</div>

				<div className="flex items-center justify-between gap-4">
					<div className="flex flex-col gap-0.5">
						<Label htmlFor="bestSeller">Más vendido</Label>
						<span className="text-sm text-muted-foreground">Le pone una etiqueta destacada en el menú.</span>
					</div>
					<Switch id="bestSeller" checked={watch("bestSeller")} disabled={busy} onCheckedChange={(v) => setValue("bestSeller", v)} />
				</div>

				<div className="flex items-center gap-3 border-t border-border pt-4">
					{product && (
						<Button type="button" variant="destructive" disabled={busy} onClick={() => setConfirmOpen(true)}>Eliminar</Button>
					)}
					<div className="ml-auto flex gap-3">
						<Button type="button" variant="outline" disabled={busy} onClick={() => navigate("/dashboard/menu")}>Cancelar</Button>
						<Button type="submit" loading={saving} disabled={deleting}>Guardar</Button>
					</div>
				</div>
			</form>

			{product && (
				<ConfirmDialog
					open={confirmOpen}
					title={`¿Eliminar «${product.es_name}»?`}
					body="El producto dejará de verse en el menú."
					confirmLabel="Eliminar"
					destructive
					loading={deleting}
					onConfirm={onDelete}
					onOpenChange={setConfirmOpen}
				/>
			)}
		</FormProvider>
	);
}
