import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getTaxInformation } from "@/services/establishments";
import type { TaxPayerProps } from "@/types/Establishment";
import { Field, Section, SwitchRow, type FormValues } from "./Section";

export function TaxSection({ busy }: { busy: boolean }) {
	const { register, watch, setValue } = useFormContext<FormValues>();
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<TaxPayerProps | "error" | null>(null);

	async function verify() {
		const rnc = watch("rnc").replace(/\D/g, "");
		setLoading(true);
		try {
			const data = rnc ? await getTaxInformation(rnc) : null;
			setResult(data ?? "error");
			if (data) setValue("companyName", data.name, { shouldDirty: true });
		} catch {
			setResult("error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Section id="facturacion" title="Facturación fiscal">
			<SwitchRow id="requiresTaxReceipt" label="Necesito comprobante fiscal">
				<Switch id="requiresTaxReceipt" checked={watch("requiresTaxReceipt")} disabled={busy} onCheckedChange={(v) => setValue("requiresTaxReceipt", v, { shouldDirty: true })} />
			</SwitchRow>
			{watch("requiresTaxReceipt") && (
				<>
					<Field id="rnc" label="RNC o cédula">
						<div className="flex gap-2">
							<Input id="rnc" inputMode="numeric" disabled={busy} {...register("rnc", { onChange: () => setResult(null) })} />
							<Button type="button" variant="outline" loading={loading} disabled={busy} onClick={verify}>Verificar</Button>
						</div>
						{result === "error" && <span role="alert" className="text-sm text-destructive">No encontramos ese RNC o cédula.</span>}
						{result && result !== "error" && (
							<span className="text-sm text-muted-foreground" role="status">Estado: {result.status.name} · {result.name}</span>
						)}
					</Field>
					<Field id="companyName" label="Razón social" hint="La completamos con los datos de la DGII. Puedes corregirla.">
						<Input id="companyName" disabled={busy} {...register("companyName")} />
					</Field>
				</>
			)}
		</Section>
	);
}
