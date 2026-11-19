import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

import { PaymentFrequency, PaymentMethod } from "@/types/Bill";
import { CreateEstablishmentParams, EstablishmentProps } from "@/types/Establishment";
import { createEstablishment, getEstablishmentsByUserId, isSlugAvailable, updateEstablishment } from "@/services/establishments";
import { useSessionStore } from "@/store/session";
import { auth } from "@/utils/firebase";
import { PANEL_ESTABLISHMENT_KEY } from "@/constants/panel";
import { pickStart } from "./start";

type Step = 1 | 2 | 3 | 4;

/** Guarda el paso actual: true si guardó, false si falló (ya avisó), null si el formulario no es válido. */
export type StepSave = () => Promise<boolean | null>;

/** El plato creado en el paso 3, para la vista previa del paso 4. */
export type CreatedDish = { category: string; name: string; price: number; description: string; photo: File | null };

export type StepProps = {
	establishment: EstablishmentProps | null;
	saveStep: ReturnType<typeof useOnboarding>["saveStep"];
	// Compartido con «Guardar y salir»: bloquea la salida mientras el paso guarda.
	saving: boolean;
	setSaving: (saving: boolean) => void;
	saveRef: MutableRefObject<StepSave | null>;
};

/** Lo que ya consultó la redirección tras ingresar (`location.state.prefetched`). */
export type Prefetched = { uid: string; establishments: EstablishmentProps[] };

/** isNew: añadir otro local (`?new=1`): no retoma ni redirige, crea uno nuevo desde el paso 1. */
export function useOnboarding(prefetched?: Prefetched | null, isNew = false) {
	const [establishment, setEstablishment] = useState<EstablishmentProps | null>(null);
	const [step, setStep] = useState<Step>(1);
	const [loading, setLoading] = useState(true);
	// Resultado de la primera carga: la página redirige con esto.
	const [unauthenticated, setUnauthenticated] = useState(false);
	const [finished, setFinished] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const [attempt, setAttempt] = useState(0);
	// Con isNew: ya tenía locales, así que el nuevo no lleva prueba gratis.
	const [hasOthers, setHasOthers] = useState(false);
	// Id recién creado: si el refresco falla, un reintento actualiza en vez de crear otro.
	const createdId = useRef<string | null>(null);

	// undefined = sin usuario.
	const fetchList = useCallback(async () => {
		await auth.authStateReady();
		const uid = auth.currentUser?.uid;
		if (!uid) return undefined;
		return getEstablishmentsByUserId(uid);
	}, []);

	// El que se está editando: el recién creado en esta visita, o el primero salvo con isNew.
	const pick = useCallback(
		(list: EstablishmentProps[]) => (isNew ? list.find((e) => e.id === createdId.current) : list[0]) ?? null,
		[isNew]
	);

	const fetchEstablishment = useCallback(async () => {
		const list = await fetchList();
		return list && pick(list);
	}, [fetchList, pick]);

	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		setLoadError(false);
		const first = attempt === 0 && prefetched && !isNew
			? auth.authStateReady().then(() =>
				auth.currentUser?.uid === prefetched.uid ? prefetched.establishments : fetchList()
			)
			: fetchList();
		first
			.then((list) => {
				if (cancelled) return;
				if (list === undefined) {
					// Sin usuario en Firebase: se borra la sesión vieja para que /login no rebote de vuelta aquí.
					useSessionStore.getState().setSession(null);
					return setUnauthenticated(true);
				}
				setHasOthers(isNew && list.length > 0);
				const start = pickStart(list, isNew);
				setEstablishment(start.establishment);
				if (start.finished) setFinished(true);
				else setStep(start.step);
			})
			.catch(() => !cancelled && setLoadError(true))
			.finally(() => !cancelled && setLoading(false));
		return () => {
			cancelled = true;
		};
		// prefetched solo cuenta en la primera carga.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchList, attempt]);

	// n es el próximo paso a mostrar; 4 = onboarding terminado.
	const saveStep = useCallback(
		async (n: Step, data: Partial<CreateEstablishmentParams>) => {
			const uid = auth.currentUser?.uid;
			if (!uid) throw new Error("Sin sesión");
			// Nunca se crea un segundo establecimiento: se busca el existente aunque el estado local esté vacío.
			const existing = establishment ?? (isNew ? undefined : (await getEstablishmentsByUserId(uid))[0]);
			const targetId = existing?.id ?? createdId.current;
			if (data.domain && data.domain !== existing?.domain && !(await isSlugAvailable(data.domain))) {
				throw new Error("slug-taken");
			}
			if (targetId) {
				const rest = { ...data };
				delete rest.userId; // las reglas no permiten escribir userId en updates
				await updateEstablishment(targetId, { ...rest, onboardingStep: n });
				// Sin imágenes no hay nada nuevo que venga del servidor: se actualiza en local y se evita otra consulta.
				if (existing && !data.logo && !data.banner) {
					setEstablishment({ ...existing, ...rest, onboardingStep: n } as EstablishmentProps);
					setStep(n);
					return;
				}
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
				// El panel abre con el local nuevo seleccionado.
				if (isNew) localStorage.setItem(PANEL_ESTABLISHMENT_KEY, createdId.current);
			}
			const fresh = await fetchEstablishment();
			if (fresh) setEstablishment(fresh);
			setStep(n);
		},
		[establishment, fetchEstablishment, isNew]
	);

	const retry = useCallback(() => setAttempt((a) => a + 1), []);

	return { establishment, step, loading, unauthenticated, finished, loadError, hasOthers, retry, saveStep };
}
