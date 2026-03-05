import {
	addDoc,
	collection,
	doc,
	getDocs,
	updateDoc,
	query
} from 'firebase/firestore';

import { Collection } from '../constants/Collections';
import { SubcategoryProps } from '../types/Subcategory';
import { db } from '../utils/firebase';
import { uploadFile } from '../utils/helpers';

interface CreateSubcategoryParams {
	categoryId: string;
	establishmentId: string;
	es_name: string;
	en_name?: string | null;
	order: number;
	photo: File;
}

export async function createSubcategory({ es_name, en_name = null, order, categoryId, establishmentId, photo }: CreateSubcategoryParams) {
	const subcategoriesRef = collection(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories');
	const subSnap = await getDocs(query(subcategoriesRef));
	const subcategories = subSnap.docs.map(doc => doc.data() as SubcategoryProps);

	const maxOrder = subcategories.length > 0 ? Math.max(...subcategories.map(({ order }) => order)) : 0;
	if (subcategories.length > 0 && order <= maxOrder) {
		await Promise.all(
			subcategories
				.filter((subcategory) => subcategory.order >= order)
				.map(({ order, id }) => {
					const subcategoryRef = doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', id);
					return updateDoc(subcategoryRef, {
						order: order + 1
					});
				})
		);
	}

	const photoUrl = await uploadFile(photo);

	const subcategory = {
		es_name,
		en_name,
		order,
		photoUrl,
		createdAt: new Date(),
		updatedAt: new Date(),
	}
	const { id: subcategoryId } = await addDoc(subcategoriesRef, subcategory);

	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', subcategoryId), {
		id: subcategoryId
	});
}

interface UpdateSubcategoryParams {
	categoryId: string;
	id: string;
	en_name?: string;
	es_name?: string;
	photo?: File;
	establishmentId: string;
}

export async function updateSubcategory({ id, categoryId, establishmentId, photo, es_name, en_name }: UpdateSubcategoryParams) {
	const updates: any = { updatedAt: new Date() };

	if (photo) {
		updates.photoUrl = await uploadFile(photo);
	}
	if (en_name !== undefined) updates.en_name = en_name;
	if (es_name !== undefined) updates.es_name = es_name;

	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', id), updates);
}

export async function changeSubcategoryOrder(
	establishmentId: string,
	categoryId: string,
	id: string,
	dir: 'up' | 'down'
) {
	const subcategoriesRef = collection(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories');
	const subSnap = await getDocs(query(subcategoriesRef));
	const subcategories = subSnap.docs.map(doc => doc.data() as SubcategoryProps);
	if (!subcategories || subcategories.length === 0) return;

	const subcategory = subcategories.find((c) => c.id === id);
	if (!subcategory) return;

	const currentOrder = subcategory.order;
	const order = (dir === 'down') ? currentOrder + 1 : currentOrder - 1;

	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', id), { order });

	const order2Find = (dir === 'down')
		? Math.min(
			...subcategories
				.filter((c) => c.order > currentOrder)
				.map((c) => c.order)
		)
		: Math.max(
			...subcategories
				.filter((c) => c.order < currentOrder)
				.map((c) => c.order)
		);

	const subcategoryInNewPosition = subcategories.find((c) => c.order === order2Find);

	if (!subcategoryInNewPosition) {
		console.error('No se encontro la subcategoria adyacente');
		return;
	}

	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', subcategoryInNewPosition.id), {
		order: currentOrder
	});
}

export async function deleteSubcategory(id: string, categoryId: string, establishmentId: string) {
	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', id), {
		deletedAt: new Date()
	});
}
