import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Logo } from "@/components/brand/Logo";
import { StepBusiness } from "./StepBusiness";
import { useOnboarding } from "./useOnboarding";

const STEP_TITLES = ["Tu restaurante", "Tu marca", "Tu primer plato", "Tu QR"];

export default function OnboardingPage() {
	const { establishment, step, loading, unauthenticated, finished, saveStep } = useOnboarding();
	const navigate = useNavigate();
	const [leaving, setLeaving] = useState(false);

	if (unauthenticated) return <Navigate to="/login" replace />;
	if (finished) return <Navigate to="/dashboard" replace />;
	if (loading) {
		return (
			<p role="status" className="p-12 text-center text-[15px] text-muted-foreground">
				Cargando…
			</p>
		);
	}

	async function saveAndExit() {
		setLeaving(true);
		try {
			if (establishment) await saveStep(step, {});
			navigate("/dashboard");
		} catch {
			toast.error("No pudimos guardar tu avance. Intenta de nuevo.");
			setLeaving(false);
		}
	}

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border bg-white px-4 py-3.5 sm:px-8">
				<Logo size={32} />
				<div className="flex min-w-[240px] max-w-[420px] flex-1 flex-col gap-1.5">
					<span className="text-[13px] font-semibold text-muted-foreground">
						Paso {Math.min(step, 4)} de 4 · {STEP_TITLES[Math.min(step, 4) - 1]}
					</span>
					<div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
						{[1, 2, 3, 4].map((n) => (
							<div key={n} className={`h-1.5 rounded-sm ${n <= step ? "bg-brand" : "bg-border"}`} />
						))}
					</div>
				</div>
				<button
					type="button"
					onClick={saveAndExit}
					disabled={leaving}
					className="rounded-md px-1 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
				>
					Guardar y salir
				</button>
			</header>
			<main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-wrap items-start gap-x-16 gap-y-10 px-4 py-8 sm:px-8 sm:py-12">
				{step === 1 ? (
					<StepBusiness establishment={establishment} saveStep={saveStep} />
				) : (
					// Marcador: las tareas 7 y 8 reemplazan los pasos 2 a 4.
					<p className="text-muted-foreground">Paso {step} próximamente.</p>
				)}
			</main>
		</div>
	);
}
