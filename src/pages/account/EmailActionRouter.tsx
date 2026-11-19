import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

import ResetPasswordPage from "./ResetPasswordPage";
import VerifyEmailPage from "./VerifyEmailPage";

/**
 * Firebase usa una sola URL de acción para todas las plantillas de correo:
 * se decide por `mode` y, sin `mode`, cada ruta muestra lo de siempre.
 */
export default function EmailActionRouter({ children }: { children: ReactNode }) {
	const mode = useSearchParams()[0].get("mode");
	if (mode === "resetPassword") return <ResetPasswordPage />;
	if (mode === "verifyEmail") return <VerifyEmailPage />;
	return children;
}
