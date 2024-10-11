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

export async function createProduct({ photo, ...data }: Partial<ProductProps> & { photo: File }) {
	const photoUrl = await uploadFile(photo);

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

export async function updateProduct(id: string,  {photo, ...data }: Partial<ProductProps> & { photo?: File }) {
	const photoUrl = (photo)
		? await uploadFile(photo)
		: undefined;

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

export async function changeProductOrder(subcategoryId: string, id: string, dir: 'up' | 'down') {
	const { documents } = await db.listDocuments(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		[
			Query.equal('subcategoryId', subcategoryId),
			Query.isNull('deletedAt')
		]
	);

	const products = documents as unknown as ProductProps[];

	const product = products.find(({ $id }) => $id === id)!;
	const order = (dir === 'down')
		? product.order + 1
		: product.order - 1;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		id,
		{ order }
	);

	const order2Find = (dir === 'down')
		? Math.min(
			...products
				.filter(({ order }) => order > product.order)
				.map(({ order }) => order)
		)
		: Math.max(
			...products
				.filter(({ order }) => order < product.order)
				.map(({ order }) => order)
		);
	const productInNewPosition = products.find((product) => {
		return product.order === order2Find
	});

	if (!productInNewPosition) {
		console.error('No se encontró el producto');
		return;
	}

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		productInNewPosition.$id,
		{
			order: product.order
		}
	);
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
