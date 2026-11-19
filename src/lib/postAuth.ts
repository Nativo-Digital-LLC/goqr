/** Destino tras ingresar: onboarding si no hay establecimiento o quedó en los pasos 1 a 3. */
export function postAuthPath(
	establishments: { onboardingStep?: number | null }[]
): "/onboarding" | "/dashboard" {
	if (establishments.length === 0) return "/onboarding";
	const step = establishments[0].onboardingStep;
	return step != null && step >= 1 && step <= 3 ? "/onboarding" : "/dashboard";
}
