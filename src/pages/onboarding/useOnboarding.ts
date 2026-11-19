import { useCallback, useEffect, useState } from "react";

import { PaymentFrequency, PaymentMethod } from "@/types/Bill";
import { CreateEstablishmentParams, EstablishmentProps } from "@/types/Establishment";
import { createEstablishment, getEstablishmentsByUserId, updateEstablishment } from "@/services/establishments";
import { auth } from "@/utils/firebase";

type Step = 1 | 2 | 3 | 4;

export function useOnboarding() {
	const [establishment, setEstablishment] = useState<EstablishmentProps | null>(null);
	const [step, setStep] = useState<Step>(1);
	const [loading, setLoading] = useState(true);
	// Resultado de la primera carga: la página redirige con esto.
	const [unauthenticated, setUnauthenticated] = useState(false);
	const [finished, setFinished] = useState(false);

	const fetchEstablishment = useCallback(async () => {
		await auth.authStateReady();
		const uid = auth.currentUser?.uid;
		if (!uid) return undefined;
		return (await getEstablishmentsByUserId(uid))[0] ?? null;
	}, []);

	useEffect(() => {
		let cancelled = false;
		fetchEstablishment()
			.then((found) => {
				if (cancelled) return;
				if (found === undefined) return setUnauthenticated(true);
				setEstablishment(found);
				const saved = found?.onboardingStep;
				if (found && !(saved === 1 || saved === 2 || saved === 3)) setFinished(true);
				else setStep((saved as Step) ?? 1);
			})
			.catch(() => !cancelled && setUnauthenticated(true))
			.finally(() => !cancelled && setLoading(false));
		return () => {
			cancelled = true;
		};
	}, [fetchEstablishment]);

	// n es el próximo paso a mostrar; 4 = onboarding terminado.
	const saveStep = useCallback(
		async (n: Step, data: Partial<CreateEstablishmentParams>) => {
			const uid = auth.currentUser?.uid;
			if (!uid) throw new Error("Sin sesión");
			// Nunca se crea un segundo establecimiento: si ya existe, se actualiza.
			if (establishment) {
				const rest = { ...data };
				delete rest.userId; // las reglas no permiten escribir userId en updates
				await updateEstablishment(establishment.id, { ...rest, onboardingStep: n });
			} else {
				await createEstablishment({
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

	return { establishment, step, loading, unauthenticated, finished, saveStep };
}
