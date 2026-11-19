import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { parsePrice } from "@/lib/price";
import { ProductStatus, type ProductProps } from "@/types/Product";

const STATUSES = [
	{ value: ProductStatus.Visible, label: "Visible", color: "text-success" },
	{ value: ProductStatus.NotAvailable, label: "Agotado", color: "text-warning" },
	{ value: ProductStatus.Hidden, label: "Oculto", color: "text-muted-foreground" },
];

/** Cambio rápido de precio y estado desde el celular; el resto se edita en la página completa. */
export function QuickEditSheet({
	product,
	saving,
	onSave,
	onClose,
}: {
	product: ProductProps | null;
	saving: boolean;
	onSave: (prices: ProductProps["prices"], status: ProductStatus) => void;
	onClose: () => void;
}) {
	return (
		<Sheet open={!!product} onOpenChange={(o) => !o && !saving && onClose()}>
			<SheetContent side="bottom" className="rounded-t-3xl">
				{product && <Form key={product.id} product={product} saving={saving} onSave={onSave} />}
			</SheetContent>
		</Sheet>
	);
}

function Form({ product, saving, onSave }: { product: ProductProps; saving: boolean; onSave: (prices: ProductProps["prices"], status: ProductStatus) => void }) {
	const [values, setValues] = useState(() => product.prices.map((p) => String(p.price)));
	const [status, setStatus] = useState(product.status ?? ProductStatus.Visible);
	const [invalid, setInvalid] = useState(false);

	const submit = () => {
		const parsed = values.map(parsePrice);
		if (parsed.some((n) => n === null)) return setInvalid(true);
		// Mismas etiquetas; solo cambian los números.
		onSave(product.prices.map((p, i) => ({ ...p, price: parsed[i] as number })), status);
	};

	return (
		<>
			<SheetHeader className="gap-3 px-5 pb-0 pt-5">
				<div className="flex items-center gap-3 pr-8">
					{product.photoUrl
						? <img src={product.photoUrl} alt="" className="size-[52px] shrink-0 rounded-xl object-cover" />
						: <span className="size-[52px] shrink-0 rounded-xl bg-secondary" aria-hidden />}
					<div className="flex min-w-0 flex-col gap-0.5">
						<SheetTitle className="truncate text-lg font-bold">{product.es_name}</SheetTitle>
						<SheetDescription>Cambio rápido</SheetDescription>
					</div>
				</div>
			</SheetHeader>
			<div className="flex flex-col gap-4 px-5 pb-8">
				{values.length > 0 && (
					<fieldset className="flex flex-col gap-2.5">
						<legend className="mb-2.5 text-sm font-semibold">Precios</legend>
						{values.map((v, i) => (
							<div key={i} className="grid grid-cols-[minmax(0,1fr)_130px] gap-2">
								<span className="flex h-12 items-center truncate rounded-xl bg-secondary px-3.5 text-base text-muted-foreground">{product.prices[i].label || "Precio"}</span>
								<Input
									className="h-12 text-base font-semibold"
									inputMode="decimal"
									aria-label={`Precio${product.prices[i].label ? ` ${product.prices[i].label}` : ""}`}
									aria-invalid={invalid && parsePrice(v) === null}
									disabled={saving}
									value={v}
									onChange={(e) => {
										setInvalid(false);
										setValues((cur) => cur.map((x, j) => (j === i ? e.target.value : x)));
									}}
								/>
							</div>
						))}
						{invalid && <span className="text-sm text-destructive" role="alert">Escribe un precio válido.</span>}
					</fieldset>
				)}
				<div className="grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
					{STATUSES.map((s) => (
						<button
							key={s.value}
							type="button"
							aria-pressed={status === s.value}
							disabled={saving}
							onClick={() => setStatus(s.value)}
							className={`h-11 rounded-[9px] text-sm ${status === s.value ? `bg-card font-semibold shadow-sm ${s.color}` : "font-medium text-muted-foreground"}`}
						>
							{s.label}
						</button>
					))}
				</div>
				<div className="flex gap-2">
					<Button asChild variant="outline" className="h-12 flex-1"><Link to={`/dashboard/menu/product/${product.id}`}>Editar todo</Link></Button>
					<Button className="h-12 flex-1" loading={saving} disabled={saving} onClick={submit}>Guardar</Button>
				</div>
			</div>
		</>
	);
}
