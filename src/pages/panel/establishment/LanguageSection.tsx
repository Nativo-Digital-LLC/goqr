import { Link } from "react-router-dom";
import { useFormContext } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { Section, SwitchRow, type FormValues } from "./Section";

export function LanguageSection({ busy, untranslated }: { busy: boolean; untranslated: number }) {
	const { watch, setValue } = useFormContext<FormValues>();
	const en = watch("enableMultiLanguage");

	return (
		<Section id="idiomas" title="Idiomas y avisos">
			<SwitchRow id="enableMultiLanguage" label="Menú en inglés" hint="Tus clientes podrán cambiar entre español e inglés.">
				<Switch id="enableMultiLanguage" checked={en} disabled={busy} onCheckedChange={(v) => setValue("enableMultiLanguage", v, { shouldDirty: true })} />
			</SwitchRow>
			{en && untranslated > 0 && (
				<span className="text-sm text-muted-foreground">
					{untranslated} {untranslated === 1 ? "producto aún sin traducir" : "productos aún sin traducir"}.{" "}
					<Link to="/dashboard/menu" className="font-semibold text-brand hover:underline">Ir al menú</Link>
				</span>
			)}
			<SwitchRow id="allergy" label="Aviso de alergias">
				<Switch id="allergy" checked={watch("showFoodAllergyAndRiskDisclaimer")} disabled={busy} onCheckedChange={(v) => setValue("showFoodAllergyAndRiskDisclaimer", v, { shouldDirty: true })} />
			</SwitchRow>
		</Section>
	);
}
