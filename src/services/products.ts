import { addDoc, collection, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';

import { Collection } from '../constants/Collections';
import { ProductProps } from '../types/Product';
import { db } from '../utils/firebase';
import { uploadFile } from '../utils/helpers';

const {
	VITE_APP_MEILI_SEARCH_HOST,
	VITE_APP_MEILI_SEARCH_KEY
} = import.meta.env;

export async function getAllProducts(establishmentId: string) {
	const productsQuery = query(
		collection(db, Collection.Products),
		where('establishmentId', '==', establishmentId),
		where('deletedAt', '==', null)
	);

	const snapshot = await getDocs(productsQuery);
	return snapshot.docs.map(doc => {
		const data = doc.data();
		let prices = data.prices;
		if (typeof prices === 'string') {
			try { prices = JSON.parse(prices); } catch { /* ignore */ }
		}
		return {
			...data,
			prices
		};
	}) as unknown as ProductProps[];
}

export async function createProduct({ photo, ...data }: Partial<ProductProps> & { photo?: File | null }) {
	const photoUrl = (photo)
		? await uploadFile(photo)
		: null;

	const { id: productId } = await addDoc(collection(db, Collection.Products), {
		...data,
		photoUrl,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null
	});

	await fetch(VITE_APP_MEILI_SEARCH_HOST + '/indexes/products/documents?primaryKey=id', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${VITE_APP_MEILI_SEARCH_KEY}`
		},
		body: JSON.stringify({
			...data,
			photoUrl,
			id: productId
		})
	});
}

export async function updateProduct(id: string, { photo, ...data }: Partial<ProductProps> & { photo?: File | null }) {
	let photoUrl = null;
	if (photo) {
		photoUrl = await uploadFile(photo);
	}
	if (photo === null) {
		photoUrl = null;
	}

	const prices = (data.prices)
		? (typeof data.prices === 'string' ? data.prices : JSON.stringify(data.prices))
		: null;

	const updates: any = {
		...data,
		updatedAt: new Date()
	};

	if (photoUrl !== null) updates.photoUrl = photoUrl;
	if (prices !== null) updates.prices = prices;

	await updateDoc(doc(db, Collection.Products, id), updates);

	await fetch(VITE_APP_MEILI_SEARCH_HOST + '/indexes/products/documents?primaryKey=id', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${VITE_APP_MEILI_SEARCH_KEY}`
		},
		body: JSON.stringify([{
			...data,
			...(photoUrl !== null && { photoUrl }),
			id
		}])
	});
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

	await fetch(`${VITE_APP_MEILI_SEARCH_HOST}/indexes/products/documents/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${VITE_APP_MEILI_SEARCH_KEY}`
		}
	});
}
