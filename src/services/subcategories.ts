import {
	addDoc,
	collection,
	doc,
	getDocs,
	updateDoc,
	query,
	where,
	increment
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
	const photoUrl = await uploadFile(photo);
	const subcategory = {
		es_name,
		en_name,
		order,
		photoUrl,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null
	}
	const { id } = await addDoc(subcategoriesRef, subcategory);

	const subcategoriesQuery = query(
		subcategoriesRef,
		where('deletedAt', '==', null),
		where('order', '>=', order)
	);
	const snap = await getDocs(subcategoriesQuery);
	if (snap.size <= 1) {
		return;
	}

	await Promise.all(
		snap
			.docs
			.filter((item) => item.id !== id)
			.map((item) => {
				const subcategoryRef = doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', item.id);
				return updateDoc(subcategoryRef, {
					order: increment(1)
				});
			})
	);
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

	const ref = doc(
		db,
		Collection.Establishments,
		establishmentId,
		'categories',
		categoryId,
		'subcategories',
		id
	);
	await updateDoc(ref, updates);
}

export async function changeSubcategoryOrder(
	establishmentId: string,
	categoryId: string,
	id: string,
	dir: 'up' | 'down',
	neighborId: string
) {
	await Promise.all([
		updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', id), {
			order: increment(dir === 'up' ? -1 : 1)
		}),
		updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', neighborId), {
			order: increment(dir === 'up' ? 1 : -1)
		})
	]);
}

export async function deleteSubcategory(id: string, categoryId: string, establishmentId: string) {
	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryId, 'subcategories', id), {
		deletedAt: new Date()
	});
}
