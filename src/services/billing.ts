import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { ref, uploadBytes } from 'firebase/storage';

import { auth, db, functions, storage } from '../utils/firebase';
import { PlanId } from '../constants/plans';
import { transferReference } from '../lib/billing';
import { TransferProps } from '../types/Transfer';

const MAX_PROOF_BYTES = 10 * 1024 * 1024;
const PROOF_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

async function callUrl(name: string, data: object): Promise<string> {
	const { data: res } = await httpsCallable<object, { url: string }>(functions, name)(data);
	return res.url;
}

export const startCheckout = (establishmentId: string, plan: PlanId) =>
	callUrl('createCheckoutSession', { establishmentId, plan });

export const openPortal = (establishmentId: string) => callUrl('createPortalSession', { establishmentId });

export async function submitTransfer(p: {
	establishmentId: string;
	plan: PlanId;
	amount: number;
	currency: 'DOP' | 'USD';
	declaredDate: Date;
	file: File;
}): Promise<void> {
	if (!PROOF_TYPES.includes(p.file.type) || p.file.size >= MAX_PROOF_BYTES) {
		throw new Error('Usa una imagen JPG, PNG o un PDF de hasta 10 MB.');
	}
	const uid = auth.currentUser?.uid;
	if (!uid) throw new Error('Inicia sesión para continuar.');

	const proofPath = `proofs/${uid}/${Date.now()}-${p.file.name.replace(/[^\w.-]/g, '_')}`;
	await uploadBytes(ref(storage, proofPath), p.file);

	await setDoc(doc(collection(db, 'transfers')), {
		establishmentId: p.establishmentId,
		userId: uid,
		plan: p.plan,
		amount: p.amount,
		currency: p.currency,
		proofPath,
		declaredDate: p.declaredDate,
		reference: transferReference(p.establishmentId),
		status: 'pending',
		createdAt: serverTimestamp(),
	});
}

export async function getTransfers(establishmentId: string): Promise<TransferProps[]> {
	const uid = auth.currentUser?.uid;
	if (!uid) return [];
	const snap = await getDocs(
		query(
			collection(db, 'transfers'),
			where('establishmentId', '==', establishmentId),
			where('userId', '==', uid),
			orderBy('createdAt', 'desc')
		)
	);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TransferProps);
}
