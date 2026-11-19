import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { usePanel } from "../PanelContext";
import { Field, Section, type FormValues } from "./Section";

export function ContactSection({ busy }: { busy: boolean }) {
	const { establishment } = usePanel();
	const { register, formState: { errors } } = useFormContext<FormValues>();

	return (
		<Section id="contacto" title="Contacto y ubicación">
			<Field id="address" label="Dirección">
				<Input id="address" disabled={busy} {...register("address")} />
			</Field>
			<Field
				id="addressLink"
				label="Enlace de Google Maps"
				error={errors.addressLink?.message}
				hint={establishment.googlePlaceId ? "Con este enlace también mostramos el botón \"Déjanos tu reseña\"." : undefined}
			>
				<Input id="addressLink" inputMode="url" aria-invalid={!!errors.addressLink} disabled={busy} {...register("addressLink")} />
			</Field>
			<div className="grid gap-4 sm:grid-cols-2">
				<Field id="phone" label="Teléfono" error={errors.phone?.message}>
					<Input id="phone" type="tel" aria-invalid={!!errors.phone} disabled={busy} {...register("phone")} />
				</Field>
				<Field id="whatsapp" label="WhatsApp" error={errors.whatsapp?.message}>
					<Input id="whatsapp" type="tel" aria-invalid={!!errors.whatsapp} disabled={busy} {...register("whatsapp")} />
				</Field>
			</div>
		</Section>
	);
}
