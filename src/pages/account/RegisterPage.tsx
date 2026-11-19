import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Circle, CircleAlert, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { PasswordInput } from "@/components/account/PasswordInput";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PLANS, TRIAL_DAYS } from "@/constants/plans";
import { useLogin, useRegister } from "@/hooks/useAuth";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { AuthLayout } from "@/layouts/AuthLayout";
import { authErrorMessage } from "@/lib/authErrors";
import { passwordChecks, passwordStrength } from "@/lib/password";
import { cn } from "@/lib/utils";

const schema = z.object({
	name: z.string().trim().min(1, "Escribe tu nombre."),
	email: z.string().min(1, "Escribe tu correo.").email("Escribe un correo válido."),
	password: z
		.string()
		.min(1, "Escribe una contraseña.")
		.refine((pw) => passwordStrength(pw) !== "weak", "Usa al menos 8 caracteres, una mayúscula y un número."),
	terms: z.boolean().refine((v) => v, "Debes aceptar los términos para continuar."),
});

const annual = PLANS.find((p) => p.id === "annual")!;

const BENEFITS = [
	"Sin tarjeta para empezar",
	"Cambia precios y platos cuando quieras, sin reimprimir",
	"Menú en español e inglés para tus turistas",
	`Después, desde RD$${annual.perMonthDop}/mes con el plan anual`,
];

const STRENGTH = {
	weak: { label: "Contraseña débil", bars: 1, color: "bg-error" },
	ok: { label: "Contraseña aceptable", bars: 3, color: "bg-warning" },
	strong: { label: "Contraseña fuerte", bars: 4, color: "bg-success" },
} as const;

const linkClass =
	"font-semibold text-brand hover:text-brand-hover rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function Benefits({ className, iconClass }: { className?: string; iconClass: string }) {
	return (
		<ul className={cn("flex flex-col", className)}>
			{BENEFITS.map((text) => (
				<li key={text} className="flex items-start gap-3">
					<Check className={cn("mt-0.5 size-[22px] shrink-0", iconClass)} strokeWidth={2.5} aria-hidden />
					{text}
				</li>
			))}
		</ul>
	);
}

const TrialBadge = () => (
	<span className="w-fit rounded-full bg-platano px-3 py-1 text-sm font-bold text-primary">{TRIAL_DAYS} días gratis</span>
);

function Aside() {
	return (
		<div className="flex flex-col gap-6">
			<TrialBadge />
			<h1 className="max-w-[480px] font-display text-5xl font-extrabold leading-none tracking-[-0.03em]">
				En 10 minutos tu menú está en cada mesa.
			</h1>
			<Benefits className="gap-3.5 text-[17px] leading-snug" iconClass="text-brand" />
		</div>
	);
}

