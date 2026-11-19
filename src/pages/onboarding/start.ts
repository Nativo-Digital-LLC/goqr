import type { EstablishmentProps } from "@/types/Establishment";

export type Start = { establishment: EstablishmentProps | null; step: 1 | 2 | 3; finished: boolean };

/**
 * Dónde arranca el onboarding. Con `isNew` (añadir otro local) nunca se retoma
 * ni se redirige: empieza en blanco en el paso 1.
 */
export function pickStart(establishments: EstablishmentProps[], isNew: boolean): Start {
	const found = isNew ? null : establishments[0] ?? null;
	const saved = found?.onboardingStep;
	if (found && !(saved === 1 || saved === 2 || saved === 3)) return { establishment: found, step: 1, finished: true };
	return { establishment: found, step: (saved as 1 | 2 | 3) ?? 1, finished: false };
}
