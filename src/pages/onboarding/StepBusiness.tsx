import { ArrowRight, Check } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidSlug, slugify, slugifyInput } from "@/lib/slug";
import { isSlugAvailable } from "@/services/establishments";
import { EstablishmentType } from "@/types/Establishment";
import { MenuPreview } from "./MenuPreview";
import { TYPE_LABELS } from "./typeLabels";
import { StepProps } from "./useOnboarding";

type SlugStatus = "idle" | "invalid" | "checking" | "available" | "taken" | "error";
type SlugResult = { slug: string; status: "available" | "taken" | "error" };

const labelClass = "text-sm font-semibold";
const hintClass = "text-[13px] text-muted-foreground";
const fieldClass = "rounded-xl border-border bg-white text-[15px] focus-visible:ring-2 focus-visible:ring-primary";

export function StepBusiness({ establishment, saveStep, saving, setSaving, saveRef }: StepProps) {
	const [name, setName] = useState(establishment?.name ?? "");
	const [slug, setSlug] = useState(establishment?.domain ?? "");
	const [slugTouched, setSlugTouched] = useState(!!establishment?.domain);
	const [type, setType] = useState<EstablishmentType>(establishment?.type ?? "restaurant");
	const [phone, setPhone] = useState(establishment?.phone ?? "");
	const [whatsapp, setWhatsapp] = useState(establishment?.whatsapp ?? "");
	// Resultado de la comprobación junto con el slug exacto que se comprobó.
	const [result, setResult] = useState<SlugResult | null>(null);

	// El enlace que ya es del propio establecimiento cuenta como disponible.
	const isOwn = !!slug && slug === establishment?.domain;
	let status: SlugStatus = "checking";
	if (!slug) status = "idle";
	else if (!isValidSlug(slug)) status = "invalid";
	else if (isOwn) status = "available";
	else if (result?.slug === slug) status = result.status;

	useEffect(() => {
		if (!slug || !isValidSlug(slug) || isOwn) return;
		let cancelled = false;
		const timer = setTimeout(() => {
			isSlugAvailable(slug)
				.then((ok) => !cancelled && setResult({ slug, status: ok ? "available" : "taken" }))
				.catch(() => !cancelled && setResult({ slug, status: "error" }));
		}, 400);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [slug, isOwn]);

	function onName(value: string) {
		setName(value);
		if (!slugTouched) setSlug(slugify(value));
	}

	const canContinue = name.trim() !== "" && status === "available" && !saving;

	async function save() {
		// «Guardar y salir» mientras se comprueba el enlace: se espera la comprobación en vez de salir sin guardar.
		if (status === "checking" && name.trim() !== "" && !saving) {
			setSaving(true);
			const ok = await isSlugAvailable(slug).catch(() => null);
			setSaving(false);
			if (ok === null) return null;
			setResult({ slug, status: ok ? "available" : "taken" });
			if (!ok) return null;
		} else if (!canContinue) return null;
		setSaving(true);
		try {
			await saveStep(2, {
				name: name.trim(),
				domain: slug,
				type,
				phone: phone.trim(),
				whatsapp: whatsapp.trim() || null,
			});
			return true;
		} catch (err) {
			if ((err as Error).message === "slug-taken") {
				setResult({ slug, status: "taken" });
				toast.error("Ese enlace acaba de ocuparse, prueba otro.");
			} else toast.error("No pudimos guardar tus datos. Intenta de nuevo.");
			return false;
		} finally {
			setSaving(false);
		}
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

	const message: Record<SlugStatus, string | null> = {
		idle: null,
		invalid: "Solo minúsculas, números y guiones.",
		checking: "Comprobando…",
		available: "Disponible",
		taken: "Ya está en uso, prueba otro",
		error: "No pudimos comprobar el enlace. Intenta de nuevo.",
	};

	return (
		<>
			<form onSubmit={submit} className="flex min-w-0 max-w-[600px] flex-[999_1_480px] flex-col gap-6">
				<div className="flex flex-col gap-2">
					<h1 className="font-display text-[28px] font-bold tracking-[-0.02em] sm:text-4xl">Cuéntanos de tu restaurante</h1>
					<p className="text-base text-muted-foreground">
						Esto es lo que verán tus clientes arriba del menú. Lo puedes cambiar después.
					</p>
				</div>
				<div className="flex flex-col gap-1.5">
					<label htmlFor="name" className={labelClass}>Nombre del negocio</label>
					<Input id="name" value={name} onChange={(e) => onName(e.target.value)} className={fieldClass} />
				</div>
				<div className="flex flex-col gap-1.5">
					<label htmlFor="slug" className={labelClass}>Enlace de tu menú</label>
					<div className="flex h-11 items-center overflow-hidden rounded-xl border border-border bg-white focus-within:ring-2 focus-within:ring-primary">
						<span className="whitespace-nowrap pl-3.5 pr-1 text-[15px] text-muted-foreground">goqr.com.do/m/</span>
						<input
							id="slug"
							value={slug}
							onChange={(e) => {
								setSlugTouched(true);
								setSlug(slugifyInput(e.target.value));
							}}
							aria-describedby="slug-status"
							className="h-11 min-w-0 flex-1 bg-transparent pr-2 text-[15px] font-semibold outline-none"
						/>
					</div>
					<span
						id="slug-status"
						role="status"
						className={
							status === "available"
								? "flex items-center gap-1.5 text-[13px] font-semibold text-success"
								: status === "taken" || status === "invalid" || status === "error"
									? "text-[13px] font-semibold text-error"
									: hintClass
						}
					>
						{status === "available" && <Check className="size-3.5" aria-hidden="true" />}
						{message[status] ?? "Tu QR apuntará aquí para siempre."}
					</span>
				</div>
				<fieldset className="flex flex-col gap-2.5">
					<legend className={`${labelClass} mb-2.5`}>Tipo de negocio</legend>
					<div className="flex flex-wrap gap-2">
						{(Object.keys(TYPE_LABELS) as EstablishmentType[]).map((t) => (
							<label
								key={t}
								className={`flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 ${
									type === t ? "bg-primary text-primary-foreground" : "border border-border bg-white"
								}`}
							>
								<input
									type="radio"
									name="tipo"
									checked={type === t}
									onChange={() => setType(t)}
									className="m-0 accent-platano"
								/>
								{TYPE_LABELS[t]}
							</label>
						))}
					</div>
				</fieldset>
				<div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="tel" className={labelClass}>Teléfono</label>
						<Input id="tel" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(809) 000-0000" className={fieldClass} />
					</div>
					<div className="flex flex-col gap-1.5">
						<label htmlFor="wa" className={labelClass}>
							WhatsApp <span className="font-normal text-muted-foreground">(opcional)</span>
						</label>
						<Input id="wa" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(809) 000-0000" className={fieldClass} />
					</div>
				</div>
				<div className="flex justify-end pt-2">
					<Button type="submit" loading={saving} disabled={!canContinue} className="h-11 rounded-xl px-7 text-[15px] focus-visible:ring-2 focus-visible:ring-primary">
						Continuar
						<ArrowRight aria-hidden="true" />
					</Button>
				</div>
			</form>
			<aside className="flex flex-[1_1_300px] flex-col items-center gap-3">
				<span className="text-[13px] font-semibold text-muted-foreground">Vista previa en vivo</span>
				<MenuPreview name={name} type={type} phone={phone} slug={slug} />
			</aside>
		</>
	);
}
