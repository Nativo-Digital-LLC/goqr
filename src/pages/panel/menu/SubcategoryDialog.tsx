import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubcategoryProps } from "@/types/Subcategory";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export type SubcategoryValues = { es_name: string; en_name: string; photo?: File };

export function SubcategoryDialog({
	subcategory,
	loading,
	onSave,
	onClose,
}: {
	subcategory: SubcategoryProps | null;
	loading: boolean;
	onSave: (v: SubcategoryValues) => void;
	onClose: () => void;
}) {
	const [esName, setEsName] = useState(subcategory?.es_name ?? "");
	const [enName, setEnName] = useState(subcategory?.en_name ?? "");
	const [photo, setPhoto] = useState<File>();
	const [photoError, setPhotoError] = useState("");
	const [touched, setTouched] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const missing = !esName.trim();

	useEffect(() => {
		if (!photo) return setPreview(null);
		const url = URL.createObjectURL(photo);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [photo]);

	const pick = (f: File | undefined) => {
		if (!f) return;
		if (!TYPES.includes(f.type)) return setPhotoError("La foto debe ser JPG, PNG o WebP.");
		if (f.size > MAX_BYTES) return setPhotoError("La foto no puede pesar más de 10 MB.");
		setPhotoError("");
		setPhoto(f);
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		setTouched(true);
		if (missing) return;
		onSave({ es_name: esName.trim(), en_name: enName.trim(), photo });
	};

	const shown = preview ?? subcategory?.photoUrl ?? null;

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<form onSubmit={submit} className="flex flex-col gap-5">
					<DialogHeader>
						<DialogTitle>{subcategory ? "Editar subcategoría" : "Nueva subcategoría"}</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2">
						<Label htmlFor="sub-es">Nombre en español</Label>
						<Input id="sub-es" value={esName} onChange={(e) => setEsName(e.target.value)} aria-invalid={touched && missing} autoFocus />
						{touched && missing && <span className="text-sm text-destructive">Escribe el nombre de la subcategoría.</span>}
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="sub-en">Nombre en inglés (opcional)</Label>
						<Input id="sub-en" value={enName} onChange={(e) => setEnName(e.target.value)} />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="sub-photo">Foto (opcional)</Label>
						<div className="flex items-center gap-3">
							{shown && <img src={shown} alt="Vista previa de la foto" className="size-16 rounded-xl border border-border object-cover" />}
							<Input id="sub-photo" type="file" accept={TYPES.join(",")} onChange={(e) => pick(e.target.files?.[0])} />
						</div>
						<span className={`text-sm ${photoError ? "text-destructive" : "text-muted-foreground"}`}>
							{photoError || "JPG, PNG o WebP, hasta 10 MB."}
						</span>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
						<Button type="submit" loading={loading}>Guardar</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
