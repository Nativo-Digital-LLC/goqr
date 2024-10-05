import { ID, Query } from 'appwrite';

import { db } from '../utils/appwrite';
import { Collection } from '../constants/Collections';
import { ProductProps } from '../types/Product';
import { uploadFile } from '../utils/helpers';

export async function getAllProducts(establishmentId: string) {
	const { documents } = await db.listDocuments(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		[
			Query.equal('establishmentId', establishmentId),
			Query.isNull('deletedAt')
		]
	);

	return documents as unknown as ProductProps[];
}

export async function createProduct({ photo, ...data }: Partial<ProductProps> & { photo: File }) {
	const photoUrl = await uploadFile(photo);

	await db.createDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		ID.unique(),
		{
			...data,
			photoUrl
		}
	);
}

export async function updateProduct(id: string,  {photo, ...data }: Partial<ProductProps> & { photo?: File }) {
	const photoUrl = (photo)
		? await uploadFile(photo)
		: undefined;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		id,
		{
			...data,
			photoUrl
		}
	);
}

export async function changeProductOrder(establishmentId: string, id: string, dir: 'up' | 'down') {
	const { documents } = await db.listDocuments(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Products,
		[
			Query.equal('establishmentId', establishmentId),
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
		console.error('No se encontro la subcategoria adyacente');
		return;
	}

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Subcategories,
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
}
