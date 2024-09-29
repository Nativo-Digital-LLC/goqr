import { useEffect, useState } from 'react';
import { AppwriteException } from 'appwrite';

import { CreateEstablishmentParams, EstablishmentProps, TaxPayerProps } from '../types/Establishment';
import { createEstablishment, getEstablishmentByDomain, getEstablishmentsByUserId, getTaxInformation } from '../services/establishments';

type UseGetEstablishmentByDomainType = [
	EstablishmentProps | null,
	boolean,
	AppwriteException | null
];

export const useGetEstablishmentByDomain = (domain?: string): UseGetEstablishmentByDomainType => {
	const [establishment, setEstablishment] = useState<EstablishmentProps | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	useEffect(() => {
		if (domain) {
			load(domain);
		}
	}, [domain]);

	async function load(domain: string) {
		try {
			setLoading(true);
			setError(null);
			const data = await getEstablishmentByDomain(domain);
			setEstablishment(data);
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [establishment, loading, error];
}

type UseGetEstablishmentsByUserIdType = [
	EstablishmentProps[],
	boolean,
	AppwriteException | null
];

export const useGetEstablishmentsByUserId = (userId?: string): UseGetEstablishmentsByUserIdType => {
	const [establishments, setEstablishments] = useState<EstablishmentProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	useEffect(() => {
		if (!userId) {
			return;
		}

		load(userId);
	}, [userId]);

	async function load(userId: string) {
		try {
			setLoading(true);
			setError(null);
			const data = await getEstablishmentsByUserId(userId);
			setEstablishments(data);
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [establishments, loading, error];
}

type UseCreateEstablishmentType = [
	(params: CreateEstablishmentParams, onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useCreateEstablishment = (): UseCreateEstablishmentType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleCreate(params: CreateEstablishmentParams, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await createEstablishment(params);
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleCreate, loading, error];
}

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
				return setError('RNC no encontrado');
			}

			if (data?.status.name !== 'ACTIVO' && data?.status.name !== 'NORMAL') {
				return setError('RNC ' + data?.status.name);
			}

			setTaxpayer(data);
		} catch (error) {
			setError(error as Error);
		} finally {
			setLoading(false);
		}
	}

	return [load, taxpayer, loading, error];
}
