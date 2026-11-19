import { useEffect, useState } from 'react';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

import { db } from '@/utils/firebase';
import { Collection } from '@/constants/Collections';
import { isVisibleProduct } from '@/lib/menu';
import { EstablishmentProps } from '@/types/Establishment';
import { CategoryProps } from '@/types/Category';
import { SubcategoryProps } from '@/types/Subcategory';
import { ProductProps } from '@/types/Product';

export type PublicMenu = {
	establishment: EstablishmentProps;
	categories: CategoryProps[];
	subcategories: Record<string, SubcategoryProps[]>;
	products: ProductProps[];
};

type State =
	| { status: 'loading' }
	| { status: 'not-found' }
	| { status: 'error' }
	| { status: 'ready'; menu: PublicMenu };

export type PublicMenuResult =
	| { status: 'loading' }
	| { status: 'not-found' }
	| { status: 'error'; retry: () => void }
	| { status: 'ready'; menu: PublicMenu };

const byOrder = <T extends { order?: number }>(a: T, b: T) => (a.order ?? 0) - (b.order ?? 0);

const withId = <T>(d: { id: string; data: () => unknown }) => ({ ...(d.data() as object), id: d.id }) as T;

export const usePublicMenu = (slug: string | undefined): PublicMenuResult => {
	const [state, setState] = useState<State>({ status: 'loading' });
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		if (!slug) {
			setState({ status: 'not-found' });
			return;
		}

		let cancelled = false;
		setState({ status: 'loading' });

		(async () => {
			try {
				const found = await getDocs(
					query(collection(db, Collection.Establishments), where('domain', '==', slug), limit(1))
				);
				if (found.empty) {
					if (!cancelled) setState({ status: 'not-found' });
					return;
				}
				const establishment = withId<EstablishmentProps>(found.docs[0]);
				const id = establishment.id;

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
				const products = prodsSnap.docs
					.map((d) => withId<ProductProps>(d))
					.filter(isVisibleProduct)
					.sort(byOrder);

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

				if (!cancelled) setState({ status: 'ready', menu: { establishment, categories, subcategories, products } });
			} catch (error) {
				console.error(error);
				if (!cancelled) setState({ status: 'error' });
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [slug, attempt]);

	if (state.status === 'error') {
		return { status: 'error', retry: () => setAttempt((n) => n + 1) };
	}
	return state;
};
