import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useSaveEstablishment } from "@/hooks/useEstablishments";
import { useMenuEditor } from "@/hooks/useMenuEditor";
import { untranslatedCount } from "@/lib/panel";
import { schedulesToWeek } from "@/lib/schedule";
import { isValidSlug } from "@/lib/slug";
import { isSlugAvailable } from "@/services/establishments";
import type { EstablishmentProps } from "@/types/Establishment";
import { usePanel } from "../PanelContext";
import { PanelHeader } from "../components/PanelHeader";
import { ConfirmDialog } from "../menu/ConfirmDialog";
import { BrandSection } from "./BrandSection";
import { ContactSection } from "./ContactSection";
import { HoursSection } from "./HoursSection";
import { InfoSection } from "./InfoSection";
import { LanguageSection } from "./LanguageSection";
import { changedFields, toChangeValues } from "./changes";
import type { FormValues } from "./Section";
import { SocialSection } from "./SocialSection";
import { TaxSection } from "./TaxSection";

const INDEX = [
	["informacion", "Información"],
	["marca", "Marca"],
	["contacto", "Contacto y ubicación"],
	["horarios", "Horarios"],
	["redes", "Redes sociales"],
	["idiomas", "Idiomas y avisos"],
	["facturacion", "Facturación fiscal"],
];

const PHONE = /^[\d\s()+\-.]*$/;

function toForm(e: EstablishmentProps): FormValues {
	return {
		name: e.name ?? "",
		domain: e.domain ?? "",
		description: e.description ?? "",
		mainHexColor: e.mainHexColor ?? "",
		exactColor: e.exactColor ?? false,
		address: e.address ?? "",
		addressLink: e.addressLink ?? "",
		phone: e.phone ?? "",
		whatsapp: e.whatsapp ?? "",
		week: schedulesToWeek(e.schedules).week,
		social: (e.socialNetworks ?? []).map((s) => ({ ...s })),
		enableMultiLanguage: e.enableMultiLanguage ?? false,
		showFoodAllergyAndRiskDisclaimer: e.showFoodAllergyAndRiskDisclaimer ?? false,
		requiresTaxReceipt: e.requiresTaxReceipt ?? false,
		rnc: e.rnc ?? "",
		companyName: e.companyName ?? "",
	};
}

