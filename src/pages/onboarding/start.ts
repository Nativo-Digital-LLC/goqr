import type { EstablishmentProps } from "@/types/Establishment";

export type Start = { establishment: EstablishmentProps | null; step: 1 | 2 | 3; finished: boolean };

/**
 * Dónde arranca el onboarding. Con `isNew` (añadir otro local) nunca se redirige:
 * empieza en blanco en el paso 1, salvo que `resumeId` sea un local propio aún en curso (recarga).
 */
export function pickStart(establishments: EstablishmentProps[], isNew: boolean, resumeId?: string | null): Start {
	let found: EstablishmentProps | null = establishments[0] ?? null;
	if (isNew) {
		const mine = resumeId ? establishments.find((e) => e.id === resumeId) : undefined;
		const s = mine?.onboardingStep;
		found = s === 1 || s === 2 || s === 3 ? mine! : null;
	}
	const saved = found?.onboardingStep;
	if (found && !(saved === 1 || saved === 2 || saved === 3)) return { establishment: found, step: 1, finished: true };
	return { establishment: found, step: (saved as 1 | 2 | 3) ?? 1, finished: false };
}
