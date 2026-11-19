import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CategoryProps } from "@/types/Category";

export type CategoryValues = { es_name: string; en_name: string; enableSubcategories: boolean; hidden: boolean };

// Se monta solo mientras está abierto (el padre usa `key`), así el formulario siempre arranca limpio.
export function CategoryDialog({
	category,
	lockSubcategories,
	blockEnable,
	loading,
	onSave,
	onClose,
}: {
	category: CategoryProps | null;
	/** La categoría ya tiene subcategorías con productos: no se puede desactivar. */
	lockSubcategories: boolean;
	/** La categoría tiene productos sin subcategoría: activar subcategorías los dejaría fuera del menú. */
	blockEnable: boolean;
	loading: boolean;
	onSave: (v: CategoryValues) => void;
	onClose: () => void;
}) {
	const [esName, setEsName] = useState(category?.es_name ?? "");
	const [enName, setEnName] = useState(category?.en_name ?? "");
	const [subs, setSubs] = useState(category?.enableSubcategories ?? false);
	const [hidden, setHidden] = useState(category?.hidden ?? false);
	const [touched, setTouched] = useState(false);
	const enableBlocked = blockEnable && !subs;
	const missing = !esName.trim();

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		setTouched(true);
		if (missing) return;
		onSave({ es_name: esName.trim(), en_name: enName.trim(), enableSubcategories: subs, hidden });
	};

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent>
				<form onSubmit={submit} className="flex flex-col gap-5">
					<DialogHeader>
						<DialogTitle>{category ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2">
						<Label htmlFor="cat-es">Nombre en español</Label>
						<Input id="cat-es" value={esName} onChange={(e) => setEsName(e.target.value)} aria-invalid={touched && missing} autoFocus />
						{touched && missing && <span className="text-sm text-destructive">Escribe el nombre de la categoría.</span>}
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="cat-en">Nombre en inglés (opcional)</Label>
						<Input id="cat-en" value={enName} onChange={(e) => setEnName(e.target.value)} />
					</div>
					<div className="flex items-center justify-between gap-4">
						<div className="flex flex-col gap-0.5">
							<Label htmlFor="cat-subs">Usar subcategorías</Label>
							<span className="text-sm text-muted-foreground">
								{lockSubcategories
									? "No se puede desactivar: esta categoría tiene subcategorías con productos."
									: enableBlocked
									? "No se puede activar: esta categoría tiene productos sin subcategoría. Muévelos primero."
									: "Divide la categoría en secciones, por ejemplo Cervezas y Vinos."}
							</span>
						</div>
						<Switch id="cat-subs" checked={subs} onCheckedChange={setSubs} disabled={lockSubcategories || enableBlocked} />
					</div>
					<div className="flex items-center justify-between gap-4">
						<Label htmlFor="cat-hidden">Ocultar del menú</Label>
						<Switch id="cat-hidden" checked={hidden} onCheckedChange={setHidden} />
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
