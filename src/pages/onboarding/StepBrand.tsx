import { ArrowRight, TriangleAlert, Upload } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { readableOn } from "@/lib/color";
import { MenuPreview } from "./MenuPreview";
import { imageDrop, useFilePreview } from "./useFilePreview";
import { StepProps } from "./useOnboarding";

const PRESETS = [
	{ hex: "#E86B2A", name: "Naranja" },
	{ hex: "#B91C1C", name: "Rojo" },
	{ hex: "#166534", name: "Verde" },
	{ hex: "#1F4E79", name: "Azul" },
	{ hex: "#6B21A8", name: "Morado" },
	{ hex: "#1C1917", name: "Negro" },
];

const HEX = /^#[0-9a-f]{6}$/i;
const labelClass = "text-sm font-semibold";
const ghostBtn =
	"inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50";

export function StepBrand({ establishment, saveStep, saving, setSaving, saveRef }: StepProps) {
	const [logo, setLogo] = useState<File | null>(null);
	const [banner, setBanner] = useState<File | null>(null);
	const [color, setColor] = useState((establishment?.mainHexColor ?? "#C2381F").toUpperCase());
	const [hexText, setHexText] = useState(color);
	const [exact, setExact] = useState(establishment?.exactColor ?? false);
	const logoUrl = useFilePreview(logo) ?? establishment?.logoUrl ?? null;
	const bannerUrl = useFilePreview(banner) ?? establishment?.bannerUrl ?? null;

	const readable = readableOn(color);

	function pick(hex: string) {
		const v = hex.toUpperCase();
		setHexText(v);
		if (HEX.test(v)) setColor(v);
	}

	async function go(data: Parameters<typeof saveStep>[1]) {
		setSaving(true);
		try {
			await saveStep(3, data);
			return true;
		} catch {
			toast.error("No pudimos guardar tu marca. Intenta de nuevo.");
			return false;
		} finally {
			setSaving(false);
		}
	}

	async function save() {
		if (saving || !HEX.test(hexText)) return null;
		return go({ ...(logo && { logo }), ...(banner && { banner }), mainHexColor: color, exactColor: exact });
	}

	useEffect(() => {
		saveRef.current = save;
		return () => {
			saveRef.current = null;
		};
	});

	function submit(e: FormEvent) {
		e.preventDefault();
		void save();
	}

	const dropClass =
		"flex cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-white text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary";

	return (
		<>
			<form onSubmit={submit} className="flex min-w-0 max-w-[600px] flex-[999_1_480px] flex-col gap-6">
				<fieldset disabled={saving} className="contents">
				<div className="flex flex-col gap-2">
					<h1 className="font-display text-[28px] font-bold tracking-[-0.02em] sm:text-4xl">Dale tu cara al menú</h1>
					<p className="text-base text-muted-foreground">Tu logo, una foto de portada y tu color. Mira cómo queda a la derecha.</p>
				</div>
				<div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
					<div className="flex flex-col gap-1.5">
						<span className={labelClass}>Logo</span>
						<label className={`${dropClass} size-[140px]`} {...imageDrop((f) => !saving && setLogo(f))}>
							<input type="file" accept="image/*" className="sr-only" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
							{logoUrl ? (
								<img src={logoUrl} alt="Logo elegido" className="size-full object-cover" />
							) : (
								<>
									<Upload className="size-6 text-muted-foreground" aria-hidden="true" />
									<span className="text-sm text-muted-foreground">Subir logo</span>
								</>
							)}
						</label>
						{logoUrl && <span className="text-sm font-semibold">Cambiar</span>}
					</div>
					<div className="flex flex-col gap-1.5">
						<span className={labelClass}>Foto de portada</span>
						<label className={`${dropClass} h-[140px] px-3`} {...imageDrop((f) => !saving && setBanner(f))}>
							<input type="file" accept="image/*" className="sr-only" onChange={(e) => setBanner(e.target.files?.[0] ?? null)} />
							{bannerUrl ? (
								<img src={bannerUrl} alt="Portada elegida" className="size-full object-cover" />
							) : (
								<>
									<Upload className="size-7 text-muted-foreground" aria-hidden="true" />
									<span className="text-sm font-semibold">Arrastra una foto o toca para subir</span>
									<span className="text-xs text-muted-foreground">JPG o PNG · horizontal</span>
								</>
							)}
						</label>
						{bannerUrl && <span className="text-sm font-semibold">Cambiar</span>}
					</div>
				</div>
				<fieldset className="flex flex-col gap-3">
					<legend className={`${labelClass} mb-3`}>Color principal</legend>
					<div className="flex flex-wrap items-center gap-2.5">
						{PRESETS.map((p) => (
							<button
								key={p.hex}
								type="button"
								aria-label={`${p.name} ${p.hex}${color === p.hex ? " (seleccionado)" : ""}`}
								aria-pressed={color === p.hex}
								onClick={() => pick(p.hex)}
								className={`size-11 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
									color === p.hex ? "ring-2 ring-primary ring-offset-2" : "border border-border"
								}`}
								style={{ background: p.hex }}
							/>
						))}
						<label className="flex h-11 items-center gap-2 rounded-xl border border-border bg-white pl-2 pr-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
							<input
								type="color"
								value={color.toLowerCase()}
								onChange={(e) => pick(e.target.value)}
								aria-label="Selector de color"
								className="size-7 cursor-pointer rounded border-0 bg-transparent p-0"
							/>
							<span className="text-xs font-semibold text-muted-foreground">HEX</span>
							<input
								type="text"
								value={hexText}
								maxLength={7}
								onChange={(e) => pick(e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`)}
								aria-label="Color personalizado"
								className="w-[84px] bg-transparent text-sm font-semibold outline-none"
							/>
						</label>
					</div>
					{!HEX.test(hexText) && <span className="text-[13px] font-semibold text-error">Escribe un color HEX válido, como #C2381F.</span>}
					{!readable.ok && (
						<div role="status" className="flex gap-3 rounded-xl bg-warning-bg p-3.5">
							<TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
							<div className="flex flex-col gap-2.5 text-sm">
								<span>
									<strong>Este color se lee mal como texto sobre blanco.</strong> Lo usamos tal cual en botones y fondos
									{exact ? ", y también como texto porque así lo prefieres." : <>, y para precios y enlaces lo oscurecimos a <strong>{readable.text}</strong>.</>}
								</span>
								<div className="flex flex-wrap items-center gap-2.5">
									<span className="size-5 rounded border border-border" style={{ background: color }} aria-hidden="true" />
									<ArrowRight className="size-4" aria-hidden="true" />
									<span className="size-5 rounded border border-border" style={{ background: exact ? color : readable.text }} aria-hidden="true" />
									<label className="flex items-center gap-2 text-sm font-semibold">
										<Switch checked={exact} onCheckedChange={setExact} />
										Usar mi color exacto igual
									</label>
								</div>
							</div>
						</div>
					)}
				</fieldset>
				<div className="flex flex-wrap items-center justify-end gap-2 pt-2">
					<button type="button" disabled={saving} onClick={() => void go({})} className={ghostBtn}>
						Omitir por ahora
					</button>
					<Button type="submit" loading={saving} disabled={!HEX.test(hexText)} className="h-11 rounded-xl px-7 text-[15px] focus-visible:ring-2 focus-visible:ring-primary">
						Continuar
						<ArrowRight aria-hidden="true" />
					</Button>
				</div>
				</fieldset>
			</form>
			<aside className="flex flex-[1_1_300px] flex-col items-center gap-3">
				<span className="text-[13px] font-semibold text-muted-foreground">Vista previa en vivo</span>
				<MenuPreview
					name={establishment?.name ?? ""}
					type={establishment?.type ?? undefined}
					phone={establishment?.phone ?? undefined}
					slug={establishment?.domain ?? ""}
					logoUrl={logoUrl}
					bannerUrl={bannerUrl}
					color={color}
					exactColor={exact}
					category="Entradas"
				/>
			</aside>
		</>
	);
}
