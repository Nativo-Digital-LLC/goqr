import { ActionCodeOperation, applyActionCode, checkActionCode, reload } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
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

// "other": se verificó una cuenta distinta de la que está abierta (o no hay ninguna abierta).
type Status = "loading" | "pending" | "verified" | "other" | "expired" | "failed" | "login";

const cardClass = "flex flex-col gap-5 rounded-[20px] border border-border bg-white p-6 sm:p-8";
const btnClass = "rounded-xl focus-visible:ring-2 focus-visible:ring-primary";
const h1Class = "font-display text-[28px] font-bold tracking-[-0.02em]";
const pClass = "text-[15px] leading-normal text-muted-foreground";

export default function VerifyEmailPage() {
	const oobCode = useSearchParams()[0].get("oobCode");
	const navigate = useNavigate();
	const setSession = useSessionStore((s) => s.setSession);
	const [logout] = useLogout();
	const [status, setStatus] = useState<Status>("loading");
	const [attempt, setAttempt] = useState(0);
	const [busy, setBusy] = useState(false);
	const [destError, setDestError] = useState("");
	// Un código se usa una sola vez: si el refresco falla, reintentar no debe volver a aplicarlo.
	const applied = useRef<{ code: string; email: string } | null>(null);
	// Usuario real de Firebase (no el del store, que puede quedar viejo en localStorage).
	const [email, setEmail] = useState<string | null>(null);
	const [hasUser, setHasUser] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setStatus("loading");
		(async () => {
			try {
				if (oobCode && applied.current?.code !== oobCode) {
					// Antes de aplicarlo: el correo de la cuenta, y nunca se gasta un código de otro tipo.
					const info = await checkActionCode(auth, oobCode);
					if (info.operation !== ActionCodeOperation.VERIFY_EMAIL) throw { code: "auth/invalid-action-code" };
					await applyActionCode(auth, oobCode);
					applied.current = { code: oobCode, email: info.data.email ?? "" };
				}
				await auth.authStateReady();
				const user = auth.currentUser;
				if (!cancelled) {
					setHasUser(!!user);
					setEmail(oobCode ? applied.current!.email : (user?.email ?? null));
				}
				if (!oobCode && !user) return !cancelled && setStatus("login");
				if (oobCode && user?.email?.toLowerCase() !== applied.current!.email.toLowerCase()) {
					return !cancelled && setStatus("other");
				}
				if (user) {
					await reload(user);
					// Que el resto de la app vea el correo ya verificado.
					const current = useSessionStore.getState().session;
					if (current?.userId === user.uid && user.emailVerified !== current.user.emailVerified) {
						setSession({ ...current, user: { ...current.user, emailVerified: user.emailVerified } });
					}
				}
				if (!cancelled) setStatus(oobCode || user?.emailVerified ? "verified" : "pending");
			} catch (err) {
				await auth.authStateReady().catch(() => {});
				if (cancelled) return;
				setHasUser(!!auth.currentUser);
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
		const uid = auth.currentUser?.uid;
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
					{hasUser && (
						<Button className={btnClass} loading={busy} onClick={resend}>
							Enviar enlace nuevo
						</Button>
					)}
					<Button asChild variant={hasUser ? "outline" : "default"} className={btnClass}>
						<Link to="/login">Ir a ingresar</Link>
					</Button>
				</div>
			</AuthLayout>
		);
	}

	if (status === "other") {
		return (
			<AuthLayout>
				<div className={cardClass}>
					<div className="flex flex-col gap-2">
						<h1 className={h1Class}>¡Correo verificado!</h1>
						<p className={pClass}>
							Ingresa con <strong className="text-primary">{email}</strong> para seguir.
						</p>
					</div>
					{/* Con otra cuenta abierta, /login la redirigiría a su panel: se cierra antes. */}
					{hasUser ? (
						<Button className={btnClass} disabled={busy} onClick={() => logout(() => navigate("/login"))}>
							Ir a ingresar
						</Button>
					) : (
						<Button asChild className={btnClass}>
							<Link to="/login">Ir a ingresar</Link>
						</Button>
					)}
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
					<Button className={btnClass} loading={busy} onClick={continueTo}>
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
						Te enviamos un enlace a <strong className="text-primary">{email}</strong>. Ábrelo
						desde tu celular o computadora para activar tu cuenta.
					</p>
				</div>
				{destError && (
					<p role="alert" className="text-sm text-error">
						{destError}
					</p>
				)}
				<Button className={btnClass} loading={busy} onClick={resend}>
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
