import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { PasswordInput } from "@/components/account/PasswordInput";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useAuth";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
import { AuthLayout } from "@/layouts/AuthLayout";
import { authErrorMessage } from "@/lib/authErrors";

const schema = z.object({
	email: z.string().min(1, "Escribe tu correo.").email("Escribe un correo válido."),
	password: z.string().min(1, "Escribe tu contraseña."),
});

const linkClass =
	"font-semibold text-brand hover:text-brand-hover rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function Aside() {
	return (
		<div className="flex flex-wrap items-end gap-8">
			<div className="flex min-w-60 flex-1 flex-col gap-4">
				<p className="font-display text-5xl font-extrabold leading-none tracking-[-0.03em]">
					Tu menú te estaba esperando.
				</p>
				<p className="max-w-[360px] text-[17px] leading-normal text-crema">
					Entra, cambia un precio y tus clientes lo ven al instante. Mismo QR, cero imprenta.
				</p>
			</div>
			{/* Ilustración decorativa de un menú en un teléfono */}
			<div aria-hidden className="w-[220px] rounded-[32px] bg-primary p-2 shadow-[0_24px_48px_rgba(42,20,16,0.28)]">
				<div className="overflow-hidden rounded-[26px] bg-white text-primary">
					<div className="flex h-[84px] items-end bg-[#D9A98A] p-2">
						<span className="text-xs text-[#4F302A]">Banner del restaurante</span>
					</div>
					<div className="flex flex-col gap-2.5 p-3">
						<span className="text-[15px] font-bold">La Roca Restaurant</span>
						<div className="flex gap-1.5">
							<span className="rounded-full bg-[#E86B2A] px-2.5 py-1 text-xs font-bold">Entradas</span>
							<span className="rounded-full px-2.5 py-1 text-xs ring-1 ring-inset ring-border">Desayunos</span>
						</div>
						{[["Croquetas de Pollo", "$7"], ["Pastelitos de Pollo", "$2"]].map(([name, price]) => (
							<div key={name} className="flex items-center gap-2">
								<div className="size-10 rounded-[10px] bg-[#EBCDB5]" />
								<div className="flex-1 text-xs font-semibold">{name}</div>
								<span className="text-xs font-bold">{price}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	// Tras un login con correo o Google el store recibe la sesión y este hook navega; no se navega dos veces.
	const redirecting = useRedirectIfAuthenticated();
	const [handleLogin, loading, loginType, error] = useLogin();
	// El botón sigue cargando mientras la redirección decide el destino.
	const googleBusy = (loading || redirecting) && loginType === "Google";
	const emailBusy = (loading || redirecting) && !googleBusy;
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { email: "", password: "" },
	});
	const message = error ? authErrorMessage(error) : "";

	return (
		<AuthLayout aside={<Aside />}>
			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-1.5">
					<h1 className="font-display text-[32px] font-bold tracking-[-0.02em]">Ingresa a tu panel</h1>
					<p className="text-[15px] text-muted-foreground">
						¿Primera vez?{" "}
						<Link to="/register" className={linkClass}>
							Crea tu cuenta gratis
						</Link>
					</p>
				</div>
				<Form {...form}>
					<form
						noValidate
						className="flex flex-col gap-5"
						onSubmit={form.handleSubmit(({ email, password }) =>
							handleLogin("EmailAndPassword", { email, password, page: "login" })
						)}
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-semibold">Correo electrónico</FormLabel>
									<FormControl>
										<Input type="email" autoComplete="email" className="rounded-xl border-border" {...field} />
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
									<div className="flex items-baseline justify-between">
										<FormLabel className="text-sm font-semibold">Contraseña</FormLabel>
										<Link to="/forgot-password" className={`${linkClass} text-sm`}>
											¿Olvidaste tu contraseña?
										</Link>
									</div>
									<FormControl>
										<PasswordInput autoComplete="current-password" className="rounded-xl border-border" {...field} />
									</FormControl>
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
								<span>
									<strong>{message}</strong>
									{message.startsWith("Correo o contraseña") && " Revisa e intenta de nuevo, o restablece tu contraseña."}
								</span>
							</div>
						)}
						<Button
							type="submit"
							className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary"
							loading={emailBusy}
							disabled={googleBusy}
						>
							{emailBusy ? "Ingresando…" : "Ingresar"}
						</Button>
					</form>
				</Form>
				<div className="flex items-center gap-3 text-sm text-muted-foreground">
					<div className="h-px flex-1 bg-border" />
					<span>o</span>
					<div className="h-px flex-1 bg-border" />
				</div>
				<Button
					type="button"
					variant="outline"
					className="rounded-xl border-border font-semibold focus-visible:ring-2 focus-visible:ring-primary"
					loading={googleBusy}
					disabled={emailBusy}
					onClick={() => handleLogin("Google", { page: "login" })}
				>
					{!googleBusy && (
						<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
						<path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" />
						<path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
						<path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9l3.7-2.8z" />
						<path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
					</svg>
					)}
					{googleBusy ? "Conectando…" : "Continuar con Google"}
				</Button>
			</div>
		</AuthLayout>
	);
}
