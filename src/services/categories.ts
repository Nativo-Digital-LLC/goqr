import { ID } from 'appwrite';

import { Collection } from '../constants/Collections';
import { db } from '../utils/appwrite';
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

export async function deleteCategory(id: string) {
	await db.deleteDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		id
	);
}
