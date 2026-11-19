import { ArrowRight, ImagePlus } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/services/categories";
import { createProduct } from "@/services/products";
import { EstablishmentProps } from "@/types/Establishment";
import { ProductStatus } from "@/types/Product";
import { MenuPreview } from "./MenuPreview";
import { useFilePreview } from "./useFilePreview";
import { useOnboarding } from "./useOnboarding";

type Props = {
	establishment: EstablishmentProps | null;
	saveStep: ReturnType<typeof useOnboarding>["saveStep"];
};

const SUGGESTIONS = ["Entradas", "Platos fuertes", "Bebidas", "Postres"];
const labelClass = "text-sm font-semibold";
const fieldClass = "rounded-xl border-border bg-white text-[15px] focus-visible:ring-2 focus-visible:ring-primary";

export function StepFirstDish({ establishment, saveStep }: Props) {
	const [category, setCategory] = useState("");
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [photo, setPhoto] = useState<File | null>(null);
	const [saving, setSaving] = useState(false);
	const photoUrl = useFilePreview(photo);
	// Si el guardado falla a medias, el reintento no repite lo que ya se creó.
	const categoryId = useRef<string | null>(null);
	const productDone = useRef(false);

	const amount = Number(price.replace(",", "."));
	const canSave = !!establishment && category.trim() !== "" && name.trim() !== "" && amount > 0 && !saving;

	async function skip() {
		setSaving(true);
		try {
			await saveStep(4, {});
		} catch {
			toast.error("No pudimos guardar tu avance. Intenta de nuevo.");
			setSaving(false);
		}
	}

	async function submit(e: FormEvent) {
		e.preventDefault();
		if (!canSave || !establishment) return;
		setSaving(true);
		try {
			if (!categoryId.current) {
				categoryId.current =
					(await createCategory({
						establishmentId: establishment.id,
						es_name: category.trim(),
						en_name: category.trim(),
						order: 0,
					})) ?? null;
			}
			if (!productDone.current) {
				await createProduct({
					establishmentId: establishment.id,
					categoryId: categoryId.current!,
					subcategoryId: null,
					es_name: name.trim(),
					en_name: name.trim(),
					es_description: description.trim(),
					en_description: description.trim(),
					prices: [{ price: amount }],
					order: 0,
					status: ProductStatus.Visible,
					bestSeller: false,
					photo,
				});
				productDone.current = true;
			}
			await saveStep(4, {});
		} catch {
			toast.error("No pudimos guardar tu plato. Intenta de nuevo.");
			setSaving(false);
		}
	}

	return (
		<>
			<form onSubmit={submit} className="flex min-w-0 max-w-[600px] flex-[999_1_480px] flex-col gap-6">
				<div className="flex flex-col gap-2">
					<h1 className="font-display text-[28px] font-bold tracking-[-0.02em] sm:text-4xl">Sube tu primer plato</h1>
					<p className="text-base text-muted-foreground">
						Con una categoría y un plato ya tienes un menú que enseñar. El resto lo completas desde el panel.
					</p>
				</div>
				<div className="flex flex-col gap-1.5">
					<label htmlFor="cat" className={labelClass}>Categoría</label>
					<Input id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass} />
					<div className="flex flex-wrap items-center gap-2 pt-1">
						<span className="text-[13px] text-muted-foreground">Sugerencias:</span>
						{SUGGESTIONS.map((s) => (
							<button
								key={s}
								type="button"
								aria-pressed={category === s}
								onClick={() => setCategory(s)}
								className={`h-11 rounded-full px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
									category === s ? "bg-primary text-primary-foreground" : "border border-border bg-white"
								}`}
							>
								{s}
							</button>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-3">
					<span className={labelClass}>Plato</span>
					<div className="flex flex-wrap gap-4">
						<label className="flex size-[120px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-white text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary">
							<input type="file" accept="image/*" className="sr-only" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
							{photoUrl ? (
								<img src={photoUrl} alt="Foto del plato" className="size-full object-cover" />
							) : (
								<>
									<ImagePlus className="size-6 text-muted-foreground" aria-hidden="true" />
									<span className="text-sm text-muted-foreground">Foto del plato</span>
								</>
							)}
						</label>
						<div className="grid min-w-[220px] flex-1 grid-cols-[1fr_120px] gap-3">
							<div className="flex flex-col gap-1.5">
								<label htmlFor="pn" className={labelClass}>Nombre</label>
								<Input id="pn" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
							</div>
							<div className="flex flex-col gap-1.5">
								<label htmlFor="pp" className={labelClass}>Precio</label>
								<div className="flex h-11 items-center rounded-xl border border-border bg-white pl-3 focus-within:ring-2 focus-within:ring-primary">
									<span className="text-[15px] text-muted-foreground">$</span>
									<input
										id="pp"
										inputMode="decimal"
										value={price}
										onChange={(e) => setPrice(e.target.value)}
										className="h-11 min-w-0 flex-1 bg-transparent px-2 text-[15px] outline-none"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-1.5">
						<label htmlFor="pd" className={labelClass}>
							Descripción <span className="font-normal text-muted-foreground">(opcional)</span>
						</label>
						<textarea
							id="pd"
							rows={2}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="rounded-xl border border-border bg-white px-3 py-2 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-primary"
						/>
					</div>
				</div>
				<div className="flex flex-wrap items-center justify-end gap-2 pt-2">
					<button
						type="button"
						disabled={saving}
						onClick={() => void skip()}
						className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
					>
						Lo hago después
					</button>
					<Button type="submit" disabled={!canSave} className="h-11 rounded-xl px-7 text-[15px] focus-visible:ring-2 focus-visible:ring-primary">
						Guardar y continuar
						<ArrowRight aria-hidden="true" />
					</Button>
				</div>
			</form>
			<aside className="flex flex-[1_1_300px] flex-col items-center gap-3">
				<span className="text-[13px] font-semibold text-muted-foreground">Vista previa en vivo</span>
				<MenuPreview
					name={establishment?.name ?? ""}
					type={establishment?.type ?? undefined}
					slug={establishment?.domain ?? ""}
					logoUrl={establishment?.logoUrl}
					bannerUrl={establishment?.bannerUrl}
					color={establishment?.mainHexColor}
					category={category.trim() || undefined}
					product={name.trim() ? { name: name.trim(), price: price || "0", description, photoUrl } : undefined}
				/>
			</aside>
		</>
	);
}
