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
	categoryId: string,
	subcategoryId: string | null,
	id: string,
	dir: 'up' | 'down'
) {
	let q;
	if (subcategoryId !== null) {
		q = query(
			collection(db, Collection.Products),
			where('categoryId', '==', categoryId),
			where('subcategoryId', '==', subcategoryId),
			where('deletedAt', '==', null),
			orderBy('order', 'asc')
		);
	} else {
		q = query(
			collection(db, Collection.Products),
			where('categoryId', '==', categoryId),
			where('deletedAt', '==', null),
			orderBy('order', 'asc')
		);
	}

	const snapshot = await getDocs(q);
	const products = snapshot.docs.map(d => d.data() as unknown as ProductProps);

	const currentIndex = products.findIndex(({ id: prodId }) => prodId === id);

	if (currentIndex === -1) {
		console.error('No se encontró el producto');
		return;
	}

	const targetIndex = dir === 'down' ? currentIndex + 1 : currentIndex - 1;

	if (targetIndex < 0 || targetIndex >= products.length) {
		console.warn('El producto ya está en la primera/última posición');
		return;
	}

	const currentProduct = products[currentIndex];
	const targetProduct = products[targetIndex];

	await Promise.all([
		updateDoc(doc(db, Collection.Products, currentProduct.id), {
			order: targetProduct.order
		}),
		updateDoc(doc(db, Collection.Products, targetProduct.id), {
			order: currentProduct.order
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
