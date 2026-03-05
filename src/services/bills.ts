import { collection, getDocs, query, where } from 'firebase/firestore';

import { Collection } from '../constants/Collections';
import { BillProps } from '../types/Bill';
import { db } from '../utils/firebase';

export async function getBillsByUserId(userId: string): Promise<BillProps[]> {
	const billsQuery = query(
		collection(db, Collection.Bills),
		where('userId', '==', userId)
	);

	const snapshot = await getDocs(billsQuery);
	const documents = snapshot.docs.map(doc => doc.data());

	return documents as unknown as BillProps[];
}