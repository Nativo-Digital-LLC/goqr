import { zodResolver } from "@hookform/resolvers/zod";
import { verifyPasswordResetCode } from "firebase/auth";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { PasswordInput } from "@/components/account/PasswordInput";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useResetPasswordWithSecret } from "@/hooks/useAuth";
import { AuthLayout } from "@/layouts/AuthLayout";
import { authErrorMessage } from "@/lib/authErrors";
import { auth } from "@/utils/firebase";

const schema = z
	.object({
		password: z.string().min(8, "Usa al menos 8 caracteres."),
		confirm: z.string().min(1, "Confirma tu contraseña."),
	})
	.refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Las contraseñas no coinciden" });

const STRENGTH = [
	{ label: "Contraseña débil", color: "bg-error" },
	{ label: "Contraseña regular", color: "bg-warning" },
	{ label: "Contraseña buena", color: "bg-success" },
	{ label: "Contraseña fuerte", color: "bg-success" },
];
const STRENGTH_TEXT = ["text-error", "text-warning", "text-success", "text-success"];

/** 0 a 3 según largo y variedad de caracteres. */
function strength(p: string): number {
	const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
	return Math.max(0, Math.min(3, (p.length >= 8 ? 1 : 0) + (p.length >= 12 ? 1 : 0) + (kinds >= 3 ? 1 : 0)));
}

const cardClass = "flex flex-col gap-5 rounded-[20px] border border-border bg-white p-6 sm:p-8";

function ExpiredLink() {
	return (
		<AuthLayout>
			<div className={cardClass}>
				<div className="flex flex-col gap-2">
					<h1 className="font-display text-[28px] font-bold tracking-[-0.02em]">Este enlace ya no sirve</h1>
					<p className="text-[15px] leading-normal text-muted-foreground">
						{authErrorMessage({ code: "auth/expired-action-code" })}
					</p>
				</div>
				<Button asChild className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary">
					<Link to="/forgot-password">Pedir un enlace nuevo</Link>
				</Button>
			</div>
		</AuthLayout>
	);
}

export default function ResetPasswordPage() {
	const oobCode = useSearchParams()[0].get("oobCode");
	const navigate = useNavigate();
	const [reset, loading, error] = useResetPasswordWithSecret();
	// undefined = comprobando el enlace, null = enlace inválido o vencido
	const [email, setEmail] = useState<string | null | undefined>(oobCode ? undefined : null);
	const [checkFailed, setCheckFailed] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { password: "", confirm: "" },
	});
	const password = form.watch("password");

	useEffect(() => {
		if (!oobCode) return;
		let cancelled = false;
		setCheckFailed(false);
		verifyPasswordResetCode(auth, oobCode)
			.then((e) => !cancelled && setEmail(e))
			.catch((err) => {
				if (cancelled) return;
				// Solo un código vencido o inválido es "enlace vencido"; el resto (p. ej. red) se puede reintentar.
				if (["auth/expired-action-code", "auth/invalid-action-code"].includes(err?.code)) setEmail(null);
				else setCheckFailed(true);
			});
		return () => {
			cancelled = true;
		};
	}, [oobCode, attempt]);

	if (email === null) return <ExpiredLink />;
	if (checkFailed) {
		return (
			<AuthLayout>
				<div className={cardClass}>
					<div className="flex flex-col gap-2">
						<h1 className="font-display text-[28px] font-bold tracking-[-0.02em]">No pudimos comprobar tu enlace</h1>
						<p role="alert" className="text-[15px] leading-normal text-muted-foreground">
							{authErrorMessage(null)}
						</p>
					</div>
					<Button className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setAttempt((a) => a + 1)}>
						Reintentar
					</Button>
				</div>
			</AuthLayout>
		);
	}
	if (email === undefined) {
		return (
			<AuthLayout>
				<p role="status" className="text-center text-[15px] text-muted-foreground">
					Comprobando tu enlace…
				</p>
			</AuthLayout>
		);
	}

	const level = strength(password);
	const message = error ? authErrorMessage(error) : "";
	if (error && (error as { code?: string }).code?.endsWith("-action-code")) return <ExpiredLink />;

	return (
		<AuthLayout>
			<Form {...form}>
				<form
					noValidate
					className={cardClass}
					onSubmit={form.handleSubmit(({ password }) =>
						reset(oobCode!, email, password, (signedIn) => {
							// El panel manda a /onboarding si hace falta.
							toast.success(signedIn ? "Contraseña actualizada." : "Contraseña actualizada. Ya puedes ingresar.");
							navigate(signedIn ? "/dashboard" : "/login", { replace: true });
						})
					)}
				>
					<div className="flex flex-col gap-2">
						<h1 className="font-display text-[28px] font-bold tracking-[-0.02em]">Crea tu nueva contraseña</h1>
						<p className="text-[15px] leading-normal text-muted-foreground">
							Para la cuenta <strong className="text-primary">{email}</strong>.
						</p>
					</div>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold">Nueva contraseña</FormLabel>
								<FormControl>
									<PasswordInput autoComplete="new-password" className="rounded-xl border-border" {...field} />
								</FormControl>
								<FormMessage />
								{password && (
									<>
										<div className="grid grid-cols-4 gap-1.5" aria-hidden>
											{[0, 1, 2, 3].map((i) => (
												<div key={i} className={`h-1 rounded-sm ${i <= level ? STRENGTH[level].color : "bg-border"}`} />
											))}
										</div>
										<span className={`text-sm font-semibold ${STRENGTH_TEXT[level]}`}>{STRENGTH[level].label}</span>
									</>
								)}
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirm"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold">Confirma la contraseña</FormLabel>
								<FormControl>
									<PasswordInput autoComplete="new-password" className="rounded-xl border-border" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{message && (
						<div role="alert" className="flex items-start gap-2.5 rounded-xl bg-error-bg px-3.5 py-3 text-sm text-error">
							<CircleAlert className="mt-px size-[18px] shrink-0" aria-hidden />
							<span>{message}</span>
						</div>
					)}
					<Button type="submit" className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary" loading={loading}>
						{loading ? "Guardando…" : "Guardar y entrar a mi panel"}
					</Button>
				</form>
			</Form>
		</AuthLayout>
	);
}
