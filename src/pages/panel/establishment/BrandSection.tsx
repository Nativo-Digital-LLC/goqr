import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { readableOn } from "@/lib/color";
import { usePanel } from "../PanelContext";
import { PhotoField } from "../menu/PhotoField";
import { Field, Section, type FormValues } from "./Section";

type Photo = File | null | undefined;
const HEX = /^#[0-9A-Fa-f]{6}$/;

export function BrandSection({
	logo,
	banner,
	onLogo,
	onBanner,
	busy,
}: {
	logo: Photo;
	banner: Photo;
	onLogo: (v: Photo) => void;
	onBanner: (v: Photo) => void;
	busy: boolean;
}) {
	const { establishment } = usePanel();
	const { register, watch, setValue, formState: { errors } } = useFormContext<FormValues>();
	const color = watch("mainHexColor");
	const exact = watch("exactColor");
	const valid = HEX.test(color);
	const readable = valid ? readableOn(color) : null;
	const choice = (original: boolean, label: string, sample: string) => (
		<Button
			type="button"
			variant="outline"
			aria-pressed={exact === original}
			disabled={busy}
			className={cn("flex-1", exact === original && "border-primary ring-2 ring-primary/20")}
			onClick={() => setValue("exactColor", original, { shouldDirty: true })}
		>
			<span className="size-4 rounded-full border border-border" style={{ background: sample }} aria-hidden />
			{label}
		</Button>
	);

	return (
		<Section id="marca" title="Marca">
			<div className="flex flex-col gap-2">
				<span className="text-sm font-semibold">Logo</span>
				<PhotoField value={logo} currentUrl={establishment.logoUrl} onChange={onLogo} disabled={busy} />
			</div>
			<div className="flex flex-col gap-2">
				<span className="text-sm font-semibold">Banner · Foto de portada · 1600 × 600 recomendado</span>
				<PhotoField value={banner} currentUrl={establishment.bannerUrl} onChange={onBanner} disabled={busy} />
			</div>
			<Field id="mainHexColor" label="Color principal" error={errors.mainHexColor?.message}>
				<div className="flex items-center gap-3">
					<input
						type="color"
						aria-label="Elegir color"
						className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1"
						value={valid ? color : "#000000"}
						disabled={busy}
						onChange={(e) => setValue("mainHexColor", e.target.value.toUpperCase(), { shouldValidate: true })}
					/>
					<Input id="mainHexColor" className="max-w-[140px]" aria-invalid={!!errors.mainHexColor} disabled={busy} {...register("mainHexColor")} />
				</div>
			</Field>
			{readable?.ok && <span className="text-sm text-muted-foreground">Se lee bien</span>}
			{readable && !readable.ok && (
				<div className="flex flex-col gap-3 rounded-xl bg-secondary p-4">
					<span className="text-sm">Este color es claro para texto blanco. En los botones usaremos un tono más oscuro para que se lea bien.</span>
					<div className="flex gap-3">
						{choice(true, "Original", color)}
						{choice(false, "Ajustado", readable.text)}
					</div>
				</div>
			)}
		</Section>
	);
}
