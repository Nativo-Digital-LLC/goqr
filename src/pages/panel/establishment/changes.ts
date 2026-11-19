import { schedulesToWeek, weekToSchedules } from "../../../lib/schedule";
import type { FormValues } from "./Section";
import type { CreateEstablishmentParams, EstablishmentProps, ScheduleProps, SocialNetworkProps } from "@/types/Establishment";

export type ChangeValues = {
	name: string;
	domain: string;
	description: string;
	address: string;
	addressLink: string;
	phone: string;
	whatsapp: string;
	rnc: string;
	companyName: string;
	mainHexColor: string;
	exactColor: boolean;
	enableMultiLanguage: boolean;
	showFoodAllergyAndRiskDisclaimer: boolean;
	requiresTaxReceipt: boolean;
	schedules: ScheduleProps[];
	socialNetworks: SocialNetworkProps[];
};

const REQUIRED = ["name", "domain", "description", "address"] as const;
const OPTIONAL = ["addressLink", "phone", "whatsapp", "rnc", "companyName"] as const;
const FLAGS = ["enableMultiLanguage", "showFoodAllergyAndRiskDisclaimer", "requiresTaxReceipt", "exactColor"] as const;

/** Solo los campos editables que cambiaron. Nunca billing, isActive ni userId, aunque vengan en `values`. */
export function changedFields(original: EstablishmentProps, values: ChangeValues): Partial<CreateEstablishmentParams> {
	const out: Record<string, unknown> = {};
	for (const k of REQUIRED) {
		const v = values[k].trim();
		if (v !== (original[k] ?? "").trim()) out[k] = v;
	}
	for (const k of OPTIONAL) {
		const v = values[k].trim();
		if (v !== (original[k] ?? "").trim()) out[k] = v || null;
	}
	if (values.mainHexColor.toUpperCase() !== (original.mainHexColor ?? "").toUpperCase()) out.mainHexColor = values.mainHexColor.toUpperCase();
	for (const k of FLAGS) if (values[k] !== (original[k] ?? false)) out[k] = values[k];
	if (JSON.stringify(values.schedules) !== JSON.stringify(original.schedules ?? [])) out.schedules = values.schedules;
	if (JSON.stringify(values.socialNetworks) !== JSON.stringify(original.socialNetworks ?? [])) out.socialNetworks = values.socialNetworks;
	return out as Partial<CreateEstablishmentParams>;
}

/** Horarios y redes solo se reescriben si el dueño los tocó: los datos viejos quedan intactos. */
export function toChangeValues(v: FormValues, e: EstablishmentProps): ChangeValues {
	const { week: initial, unparsed } = schedulesToWeek(e.schedules);
	const { week, social, ...rest } = v;
	const socialEdited = JSON.stringify(social) !== JSON.stringify(e.socialNetworks ?? []);
	return {
		...rest,
		schedules: JSON.stringify(week) === JSON.stringify(initial) ? e.schedules ?? [] : weekToSchedules(week, unparsed),
		socialNetworks: socialEdited
			? social.filter((s) => s.link.trim()).map((s) => ({ ...s, platform: s.platform.toLowerCase(), link: s.link.trim() }))
			: e.socialNetworks ?? [],
	};
}

/** Índices de filas de redes con un esquema que no es http(s). Las filas sin tocar (iguales a la original en esa posición) no se validan. */
export function invalidSocialRows(rows: { platform: string; link: string }[], original: SocialNetworkProps[] = []): number[] {
	return rows.flatMap((r, i) => {
		const o = original[i];
		if (o && o.platform === r.platform && o.link === r.link) return [];
		const link = r.link.trim();
		return /^[a-z][a-z0-9+.-]*:/i.test(link) && !/^https?:\/\//i.test(link) ? [i] : [];
	});
}
