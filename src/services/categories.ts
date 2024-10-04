import { ID } from 'appwrite';

import { db } from '../utils/appwrite';
import { Collection } from '../constants/Collections';
import { EstablishmentProps } from '../types/Establishment';

export async function createCategory(establishmentId: string, name: string, order: number) {
	const { categories } = await db.getDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Establishments,
		establishmentId
	) as unknown as EstablishmentProps;

	if (order <= Math.max(...categories.map(({ order }) => order))) {
		await Promise.all(
			categories
				.filter((category) => category.order >= order)
				.map(({ order, $id }) => {
					return db.updateDocument(
						import.meta.env.VITE_APP_WRITE_DB_ID,
						Collection.Categories,
						$id,
						{ order: order + 1 }
					);
				})
		);
	}

	const { $id } = await db.createDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		ID.unique(),
		{ name, order }
	);

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Establishments,
		establishmentId,
		{
			categories: categories.map(({ $id }) => $id).concat($id)
		}
	);
}

export async function deleteCategory(id: string, establishmentId: string) {
	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		id,
		{
			deletedAt: new Date()
		}
	);

	const { categories } = await db.getDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Establishments,
		establishmentId
	) as unknown as EstablishmentProps;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Establishments,
		establishmentId,
		{
			categories: categories.filter(({ $id }) => $id !== id)
		}
	);
}

export async function updateCategoryName(id: string, name: string) {
	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		id,
		{ name }
	);
}

export async function updateCategoryOrder(establishmentId: string, id: string, dir: 'left' | 'right') {
	const { categories } = await db.getDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Establishments,
		establishmentId
	) as unknown as EstablishmentProps;

	const category = categories.find(({ $id }) => $id === id)!;
	const order = (dir === 'right')
		? category.order + 1
		: category.order - 1;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		id,
		{ order }
	);

	const order2Find = (dir === 'right')
		? Math.min(
			...categories
				.filter(({ order }) => order > category.order)
				.map(({ order }) => order)
		)
		: Math.max(
			...categories
				.filter(({ order }) => order < category.order)
				.map(({ order }) => order)
		);
	const categoryInNewPosition = categories.find((category) => {
		return category.order === order2Find
	});

	if (!categoryInNewPosition) {
		console.error('No se encontro la categoria adyacente');
		return;
	}

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		categoryInNewPosition.$id,
		{
			order: category.order
		}
	);
}
