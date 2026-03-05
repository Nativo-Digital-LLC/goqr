import {
	addDoc,
	collection,
	doc,
	getDocs,
	increment,
	query,
	updateDoc,
	where
} from 'firebase/firestore';

import { db } from '../utils/firebase';
import { Collection } from '../constants/Collections';
// import { CategoryProps } from '../types/Category';

interface CreateCategoryParams {
	establishmentId: string;
	es_name: string;
	en_name?: string | null;
	order: number;
	enableSubcategories?: boolean;
}

export async function createCategory({ es_name, en_name = null, order, establishmentId, enableSubcategories }: CreateCategoryParams) {
	const ref = collection(db, Collection.Establishments, establishmentId, 'categories');
	const { id } = await addDoc(ref, {
		es_name,
		en_name,
		order,
		enableSubcategories,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null
	});

	const categoriesQuery = query(
		collection(db, Collection.Establishments, establishmentId, 'categories'),
		where('deletedAt', '==', null),
		where('order', '>=', order)
	);

	const snap = await getDocs(categoriesQuery);
	if (snap.size <= 1) {
		return;
	}

	await Promise.all(
		snap
			.docs
			.filter((item) => item.id !== id)
			.map((item) => {
				const ref = doc(db, Collection.Establishments, establishmentId, 'categories', item.id);
				return updateDoc(ref, {
					order: increment(1)
				});
			})
	);
}

export async function deleteCategory(id: string, establishmentId: string) {
	const ref = doc(db, Collection.Establishments, establishmentId, 'categories', id);
	await updateDoc(ref, {
		deletedAt: new Date()
	});
}

interface UpdateCategoryNameParams {
	id: string;
	es_name: string;
	en_name?: string | null;
	enableSubcategories?: boolean;
	establishmentId: string;
}

export async function updateCategoryName({ establishmentId, id, es_name, en_name = null, enableSubcategories }: UpdateCategoryNameParams) {
	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', id), {
		es_name,
		en_name,
		enableSubcategories,
		updatedAt: new Date()
	});
}

export async function updateCategoryOrder(establishmentId: string, id: string, dir: 'left' | 'right', neighborId: string) {
	await Promise.all([
		updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', id), {
			order: increment(dir === 'left' ? -1 : 1)
		}),
		updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', neighborId), {
			order: increment(dir === 'left' ? 1 : -1)
		})
	]);
}
