import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { slugifyInput } from "@/lib/slug";
import { usePanel } from "../PanelContext";
import { Field, Section, textarea, type FormValues } from "./Section";

export function InfoSection({ busy, onSlugBlur }: { busy: boolean; onSlugBlur: (slug: string) => void }) {
	const { establishment } = usePanel();
	const { register, watch, setValue, formState: { errors } } = useFormContext<FormValues>();
	const changed = watch("domain") !== establishment.domain;

	return (
		<Section id="informacion" title="Información">
			<Field id="name" label="Nombre" error={errors.name?.message}>
				<Input id="name" aria-invalid={!!errors.name} disabled={busy} {...register("name")} />
			</Field>
			<Field id="domain" label="Enlace del menú" error={errors.domain?.message}>
				<div className="flex items-center overflow-hidden rounded-md border border-input focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
					<span className="shrink-0 bg-secondary px-3 py-2 text-sm text-muted-foreground">goqr.com.do/m/</span>
					<Input
						id="domain"
						className="rounded-none border-0 shadow-none focus-visible:ring-0"
						aria-invalid={!!errors.domain}
						disabled={busy}
						value={watch("domain")}
						onChange={(e) => setValue("domain", slugifyInput(e.target.value), { shouldDirty: true })}
						onBlur={(e) => onSlugBlur(e.target.value.replace(/-+$/, ""))}
					/>
				</div>
				{changed && (
					<span className="text-[13px] text-muted-foreground">
						Si cambias el enlace, el QR impreso deja de funcionar y tendrás que imprimirlo de nuevo.
					</span>
				)}
			</Field>
			<Field id="description" label="Descripción corta" hint="Aparece debajo del nombre en el menú.">
				<textarea id="description" rows={2} className={textarea} disabled={busy} {...register("description")} />
			</Field>
		</Section>
	);
}
