import { useCallback, useEffect, useRef, useState } from "react";

import { PaymentFrequency, PaymentMethod } from "@/types/Bill";
import { CreateEstablishmentParams, EstablishmentProps } from "@/types/Establishment";
import { createEstablishment, getEstablishmentsByUserId, isSlugAvailable, updateEstablishment } from "@/services/establishments";
import { auth } from "@/utils/firebase";

type Step = 1 | 2 | 3 | 4;

export function useOnboarding() {
	const [establishment, setEstablishment] = useState<EstablishmentProps | null>(null);
	const [step, setStep] = useState<Step>(1);
	const [loading, setLoading] = useState(true);
	// Resultado de la primera carga: la página redirige con esto.
	const [unauthenticated, setUnauthenticated] = useState(false);
	const [finished, setFinished] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const [attempt, setAttempt] = useState(0);
	// Id recién creado: si el refresco falla, un reintento actualiza en vez de crear otro.
	const createdId = useRef<string | null>(null);

	const fetchEstablishment = useCallback(async () => {
		await auth.authStateReady();
		const uid = auth.currentUser?.uid;
		if (!uid) return undefined;
		return (await getEstablishmentsByUserId(uid))[0] ?? null;
	}, []);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(false);
		fetchEstablishment()
			.then((found) => {
				if (cancelled) return;
				if (found === undefined) return setUnauthenticated(true);
				setEstablishment(found);
				const saved = found?.onboardingStep;
				if (found && !(saved === 1 || saved === 2 || saved === 3)) setFinished(true);
				else setStep((saved as Step) ?? 1);
			})
			.catch(() => !cancelled && setLoadError(true))
			.finally(() => !cancelled && setLoading(false));
		return () => {
			cancelled = true;
		};
	}, [fetchEstablishment, attempt]);

	// n es el próximo paso a mostrar; 4 = onboarding terminado.
	const saveStep = useCallback(
		async (n: Step, data: Partial<CreateEstablishmentParams>) => {
			const uid = auth.currentUser?.uid;
			if (!uid) throw new Error("Sin sesión");
			// Nunca se crea un segundo establecimiento: se busca el existente aunque el estado local esté vacío.
			const existing = establishment ?? (await getEstablishmentsByUserId(uid))[0];
			const targetId = existing?.id ?? createdId.current;
			if (data.domain && data.domain !== existing?.domain && !(await isSlugAvailable(data.domain))) {
				throw new Error("slug-taken");
			}
			if (targetId) {
				const rest = { ...data };
				delete rest.userId; // las reglas no permiten escribir userId en updates
				await updateEstablishment(targetId, { ...rest, onboardingStep: n });
			} else {
				createdId.current = await createEstablishment({
					name: "",
					domain: "",
					description: "",
					address: "",
					phone: "",
					mainHexColor: "#C2381F",
					requiresTaxReceipt: false,
					paymentFrequency: PaymentFrequency.Monthly,
					paymentMethod: PaymentMethod.CreditCard,
					...data,
					userId: uid,
					onboardingStep: n,
				});
			}
			const fresh = await fetchEstablishment();
			if (fresh) setEstablishment(fresh);
			setStep(n);
		},
		[establishment, fetchEstablishment]
	);

	const retry = useCallback(() => setAttempt((a) => a + 1), []);

	return { establishment, step, loading, unauthenticated, finished, loadError, retry, saveStep };
}
