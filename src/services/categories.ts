import { addDoc, collection, doc, getDocs, query, updateDoc } from 'firebase/firestore';

import { db } from '../utils/firebase';
import { Collection } from '../constants/Collections';
import { CategoryProps } from '../types/Category';

interface CreateCategoryParams {
	establishmentId: string;
	es_name: string;
	en_name?: string | null;
	order: number;
	enableSubcategories?: boolean;
}

export async function createCategory({ es_name, en_name = null, order, establishmentId, enableSubcategories }: CreateCategoryParams) {
	const categoriesRef = collection(db, Collection.Establishments, establishmentId, 'categories');
	const catSnap = await getDocs(query(categoriesRef));
	const categories = catSnap.docs.map((doc) => ({
		...doc.data(),
		id: doc.id
	} as CategoryProps));

	const maxOrder = categories.length > 0 ? Math.max(...categories.map(({ order }) => order)) : 0;
	if (categories.length > 0 && order <= maxOrder) {
		await Promise.all(
			categories
				.filter((category) => category.order >= order)
				.map((category) => {
					const ref = doc(db, Collection.Establishments, establishmentId, 'categories', category.id);
					return updateDoc(ref, { order: category.order + 1 });
				})
		);
	}

	const ref = collection(db, Collection.Establishments, establishmentId, 'categories');
	await addDoc(ref, {
		es_name,
		en_name,
		order,
		enableSubcategories,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null
	});
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

export async function updateCategoryOrder(establishmentId: string, id: string, dir: 'left' | 'right') {
	const categoriesRef = collection(db, Collection.Establishments, establishmentId, 'categories');
	const catSnap = await getDocs(query(categoriesRef));
	const categories = catSnap.docs.map(doc => doc.data() as CategoryProps);

	if (!categories || categories.length === 0) return;

	const category = categories.find((c) => c.id === id);
	if (!category) return;

	const currentOrder = category.order;
	const order = (dir === 'right') ? currentOrder + 1 : currentOrder - 1;

	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', id), { order });

	const order2Find = (dir === 'right')
		? Math.min(
			...categories
				.filter((c) => c.order > currentOrder)
				.map((c) => c.order)
		)
		: Math.max(
			...categories
				.filter((c) => c.order < currentOrder)
				.map((c) => c.order)
		);

	const categoryInNewPosition = categories.find((c) => c.order === order2Find);

	if (!categoryInNewPosition) {
		console.error('No se encontro la categoria adyacente');
		return;
	}

	await updateDoc(doc(db, Collection.Establishments, establishmentId, 'categories', categoryInNewPosition.id), {
		order: currentOrder
	});
}
