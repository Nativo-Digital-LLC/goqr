import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


import { authErrorMessage } from "@/lib/authErrors";
import { postAuthPath } from "@/lib/postAuth";
import { getEstablishmentsByUserId } from "@/services/establishments";
import { useSessionStore } from "@/store/session";
import { auth } from "@/utils/firebase";

const ERROR_TOAST = "post-auth-error";

/**
 * Si ya hay sesión, manda al usuario a /onboarding o /dashboard.
 * Corre también justo después de un login con correo o Google (el hook de login escribe la
 * sesión en el store), así que las páginas no deben navegar por su cuenta en ese caso.
 */
/** Devuelve true mientras decide a dónde mandar al usuario (para dejar el botón cargando). */
export function useRedirectIfAuthenticated(): boolean {
	const navigate = useNavigate();
	// Se depende del objeto de sesión (no solo del uid): cada login lo reemplaza y relanza la consulta aunque sea el mismo usuario.
	const session = useSessionStore((state) => state.session);
	const setSession = useSessionStore((state) => state.setSession);
	const [attempt, setAttempt] = useState(0);
	const [redirecting, setRedirecting] = useState(false);

	useEffect(() => {
		if (!session) return;
		let cancelled = false;
		setRedirecting(true);
		toast.dismiss(ERROR_TOAST);
		// Se decide con el usuario real de Firebase: el del store puede ser una sesión vieja de localStorage.
		auth.authStateReady()
			.then(() => {
				const uid = auth.currentUser?.uid;
				if (!uid) {
					if (!cancelled) {
						setSession(null);
						setRedirecting(false);
					}
					return null;
				}
				return getEstablishmentsByUserId(uid).then((establishments) => ({ uid, establishments }));
			})
			.then((found) => {
				// Se pasa lo consultado para que /onboarding no repita la consulta (en Safari, recién creada la sesión, tardaba).
				if (found && !cancelled) navigate(postAuthPath(found.establishments), { replace: true, state: { prefetched: found } });
			})
			.catch((error) => {
				// Sin la consulta no se adivina el destino: se avisa y se permite reintentar.
				if (!cancelled) {
					setRedirecting(false);
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
	}, [session, setSession, navigate, attempt]);

	return redirecting;
}
