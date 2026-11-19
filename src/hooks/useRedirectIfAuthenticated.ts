import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


import { authErrorMessage } from "@/lib/authErrors";
import { postAuthPath } from "@/lib/postAuth";
import { getEstablishmentsByUserId } from "@/services/establishments";
import { useSessionStore } from "@/store/session";

const ERROR_TOAST = "post-auth-error";

/**
 * Si ya hay sesión, manda al usuario a /onboarding o /dashboard.
 * Corre también justo después de un login con correo o Google (el hook de login escribe la
 * sesión en el store), así que las páginas no deben navegar por su cuenta en ese caso.
 */
export function useRedirectIfAuthenticated(): void {
	const navigate = useNavigate();
	// Se depende del objeto de sesión (no solo del uid): cada login lo reemplaza y relanza la consulta aunque sea el mismo usuario.
	const session = useSessionStore((state) => state.session);
	const userId = session?.userId;
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		if (!userId) return;
		let cancelled = false;
		toast.dismiss(ERROR_TOAST);
		getEstablishmentsByUserId(userId)
			.then((establishments) => {
				if (!cancelled) navigate(postAuthPath(establishments), { replace: true });
			})
			.catch((error) => {
				// Sin la consulta no se adivina el destino: se avisa y se permite reintentar.
				if (!cancelled) {
					toast.error(authErrorMessage(error), {
						id: ERROR_TOAST,
						duration: Infinity,
						action: { label: "Reintentar", onClick: () => setAttempt((a) => a + 1) },
					});
				}
			});
		return () => {
			cancelled = true;
			toast.dismiss(ERROR_TOAST);
		};
	}, [session, userId, navigate, attempt]);
}
