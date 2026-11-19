import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StepBrand } from "./StepBrand";
import { StepBusiness } from "./StepBusiness";
import { StepDone } from "./StepDone";
import { StepFirstDish } from "./StepFirstDish";
import { CreatedDish, Prefetched, StepSave, useOnboarding } from "./useOnboarding";

const STEP_TITLES = ["Tu restaurante", "Tu marca", "Tu primer plato", "Tu QR"];

export default function OnboardingPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { establishment, step, loading, unauthenticated, finished, loadError, hasOthers, retry, saveStep } = useOnboarding((location.state as { prefetched?: Prefetched } | null)?.prefetched);
	// El estado del historial sobrevive a una recarga: se borra apenas se usa para no retomar con datos viejos.
	useEffect(() => {
		if (location.state) navigate(".", { replace: true, state: null });
	}, [location.state, navigate]);
	const [saving, setSaving] = useState(false);
	const saveRef = useRef<StepSave | null>(null);
	const [dish, setDish] = useState<CreatedDish | null>(null);

	if (unauthenticated) return <Navigate to="/login" replace />;
	if (loadError) {
		return (
			<div className="flex flex-col items-center gap-4 p-12 text-center">
				<p role="alert" className="text-[15px] text-muted-foreground">
					No pudimos cargar tu información. Revisa tu conexión e intenta de nuevo.
				</p>
				<Button className="h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary" onClick={retry}>
					Reintentar
				</Button>
			</div>
		);
	}
	if (finished) return <Navigate to="/dashboard" replace />;
	// Guarda lo escrito en el paso actual si es válido; si no, sale sin guardar.
	async function saveAndExit() {
		const saved = (await saveRef.current?.()) ?? null;
		if (saved === false) return;
		// Sin establecimiento, el panel viejo mandaría al formulario antd.
		navigate(establishment || saved ? "/dashboard" : "/");
	}

	const stepProps = { establishment, saveStep, saving, setSaving, saveRef };

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
					disabled={saving || loading}
					className="rounded-md px-1 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
				>
					Guardar y salir
				</button>
			</header>
			<main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-wrap items-start gap-x-16 gap-y-10 px-4 py-8 sm:px-8 sm:py-12">
				{loading ? (
					<div role="status" aria-label="Cargando" className="flex w-full flex-wrap gap-x-16 gap-y-10">
						<div className="flex min-w-[280px] flex-1 flex-col gap-4">
							<Skeleton className="h-9 w-3/4" />
							<Skeleton className="h-5 w-1/2" />
							<Skeleton className="mt-4 h-11 w-full" />
							<Skeleton className="h-11 w-full" />
							<Skeleton className="h-11 w-full" />
						</div>
						<Skeleton className="h-[520px] w-[280px] rounded-[36px]" />
					</div>
				) : step === 1 ? (
					<StepBusiness {...stepProps} noTrial={hasOthers} />
				) : step === 2 ? (
					<StepBrand {...stepProps} />
				) : step === 3 ? (
					<StepFirstDish {...stepProps} onDish={setDish} />
				) : (
					<StepDone establishment={establishment} dish={dish} noTrial={hasOthers} />
				)}
			</main>
		</div>
	);
}
