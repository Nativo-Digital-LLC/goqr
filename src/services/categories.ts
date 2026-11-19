import {
	addDoc,
	collection,
	doc,
	increment,
	updateDoc
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
	hidden?: boolean;
}

export async function createCategory({ es_name, en_name = null, order, establishmentId, enableSubcategories, hidden = false }: CreateCategoryParams) {
	const ref = collection(db, Collection.Establishments, establishmentId, 'categories');
	const { id } = await addDoc(ref, {
		es_name,
		en_name,
		order,
		enableSubcategories,
		hidden,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null
	});

	return id;
}

export async function deleteCategory(id: string, establishmentId: string) {
	const ref = doc(db, Collection.Establishments, establishmentId, 'categories', id);
	await updateDoc(ref, {
		deletedAt: new Date()
	});
}

interface UpdateCategoryNameParams {
	id: string;
	es_name?: string;
	en_name?: string | null;
	enableSubcategories?: boolean;
	hidden?: boolean;
	establishmentId: string;
}

// Los campos sin definir no se escriben (así ocultar/mostrar no toca nombres ni subcategorías).
export async function updateCategoryName({ establishmentId, id, es_name, en_name, enableSubcategories, hidden }: UpdateCategoryNameParams) {
	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', id), {
		...(es_name !== undefined && { es_name }),
		...(en_name !== undefined && { en_name }),
		...(enableSubcategories !== undefined && { enableSubcategories }),
		...(hidden !== undefined && { hidden }),
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
