import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/lib/authErrors";
import { sendVerificationEmail } from "@/services/auth";
import { auth } from "@/utils/firebase";

// Las cuentas migradas (anteriores a esta fecha) no ven el aviso.
const CUTOFF = new Date("2026-11-19T00:00:00-04:00");

export function VerifyEmailBanner() {
	const [sending, setSending] = useState(false);
	const user = auth.currentUser;
	if (!user || user.emailVerified !== false || new Date(user.metadata.creationTime ?? 0) < CUTOFF) return null;

	async function resend() {
		setSending(true);
		try {
			await sendVerificationEmail();
			toast.success("Te enviamos el correo de confirmación.");
		} catch (err) {
			const msg = authErrorMessage(err);
			toast.error(msg === "Algo salió mal. Inténtalo de nuevo." ? "No pudimos enviar el correo. Intenta de nuevo." : msg);
		} finally {
			setSending(false);
		}
	}

	return (
		<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-warning-bg px-5 py-3">
			<span className="text-[15px] font-semibold">Confirma tu correo para proteger tu cuenta.</span>
			<Button variant="outline" loading={sending} onClick={resend}>
				Reenviar correo
			</Button>
		</div>
	);
}
