import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRequestResetPasswordEmail } from "@/hooks/useAuth";
import { AuthLayout } from "@/layouts/AuthLayout";
import { authErrorMessage } from "@/lib/authErrors";

const schema = z.object({
	email: z.string().min(1, "Escribe tu correo.").email("Escribe un correo válido."),
});

const COOLDOWN = 60;
const cardClass = "flex flex-col gap-5 rounded-[20px] border border-border bg-white p-6 sm:p-8";
const linkClass =
	"rounded-sm text-sm font-semibold text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function ForgotPasswordPage() {
	const [request, loading, error] = useRequestResetPasswordEmail();
	const [sentTo, setSentTo] = useState<string | null>(null);
	const [seconds, setSeconds] = useState(0);
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: { email: "" },
	});

	useEffect(() => {
		if (seconds <= 0) return;
		const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
		return () => clearTimeout(id);
	}, [seconds]);

	const send = (email: string) =>
		request(email, () => {
			setSentTo(email);
			setSeconds(COOLDOWN);
		});

	if (sentTo) {
		return (
			<AuthLayout>
				<div className={cardClass}>
					<div className="flex size-14 items-center justify-center rounded-2xl bg-success-bg text-success">
						<Mail className="size-7" aria-hidden />
					</div>
					<div className="flex flex-col gap-2">
						<h1 className="font-display text-[28px] font-bold tracking-[-0.02em]">Revisa tu correo</h1>
						<p className="text-[15px] leading-normal text-muted-foreground">
							Si <strong className="text-primary">{sentTo}</strong> tiene una cuenta, te llegará un enlace en
							unos minutos. Vence en 1 hora.
						</p>
					</div>
					<div className="flex items-start gap-2.5 rounded-xl bg-muted px-3.5 py-3 text-sm leading-snug text-cacao-2">
						<Info className="mt-px size-[18px] shrink-0" aria-hidden />
						<span>¿No lo ves? Busca en Spam o Promociones.</span>
					</div>
					{error && (
						<p role="alert" className="text-sm font-semibold text-error">
							{authErrorMessage(error)}
						</p>
					)}
					<div className="flex flex-wrap gap-3">
						<Button
							type="button"
							variant="secondary"
							className="flex-1 basis-40 rounded-xl font-semibold text-muted-foreground"
							disabled={seconds > 0 || loading}
							onClick={() => send(sentTo)}
						>
							{seconds > 0
								? `Reenviar en ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
								: "Reenviar enlace"}
						</Button>
						<Button
							type="button"
							variant="outline"
							className="flex-1 basis-40 rounded-xl border-border font-semibold"
							onClick={() => {
								setSentTo(null);
								setSeconds(0);
							}}
						>
							Usar otro correo
						</Button>
					</div>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout>
			<Form {...form}>
				<form noValidate className={cardClass} onSubmit={form.handleSubmit(({ email }) => send(email))}>
					<div className="flex flex-col gap-2">
						<h1 className="font-display text-[28px] font-bold tracking-[-0.02em]">¿Olvidaste tu contraseña?</h1>
						<p className="text-[15px] leading-normal text-muted-foreground">
							Escribe el correo con el que te registraste y te mandamos un enlace para crear una nueva.
						</p>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-semibold">Correo electrónico</FormLabel>
								<FormControl>
									<Input
										type="email"
										autoComplete="email"
										placeholder="tu@restaurante.com"
										className="rounded-xl border-border"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{error && (
						<p role="alert" className="text-sm font-semibold text-error">
							{authErrorMessage(error)}
						</p>
					)}
					<Button type="submit" className="rounded-xl focus-visible:ring-2 focus-visible:ring-primary" disabled={loading}>
						{loading ? "Enviando…" : "Enviar enlace"}
					</Button>
					<Link to="/login" className={`${linkClass} text-center`}>
						Volver a ingresar
					</Link>
				</form>
			</Form>
		</AuthLayout>
	);
}
