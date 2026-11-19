import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { postAuthPath } from "@/lib/postAuth";
import { getEstablishmentsByUserId } from "@/services/establishments";
import { useSessionStore } from "@/store/session";

/**
 * Si ya hay sesión, manda al usuario a /onboarding o /dashboard.
 * Corre también justo después de un login con correo (el hook de login escribe la
 * sesión en el store), así que las páginas no deben navegar por su cuenta en ese caso.
 */
export function useRedirectIfAuthenticated(): void {
	const navigate = useNavigate();
	const userId = useSessionStore(({ session }) => session?.userId);

	useEffect(() => {
		if (!userId) return;
		let cancelled = false;
		getEstablishmentsByUserId(userId)
			.then((establishments) => {
				if (!cancelled) navigate(postAuthPath(establishments), { replace: true });
			})
			.catch(() => {
				// Sin poder leer los establecimientos no se adivina el destino: se queda en la página.
			});
		return () => {
			cancelled = true;
		};
	}, [userId, navigate]);
}
