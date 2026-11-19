import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';

import { Collection } from '../constants/Collections';
import { db } from '../utils/firebase';

export async function saveOrder(
	path: 'categories' | 'subcategories' | 'products',
	establishmentId: string,
	items: { id: string; order: number }[],
	categoryId?: string
) {
	if (path === 'subcategories' && !categoryId) throw new Error('categoryId es requerido para ordenar subcategorías');

	const batch = writeBatch(db);
	for (const { id, order } of items) {
		const ref = path === 'products'
			? doc(db, Collection.Products, id)
			: path === 'categories'
				? doc(db, Collection.Establishments, establishmentId, Collection.Categories, id)
				: doc(db, Collection.Establishments, establishmentId, Collection.Categories, categoryId!, Collection.Subcategories, id);
		batch.update(ref, { order, updatedAt: serverTimestamp() });
	}
	await batch.commit();
}