export default function EstablishmentPage() {
	const { establishment: est, reload } = usePanel();
	const { products } = useMenuEditor(est.id);
	const [save, saving, saveError] = useSaveEstablishment();
	const [logo, setLogo] = useState<File | null | undefined>(undefined);
	const [banner, setBanner] = useState<File | null | undefined>(undefined);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [reloading, setReloading] = useState(false);

	useEffect(() => {
		if (saveError) toast.error("No pudimos guardar los cambios. Intenta de nuevo.");
	}, [saveError]);

	// Los datos viejos pueden no cumplir el formato: solo se valida lo que el dueño cambió.
	const schema = useMemo(() => {
		const lenient = (original: string | null, ok: (v: string) => boolean, message: string) =>
			z.string().refine((v) => v === (original ?? "") || !v.trim() || ok(v), message);
		return z.object({
			name: z.string().trim().min(1, "Escribe el nombre del establecimiento."),
			domain: z.string(),
			description: z.string(),
			mainHexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Escribe un color válido, por ejemplo #C2381F."),
			exactColor: z.boolean(),
			address: z.string(),
			addressLink: lenient(est.addressLink, (v) => { try { return /^https?:$/.test(new URL(v.trim()).protocol); } catch { return false; } }, "Escribe un enlace que empiece con https://"),
			phone: lenient(est.phone, (v) => PHONE.test(v), "Usa solo números y símbolos de teléfono."),
			whatsapp: lenient(est.whatsapp, (v) => PHONE.test(v), "Usa solo números y símbolos de teléfono."),
			week: z.array(z.object({ open: z.boolean(), from: z.string(), to: z.string() })),
			social: z.array(z.object({
				platform: z.string(),
				// @usuario y dominios sin esquema valen; un esquema que no sea http(s) (p. ej. javascript:) no.
				link: z.string().refine((v) => !/^[a-z][a-z0-9+.-]*:/i.test(v.trim()) || /^https?:\/\//i.test(v.trim()), "Escribe un enlace que empiece con https://"),
				displayName: z.string().optional(),
			})),
			enableMultiLanguage: z.boolean(),
			showFoodAllergyAndRiskDisclaimer: z.boolean(),
			requiresTaxReceipt: z.boolean(),
			rnc: z.string(),
			companyName: z.string(),
		});
	}, [est]);

	const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: toForm(est) });
	const { reset, setError, clearErrors, setValue, watch, handleSubmit } = form;

	// Tras guardar, `reload` trae el establecimiento nuevo y el formulario parte de él.
	useEffect(() => {
		reset(toForm(est));
		setLogo(undefined);
		setBanner(undefined);
	}, [est, reset]);

	const values = watch();
	const dirty = logo !== undefined || banner !== undefined || Object.keys(changedFields(est, toChangeValues(values, est))).length > 0;
	const busy = saving || reloading;

	const checkSlug = useCallback(
		async (slug: string) => {
			if (slug === est.domain) return clearErrors("domain"), true;
			const fail = (message: string) => (setError("domain", { message }), false);
			if (!isValidSlug(slug)) return fail("Usa de 3 a 40 letras minúsculas, números o guiones.");
			try {
				if (!(await isSlugAvailable(slug))) return fail("Ese enlace ya está en uso. Prueba con otro.");
			} catch {
				return fail("No pudimos comprobar el enlace. Intenta de nuevo.");
			}
			clearErrors("domain");
			return true;
		},
		[est.domain, setError, clearErrors]
	);

	const onSlugBlur = async (raw: string) => {
		setValue("domain", raw, { shouldDirty: true });
		await checkSlug(raw);
	};

	const doSave = () => {
		setConfirmOpen(false);
		const changes = changedFields(est, toChangeValues(form.getValues(), est));
		save(
			{
				...changes,
				id: est.id,
				...(logo !== undefined && { logo }),
				...(banner !== undefined && { banner }),
			},
			async () => {
				setReloading(true);
				try {
					await reload();
					toast.success("Guardado");
				} catch {
					toast.error("Guardamos los cambios, pero no pudimos actualizar la página. Recarga la página.");
				} finally {
					setReloading(false);
				}
			}
		);
	};

	const onSubmit = handleSubmit(async (v) => {
		if (v.domain !== est.domain) {
			if (!(await checkSlug(v.domain))) return;
			return setConfirmOpen(true);
		}
		doSave();
	});

	return (
		<>
			<PanelHeader title="Establecimiento" description="Los datos que ven tus clientes en el menú." />
			<FormProvider {...form}>
				<form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
					<nav aria-label="Secciones" className="hidden w-[200px] shrink-0 flex-col gap-1 lg:sticky lg:top-6 lg:flex">
						{INDEX.map(([id, label]) => (
							<a key={id} href={`#${id}`} className="rounded-xl px-3 py-2 text-[15px] font-medium hover:bg-muted">{label}</a>
						))}
					</nav>
					<div className="flex max-w-[720px] min-w-0 flex-1 flex-col gap-5">
						<InfoSection busy={busy} onSlugBlur={onSlugBlur} />
						<BrandSection logo={logo} banner={banner} onLogo={setLogo} onBanner={setBanner} busy={busy} />
						<ContactSection busy={busy} />
						<HoursSection busy={busy} />
						<SocialSection busy={busy} />
						<LanguageSection busy={busy} untranslated={untranslatedCount(products)} />
						<TaxSection busy={busy} />
					</div>
					</div>
					{dirty && (
						<div
							role="region"
							aria-label="Cambios sin guardar"
							className="sticky bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg lg:bottom-4"
						>
							<span className="text-sm font-semibold">Cambios sin guardar</span>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									disabled={busy}
									onClick={() => {
										reset(toForm(est));
										setLogo(undefined);
										setBanner(undefined);
									}}
								>
									Descartar
								</Button>
								<Button type="submit" loading={busy}>Guardar</Button>
							</div>
						</div>
					)}
				</form>
			</FormProvider>
			<ConfirmDialog
				open={confirmOpen}
				title="¿Cambiar el enlace del menú?"
				body="El QR impreso dejará de funcionar y tendrás que imprimirlo de nuevo."
				confirmLabel="Cambiar enlace"
				loading={busy}
				onConfirm={doSave}
				onOpenChange={setConfirmOpen}
			/>
		</>
	);
}
