import { useCallback, useEffect, useRef, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '@/utils/firebase';
import { Collection } from '@/constants/Collections';
import { CategoryProps } from '@/types/Category';
import { SubcategoryProps } from '@/types/Subcategory';
import { ProductProps } from '@/types/Product';

type Data = {
	categories: CategoryProps[];
	subcategories: Record<string, SubcategoryProps[]>;
	products: ProductProps[];
};

const empty: Data = { categories: [], subcategories: {}, products: [] };

const byOrder = <T extends { order?: number }>(a: T, b: T) => (a.order ?? 0) - (b.order ?? 0);
const withId = <T>(d: { id: string; data: () => unknown }) => ({ ...(d.data() as object), id: d.id }) as T;

async function fetchMenu(id: string): Promise<Data> {
	const [catsSnap, prodsSnap] = await Promise.all([
		getDocs(query(
			collection(db, Collection.Establishments, id, Collection.Categories),
			where('deletedAt', '==', null)
		)),
		getDocs(query(
			collection(db, Collection.Products),
			where('establishmentId', '==', id),
			where('deletedAt', '==', null)
		))
	]);
	const categories = catsSnap.docs.map((d) => withId<CategoryProps>(d)).sort(byOrder);
	const products = prodsSnap.docs.map((d) => withId<ProductProps>(d)).sort(byOrder);

	const subcategories: Record<string, SubcategoryProps[]> = {};
	await Promise.all(
		categories.filter((c) => c.enableSubcategories).map(async (c) => {
			const snap = await getDocs(query(
				collection(db, Collection.Establishments, id, Collection.Categories, c.id, Collection.Subcategories),
				where('deletedAt', '==', null)
			));
			subcategories[c.id] = snap.docs.map((d) => withId<SubcategoryProps>(d)).sort(byOrder);
		})
	);
	return { categories, subcategories, products };
}

export const useMenuEditor = (establishmentId: string | undefined) => {
	const [stored, setStored] = useState<{ id: string | undefined; data: Data; loading: boolean; error: Error | null }>(
		{ id: establishmentId, data: empty, loading: !!establishmentId, error: null }
	);
	const current = useRef(establishmentId);
	current.current = establishmentId;
	const generation = useRef(0);

	const load = useCallback(async (id: string | undefined): Promise<boolean> => {
		if (!id) return false;
		const gen = ++generation.current;
		try {
			const data = await fetchMenu(id);
			if (generation.current === gen) setStored({ id, data, loading: false, error: null });
			return true;
		} catch (e) {
			console.error(e);
			// Keep previous data (only if it belongs to this establishment).
			if (generation.current === gen) {
				setStored((s) => ({ ...s, id, data: s.id === id ? s.data : empty, loading: false, error: e as Error }));
			}
			return false;
		}
	}, []);

	useEffect(() => {
		setStored((s) => (s.id === establishmentId ? { ...s, loading: !!establishmentId } : { id: establishmentId, data: empty, loading: !!establishmentId, error: null }));
		load(establishmentId);
	}, [establishmentId, load]);

	const reload = useCallback(() => load(current.current), [load]);

	// Stale data from a previous establishment: never expose it.
	const fresh = stored.id === establishmentId;
	return {
		...(fresh ? stored.data : empty),
		loading: fresh ? stored.loading : !!establishmentId,
		error: fresh ? stored.error : null,
		reload
	};
};
