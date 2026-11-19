import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext, type FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type PriceRow = { label: string; price: string };

/** Filas Etiqueta + Precio dentro de un formulario react-hook-form con campo `prices`. */
export function PricesField({ disabled }: { disabled?: boolean }) {
	const { control, register, formState: { errors } } = useFormContext<{ prices: PriceRow[] } & FieldValues>();
	const { fields, append, remove } = useFieldArray({ control, name: "prices" });

	return (
		<fieldset className="flex flex-col gap-2.5">
			<legend className="mb-2.5 text-sm font-semibold">Precios</legend>
			{fields.map((f, i) => {
				const err = errors.prices?.[i]?.price?.message as string | undefined;
				return (
					<div key={f.id} className="flex flex-col gap-1">
						<div className="grid grid-cols-[minmax(0,1fr)_130px_44px] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_160px_44px]">
							<Input placeholder="Etiqueta (opcional)" aria-label="Etiqueta del precio" disabled={disabled} {...register(`prices.${i}.label`)} />
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>$</span>
								<Input className="pl-7" inputMode="decimal" placeholder="0.00" aria-label="Precio" aria-invalid={!!err} disabled={disabled} {...register(`prices.${i}.price`)} />
							</div>
							<Button type="button" variant="ghost" size="icon" aria-label="Quitar precio" disabled={disabled || fields.length === 1} onClick={() => remove(i)}>
								<Trash2 />
							</Button>
						</div>
						{err && <span className="text-sm text-destructive">{err}</span>}
					</div>
				);
			})}
			<Button type="button" variant="outline" className="self-start" disabled={disabled} onClick={() => append({ label: "", price: "" })}>
				<Plus /> Añadir otro precio (tamaño, porción…)
			</Button>
		</fieldset>
	);
}
