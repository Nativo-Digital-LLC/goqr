import {
	addDoc,
	collection,
	doc,
	getDocs,
	increment,
	query,
	updateDoc,
	where
} from 'firebase/firestore';

import { Collection } from '../constants/Collections';
import { ProductProps } from '../types/Product';
import { db } from '../utils/firebase';
import { normalizePrices } from '../lib/price';
import { uploadFile } from '../utils/helpers';

export async function getAllProducts(establishmentId: string) {
	const productsQuery = query(
		collection(db, Collection.Products),
		where('establishmentId', '==', establishmentId),
		where('deletedAt', '==', null)
	);

	const snapshot = await getDocs(productsQuery);
	return snapshot.docs.map(doc => {
		const data = doc.data();
		return { ...data, prices: normalizePrices(data.prices) };
	}) as unknown as ProductProps[];
}

export async function createProduct({ photo, ...data }: Partial<ProductProps> & { photo?: File | null }) {
	const photoUrl = (photo)
		? await uploadFile(photo)
		: null;

	await addDoc(collection(db, Collection.Products), {
		...data,
		photoUrl,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null
	});
}

export async function updateProduct(id: string, { photo, ...data }: Partial<ProductProps> & { photo?: File | null }) {
	const updates: any = {
		...data,
		updatedAt: new Date()
	};

	if (photo) updates.photoUrl = await uploadFile(photo);
	else if (photo === null) updates.photoUrl = null;

	await updateDoc(doc(db, Collection.Products, id), updates);

}

export async function changeProductOrder(
	id: string,
	dir: 'up' | 'down',
	neighborId: string
) {
	await Promise.all([
		updateDoc(doc(db, Collection.Products, id), {
			order: increment(dir === 'up' ? -1 : 1)
		}),
		updateDoc(doc(db, Collection.Products, neighborId), {
			order: increment(dir === 'up' ? 1 : -1)
		})
	]);
}

export async function deleteProduct(id: string) {
	await updateDoc(doc(db, Collection.Products, id), {
		deletedAt: new Date()
	});
}
