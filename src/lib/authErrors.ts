const BAD_LOGIN = "Correo o contraseña incorrectos.";
const EXPIRED_LINK = "Este enlace venció o ya se usó. Pide uno nuevo.";

const MESSAGES: Record<string, string> = {
	"auth/invalid-credential": BAD_LOGIN,
	"auth/wrong-password": BAD_LOGIN,
	"auth/user-not-found": "No hay una cuenta con ese correo.",
	"auth/email-already-in-use": "Ya hay una cuenta con ese correo. Ingresa o recupera tu contraseña.",
	"auth/weak-password": "La contraseña es muy débil.",
	"auth/too-many-requests": "Demasiados intentos. Espera unos minutos y vuelve a intentar.",
	"auth/expired-action-code": EXPIRED_LINK,
	"auth/invalid-action-code": EXPIRED_LINK,
	"auth/popup-closed-by-user": "",
};

/** Mensaje en español para un error de Firebase o de Appwrite ('' = no mostrar nada). */
export function authErrorMessage(error: unknown): string {
	const e = error as { code?: string; message?: string; response?: { status?: number } } | null;
	if (e?.code && e.code in MESSAGES) return MESSAGES[e.code];
	// Los HttpsError de Functions ya traen el texto en español (límite de reenvío, correo inválido).
	if ((e?.code === "functions/resource-exhausted" || e?.code === "functions/invalid-argument") && e.message) return e.message;
	// El login dual llama a Appwrite primero; su rechazo llega como 401 de axios.
	if (e?.response?.status === 401) return BAD_LOGIN;
	return "Algo salió mal. Inténtalo de nuevo.";
}
