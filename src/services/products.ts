import { ID, Query } from 'appwrite';

import { db } from '../utils/appwrite';
import { Collection } from '../constants/Collections';
import { ProductProps } from '../types/Product';
import { uploadFile } from '../utils/helpers';

const {
	VITE_APP_MEILI_SEARCH_HOST,
	VITE_APP_MEILI_SEARCH_KEY
} = import.meta.env;

export async function getAllProducts(establishmentId: string) {
	const { documents } = await db.listDocuments(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		[
			Query.limit(5000),
			Query.equal('establishmentId', establishmentId),
			Query.isNull('deletedAt')
		]
	);

	return documents.map(({ prices, ...rest }) => ({
		prices: JSON.parse(prices),
		...rest
	})) as unknown as ProductProps[];
}

export async function createProduct({ photo, ...data }: Partial<ProductProps> & { photo?: File | null }) {
	const photoUrl = (photo)
		? await uploadFile(photo)
		: null;

	const { $id } = await db.createDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		ID.unique(),
		{
			...data,
			prices: JSON.stringify(data.prices),
			photoUrl
		}
	);

	await fetch(VITE_APP_MEILI_SEARCH_HOST + '/indexes/products/documents?primaryKey=$id', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${VITE_APP_MEILI_SEARCH_KEY}`
		},
		body: JSON.stringify({
			...data,
			photoUrl,
			$id
		})
	});
}

export async function updateProduct(id: string, { photo, ...data }: Partial<ProductProps> & { photo?: File | null }) {
	let photoUrl = undefined;
	if (photo) {
		photoUrl = await uploadFile(photo);
	}

	if (photo === null) {
		photoUrl = null;
	}

	const prices = (data.prices)
		? JSON.stringify(data.prices)
		: undefined;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		id,
		{
			...data,
			photoUrl,
			prices
		}
	);

	await fetch(VITE_APP_MEILI_SEARCH_HOST + '/indexes/products/documents?primaryKey=$id', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${VITE_APP_MEILI_SEARCH_KEY}`
		},
		body: JSON.stringify([{
			...data,
			...(photoUrl && { photoUrl }),
			$id: id
		}])
	});
}

export async function changeProductOrder(
	categoryId: string,
	subcategoryId: string | null,
	id: string,
	dir: 'up' | 'down'
) {
	const queries = [
		Query.equal('categoryId', categoryId),
		Query.isNull('deletedAt'),
		Query.orderAsc('order')
	];

	if (subcategoryId !== null) {
		queries.push(Query.equal('subcategoryId', subcategoryId));
	}

	const { documents } = await db.listDocuments(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		queries
	);

	const products = documents as unknown as ProductProps[];

	const currentIndex = products.findIndex(({ $id }) => $id === id);

	if (currentIndex === -1) {
		console.error('No se encontró el producto');
		return;
	}

	// Determina el índice del producto con el que intercambiar
	const targetIndex = dir === 'down' ? currentIndex + 1 : currentIndex - 1;

	// Verifica que el índice objetivo sea válido
	if (targetIndex < 0 || targetIndex >= products.length) {
		console.warn('El producto ya está en la primera/última posición');
		return;
	}

	const currentProduct = products[currentIndex];
	const targetProduct = products[targetIndex];

	// Intercambia los valores de order
	await Promise.all([
		db.updateDocument(
			import.meta.env.VITE_APP_WRITE_DB_ID,
			Collection.Products,
			currentProduct.$id,
			{ order: targetProduct.order }
		),
		db.updateDocument(
			import.meta.env.VITE_APP_WRITE_DB_ID,
			Collection.Products,
			targetProduct.$id,
			{ order: currentProduct.order }
		)
	]);
}

export async function deleteProduct(id: string) {
	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		id,
		{
			deletedAt: new Date()
		}
	);

	await await fetch(`${VITE_APP_MEILI_SEARCH_HOST}/indexes/products/documents/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${VITE_APP_MEILI_SEARCH_KEY}`
		}
	});
}