export default function RegisterPage() {
	// Tras crear la cuenta o entrar con Google el store recibe la sesión y este hook navega; no se navega dos veces.
	useRedirectIfAuthenticated();
	const [handleRegister, registering, registerError] = useRegister();
	const [handleLogin, loggingIn, loginType, loginError] = useLogin();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { name: "", email: "", password: "", terms: false },
	});
	const password = form.watch("password");
	const strength = STRENGTH[passwordStrength(password)];
	const checks = passwordChecks(password);
	const [lastTry, setLastTry] = useState<"email" | "google">("email");
	const busy = registering || loggingIn;
	const error = lastTry === "google" ? loginError : registerError;
	const message = error ? authErrorMessage(error) : "";

	return (
		<AuthLayout aside={<Aside />} asideTone="crema">
			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-4 rounded-xl bg-crema p-4 lg:hidden">
					<TrialBadge />
					<p className="font-display text-xl font-extrabold leading-tight tracking-[-0.02em]">
						En 10 minutos tu menú está en cada mesa.
					</p>
					<Benefits className="gap-1.5 text-sm leading-snug" iconClass="text-brand" />
				</div>
				<div className="flex flex-col gap-1.5">
					<h2 className="font-display text-[32px] font-bold tracking-[-0.02em]">Crea tu cuenta</h2>
					<p className="text-[15px] text-muted-foreground">
						¿Ya tienes cuenta?{" "}
						<Link to="/login" className={linkClass}>
							Ingresa
						</Link>
					</p>
				</div>
				<Button
					type="button"
					variant="outline"
					className="rounded-xl border-border font-semibold focus-visible:ring-2 focus-visible:ring-primary"
					disabled={busy}
					onClick={async () => {
						// Los términos también aplican al registro con Google.
						if (!(await form.trigger("terms"))) return;
						setLastTry("google");
						handleLogin("Google", { page: "register" });
					}}
				>
					<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
						<path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" />
						<path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
						<path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9l3.7-2.8z" />
						<path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
					</svg>
					{loggingIn && loginType === "Google" ? "Conectando…" : "Registrarme con Google"}
				</Button>
				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<div className="h-px flex-1 bg-border" />
					<span>o con tu correo</span>
					<div className="h-px flex-1 bg-border" />
				</div>
				<Form {...form}>
					<form
						noValidate
						className="flex flex-col gap-5"
						onSubmit={form.handleSubmit(({ name, email, password }) => {
							setLastTry("email");
							handleRegister(name.trim(), email, password);
						})}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold">Tu nombre</FormLabel>
									<FormControl>
										<Input autoComplete="name" placeholder="Ej. María Rodríguez" className="rounded-xl border-border" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold">Correo electrónico</FormLabel>
									<FormControl>
										<Input type="email" autoComplete="email" placeholder="tu@restaurante.com" className="rounded-xl border-border" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold">Contraseña</FormLabel>
									<FormControl>
										<PasswordInput autoComplete="new-password" className="rounded-xl border-border" {...field} />
									</FormControl>
									<div className="flex gap-1.5" aria-hidden>
										{[1, 2, 3, 4].map((n) => (
											<div key={n} className={cn("h-1.5 flex-1 rounded-full", password && n <= strength.bars ? strength.color : "bg-line")} />
										))}
									</div>
									{password && <span className="text-sm font-semibold" aria-live="polite">{strength.label}</span>}
									<ul className="flex flex-col gap-1 text-sm text-muted-foreground">
										{(
											[
												[checks.minLength, "Al menos 8 caracteres"],
												[checks.upperAndNumber, "Una mayúscula y un número"],
												[checks.symbol, "Un símbolo (opcional, la hace más fuerte)"],
											] as const
										).map(([ok, text]) => (
											<li key={text} className={cn("flex items-center gap-2", ok && "text-success")}>
												{ok ? <Check className="size-4" strokeWidth={2.5} aria-hidden /> : <Circle className="size-4" aria-hidden />}
												{text}
											</li>
										))}
									</ul>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="terms"
							render={({ field }) => (
								<FormItem>
									<label className="flex items-start gap-3 text-sm leading-snug">
										<FormControl>
											<input
												type="checkbox"
												checked={field.value}
												onChange={(e) => field.onChange(e.target.checked)}
												onBlur={field.onBlur}
												ref={field.ref}
												className="mt-0.5 size-5 shrink-0 accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
											/>
										</FormControl>
										<span>
											Acepto los{" "}
											<Link to="/terms" className={linkClass}>
												Términos y condiciones
											</Link>{" "}
											y la{" "}
											<Link to="/privacy-policies" className={linkClass}>
												Política de privacidad
											</Link>
											.
										</span>
									</label>
									<FormMessage />
								</FormItem>
							)}
						/>
						{message && (
							<div
								role="alert"
								className="flex items-start gap-2.5 rounded-xl bg-error-bg px-3.5 py-3 text-sm leading-snug text-error"
							>
								<CircleAlert className="mt-px size-[18px] shrink-0" aria-hidden />
								<strong>{message}</strong>
							</div>
						)}
						<Button
							type="submit"
							className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary"
							disabled={busy}
						>
							{registering ? "Creando tu cuenta…" : "Crear cuenta y empezar prueba"}
						</Button>
						<p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
							<Lock className="size-4 shrink-0" aria-hidden />
							{TRIAL_DAYS} días gratis, sin tarjeta. Cancelas cuando quieras.
						</p>
					</form>
				</Form>
			</div>
		</AuthLayout>
	);
}
