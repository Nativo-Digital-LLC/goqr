import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
	collection,
	onSnapshot,
	query,
	where
} from "firebase/firestore";

import {
	CreateEstablishmentParams,
	EstablishmentProps,
	TaxPayerProps,
} from "../types/Establishment";
import {
	createEstablishment,
	getEstablishmentsByUserId,
	getTaxInformation,
	updateEstablishment,
} from "../services/establishments";
import { db } from "../utils/firebase";

type UseGetEstablishmentByDomainType = [
	EstablishmentProps | null,
	boolean,
	FirebaseError | null
];

export const useGetEstablishmentByDomain = (
	domain?: string
): UseGetEstablishmentByDomainType => {
	const [establishment, setEstablishment] = useState<EstablishmentProps | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<FirebaseError | null>(null);

	useEffect(() => {
		if (!domain) {
			return;
		}

		const ref = query(
			collection(db, "establishments"),
			where("domain", "==", domain)
		);
		const unsubscribe = onSnapshot(
			ref,
			(snapshot) => {
				if (snapshot.empty) {
					setEstablishment(null);
					setLoading(false);
					return;
				}

				setEstablishment(snapshot.docs[0].data() as EstablishmentProps);
				setLoading(false);
			},
			setError
		);

		return () => unsubscribe();
	}, [domain]);

	return [establishment, loading, error];
};

type UseGetEstablishmentsByUserIdType = [
	EstablishmentProps[],
	boolean,
	FirebaseError | null,
	(userId: string) => void
];

export const useGetEstablishmentsByUserId = (
	userId?: string
): UseGetEstablishmentsByUserIdType => {
	const [establishments, setEstablishments] = useState<EstablishmentProps[]>(
		[]
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<FirebaseError | null>(null);

	useEffect(() => {
		if (!userId) return;

		load(userId);
	}, [userId]);

	async function load(userId: string) {
		try {
			setError(null);
			const data = await getEstablishmentsByUserId(userId);
			setEstablishments(data);
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [establishments, loading, error, load];
};

type SaveEstablishmentParams = Partial<CreateEstablishmentParams> & {
	id?: string;
};

type UseSaveEstablishmentType = [
	(params: SaveEstablishmentParams, onDone?: () => void) => void,
	boolean,
	FirebaseError | null
];

export const useSaveEstablishment = (): UseSaveEstablishmentType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleSave(
		{ id, ...rest }: SaveEstablishmentParams,
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			if (id) {
				await updateEstablishment(id, rest);
			} else {
				await createEstablishment(rest as CreateEstablishmentParams);
			}
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleSave, loading, error];
};

type UseGetTaxPayerInfoType = [
	(rnc: string) => void,
	TaxPayerProps | null,
	boolean,
	Error | string | null
];

export const useGetTaxPayerInfo = (): UseGetTaxPayerInfoType => {
	const [loading, setLoading] = useState(false);
	const [taxpayer, setTaxpayer] = useState<TaxPayerProps | null>(null);
	const [error, setError] = useState<string | Error | null>(null);

	async function load(rnc: string) {
		try {
			setLoading(true);
			setError(null);
			const data = await getTaxInformation(rnc);
			if (!data) {
				return setError("RNC no encontrado");
			}

			if (
				data?.status.name !== "ACTIVO" &&
				data?.status.name !== "NORMAL"
			) {
				return setError("RNC " + data?.status.name);
			}

			setTaxpayer(data);
		} catch (error) {
			setError(error as Error);
		} finally {
			setLoading(false);
		}
	}

	return [load, taxpayer, loading, error];
};
