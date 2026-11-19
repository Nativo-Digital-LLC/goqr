import { applyActionCode, reload } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { AuthLayout } from "@/layouts/AuthLayout";
import { authErrorMessage } from "@/lib/authErrors";
import { postAuthPath } from "@/lib/postAuth";
import { sendVerificationEmail } from "@/services/auth";
import { getEstablishmentsByUserId } from "@/services/establishments";
import { useSessionStore } from "@/store/session";
import { auth } from "@/utils/firebase";

type Status = "loading" | "pending" | "verified" | "expired" | "failed" | "login";

const cardClass = "flex flex-col gap-5 rounded-[20px] border border-border bg-white p-6 sm:p-8";
const btnClass = "rounded-xl focus-visible:ring-2 focus-visible:ring-primary";
const h1Class = "font-display text-[28px] font-bold tracking-[-0.02em]";
const pClass = "text-[15px] leading-normal text-muted-foreground";

export default function VerifyEmailPage() {
	const oobCode = useSearchParams()[0].get("oobCode");
	const navigate = useNavigate();
	const session = useSessionStore((s) => s.session);
	const setSession = useSessionStore((s) => s.setSession);
	const [logout] = useLogout();
	const [status, setStatus] = useState<Status>("loading");
	const [attempt, setAttempt] = useState(0);
	const [busy, setBusy] = useState(false);
	const [destError, setDestError] = useState("");

	useEffect(() => {
		let cancelled = false;
		setStatus("loading");
		(async () => {
			try {
				if (oobCode) await applyActionCode(auth, oobCode);
				await auth.authStateReady();
				const user = auth.currentUser;
				if (!oobCode && !user) return !cancelled && setStatus("login");
				if (user) {
					await reload(user);
					// Que el resto de la app vea el correo ya verificado.
					const current = useSessionStore.getState().session;
					if (current && user.emailVerified !== current.user.emailVerified) {
						setSession({ ...current, user: { ...current.user, emailVerified: user.emailVerified } });
					}
				}
				if (!cancelled) setStatus(oobCode || user?.emailVerified ? "verified" : "pending");
			} catch (err) {
				if (cancelled) return;
				// Solo un código vencido o inválido es "enlace vencido"; el resto (p. ej. red) se puede reintentar.
				const code = (err as { code?: string })?.code;
				setStatus(code === "auth/expired-action-code" || code === "auth/invalid-action-code" ? "expired" : "failed");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [oobCode, attempt, setSession]);

	async function resend() {
		setBusy(true);
		try {
			await sendVerificationEmail();
			toast.success("Te enviamos otro enlace.");
		} catch (err) {
			toast.error(authErrorMessage(err));
		} finally {
			setBusy(false);
		}
	}

	async function continueTo() {
		const uid = session?.userId ?? auth.currentUser?.uid;
		if (!uid) return navigate("/login");
		setBusy(true);
		setDestError("");
		try {
			navigate(postAuthPath(await getEstablishmentsByUserId(uid)));
		} catch (err) {
			setDestError(authErrorMessage(err));
			setBusy(false);
		}
	}

	if (status === "login") return <Navigate to="/login" replace />;

	if (status === "loading") {
		return (
			<AuthLayout>
				<p role="status" className="text-center text-[15px] text-muted-foreground">
					Comprobando tu correo…
				</p>
			</AuthLayout>
		);
	}

	if (status === "failed") {
		return (
			<AuthLayout>
				<div className={cardClass}>
					<div className="flex flex-col gap-2">
						<h1 className={h1Class}>No pudimos comprobar tu correo</h1>
						<p role="alert" className={pClass}>
							{authErrorMessage(null)}
						</p>
					</div>
					<Button className={btnClass} onClick={() => setAttempt((a) => a + 1)}>
						Reintentar
					</Button>
				</div>
			</AuthLayout>
		);
	}

	if (status === "expired") {
		return (
			<AuthLayout>
				<div className={cardClass}>
					<div className="flex flex-col gap-2">
						<h1 className={h1Class}>Este enlace venció</h1>
						<p className={pClass}>Por seguridad, los enlaces duran un tiempo limitado. Pide uno nuevo y listo.</p>
					</div>
					{session && (
						<Button className={btnClass} disabled={busy} onClick={resend}>
							Enviar enlace nuevo
						</Button>
					)}
					<Button asChild variant={session ? "outline" : "default"} className={btnClass}>
						<Link to="/login">Ir a ingresar</Link>
					</Button>
				</div>
			</AuthLayout>
		);
	}

	if (status === "verified") {
		return (
			<AuthLayout>
				<div className={cardClass}>
					<div className="flex flex-col gap-2">
						<h1 className={h1Class}>¡Correo verificado!</h1>
						<p className={pClass}>Tu cuenta está activa. Vamos a montar tu menú: son 4 pasos cortos.</p>
					</div>
					{destError && (
						<p role="alert" className="text-sm text-error">
							{destError}
						</p>
					)}
					<Button className={btnClass} disabled={busy} onClick={continueTo}>
						Empezar
					</Button>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout>
			<div className={cardClass}>
				<div className="flex flex-col gap-2">
					<h1 className={h1Class}>Confirma tu correo</h1>
					<p className={pClass}>
						Te enviamos un enlace a <strong className="text-primary">{session?.user.email ?? auth.currentUser?.email}</strong>. Ábrelo
						desde tu celular o computadora para activar tu cuenta.
					</p>
				</div>
				{destError && (
					<p role="alert" className="text-sm text-error">
						{destError}
					</p>
				)}
				<Button className={btnClass} disabled={busy} onClick={resend}>
					Reenviar correo
				</Button>
				<Button variant="outline" className={btnClass} onClick={() => logout(() => navigate("/register"))}>
					Cambiar correo
				</Button>
				<Button variant="link" className="focus-visible:ring-2 focus-visible:ring-primary" disabled={busy} onClick={continueTo}>
					Seguir sin verificar
				</Button>
			</div>
		</AuthLayout>
	);
}
