import { ID } from 'appwrite';

import { Collection } from '../constants/Collections';
import { CategoryProps } from '../types/Category';
import { db } from '../utils/appwrite';
import { uploadFile } from '../utils/helpers';

interface CreateSubcategoryParams {
	categoryId: string;
	es_name: string;
	en_name?: string | null;
	order: number;
	photo: File;
}

export async function createSubcategory({ categoryId, es_name, en_name = null, order, photo }: CreateSubcategoryParams) {
	const { subcategories } = await db.getDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		categoryId
	) as unknown as CategoryProps;

	if (order <= Math.max(...subcategories.map(({ order }) => order))) {
		await Promise.all(
			subcategories
				.filter((subcategory) => subcategory.order >= order)
				.map(({ order, $id }) => {
					return db.updateDocument(
						import.meta.env.VITE_APP_WRITE_DB_ID,
						Collection.Subcategories,
						$id,
						{ order: order + 1 }
					);
				})
		);
	}

	const photoUrl = await uploadFile(photo);

	const { $id } = await db.createDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Subcategories,
		ID.unique(),
		{
			es_name,
			en_name,
			order,
			photoUrl
		}
	);

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		categoryId,
		{
			subcategories: subcategories.map(({ $id }) => $id).concat($id)
		}
	);
}

interface UpdateSubcategoryParams {
	id: string;
	en_name?: string;
	es_name?: string;
	photo?: File;
}

export async function updateSubcategory({ id, es_name, en_name, photo }: UpdateSubcategoryParams) {
	const photoUrl = (photo)
		? await uploadFile(photo)
		: undefined;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Subcategories,
		id,
		{ en_name, es_name, photoUrl }
	);
}

export async function changeSubcategoryOrder(categoryId: string, id: string, dir: 'up' | 'down') {
	const { subcategories } = await db.getDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		categoryId
	) as unknown as CategoryProps;

	const subcategory = subcategories.find(({ $id }) => $id === id)!;
	const order = (dir === 'down')
		? subcategory.order + 1
		: subcategory.order - 1;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Subcategories,
		id,
		{ order }
	);

	const order2Find = (dir === 'down')
		? Math.min(
			...subcategories
				.filter(({ order }) => order > subcategory.order)
				.map(({ order }) => order)
		)
		: Math.max(
			...subcategories
				.filter(({ order }) => order < subcategory.order)
				.map(({ order }) => order)
		);
	const subcategoryInNewPosition = subcategories.find((subcategory) => {
		return subcategory.order === order2Find
	});

	if (!subcategoryInNewPosition) {
		console.error('No se encontro la subcategoria adyacente');
		return;
	}

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Subcategories,
		subcategoryInNewPosition.$id,
		{
			order: subcategory.order
		}
	);
}

export async function deleteSubcategory(id: string, categoryId: string) {
	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Subcategories,
		id,
		{
			deletedAt: new Date()
		}
	);

	const { subcategories } = await db.getDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		categoryId
	) as unknown as CategoryProps;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Categories,
		categoryId,
		{
			subcategories: subcategories.filter(({ $id }) => $id !== id)
		}
	);
}
