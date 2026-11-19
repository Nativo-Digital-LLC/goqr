import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref } from 'firebase/storage';

import { db, functions, storage } from '../utils/firebase';
import { TransferProps } from '../types/Transfer';
import { EstablishmentProps } from '../types/Establishment';

export type AdminClient = {
	establishmentId: string;
	name: string;
	domain: string;
	ownerName: string;
	ownerEmail: string;
	lastSignIn: string | null;
	billing: EstablishmentProps['billing'] | null;
	isActive: boolean;
};

export async function listTransfers(status: TransferProps['status']): Promise<TransferProps[]> {
	const snap = await getDocs(query(collection(db, 'transfers'), where('status', '==', status), orderBy('createdAt', 'desc')));
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TransferProps);
}

export const reviewTransfer = (transferId: string, action: 'approve' | 'reject', reason?: string) =>
	httpsCallable(functions, 'reviewTransfer')({ transferId, action, reason });

export async function listClients(): Promise<AdminClient[]> {
	const { data } = await httpsCallable<object, { clients: AdminClient[] }>(functions, 'adminListClients')({});
	return data.clients;
}

export const updateBilling = (
	establishmentId: string,
	action: 'pause' | 'reactivate' | 'extendTrial' | 'markPaid',
	extra: { plan?: string; days?: number } = {}
) => httpsCallable(functions, 'adminUpdateBilling')({ establishmentId, action, ...extra });

export const proofUrl = (path: string) => getDownloadURL(ref(storage, path));
