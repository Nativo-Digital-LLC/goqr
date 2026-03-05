import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';

import {
	createCategory,
	deleteCategory,
	updateCategoryName,
	updateCategoryOrder
} from '../services/categories';
import { db } from '../utils/firebase';
import { CategoryProps } from '../types/Category';

type UseGetCategoriesType = [
	CategoryProps[],
	boolean,
	FirebaseError | null
];

export const useGetCategories = (establishmentId?: string): UseGetCategoriesType => {
	const [categories, setCategories] = useState<CategoryProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	useEffect(() => {
		if (!establishmentId) {
			return;
		}

		const ref = query(
			collection(db, "establishments", establishmentId, "categories"),
			where("deletedAt", "==", null),
			orderBy("order", "asc")
		);
		const unsubscribe = onSnapshot(
			ref,
			(snapshot) => {
				setCategories(snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id
				} as CategoryProps)));
				setLoading(false);
			},
			setError
		);

		return () => unsubscribe();
	}, [establishmentId]);

	return [categories, loading, error];
}

interface SaveCategoryParams {
	id?: string;
	establishmentId: string;
	es_name: string;
	en_name: string;
	order?: number;
	enableSubcategories?: boolean;
}

type UseSaveCategoryType = [
	(params: SaveCategoryParams, onDone?: () => void) => void,
	boolean,
	FirebaseError | null
];

export const useSaveCategory = (): UseSaveCategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleSave(params: SaveCategoryParams, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);

			const {
				establishmentId,
				es_name,
				en_name = null,
				enableSubcategories = true,
				order
			} = params;

			if (params?.id) {
				await updateCategoryName({
					establishmentId,
					id: params.id,
					es_name,
					en_name,
					enableSubcategories
				});
			} else {
				await createCategory({
					establishmentId,
					en_name,
					es_name,
					order: order!,
					enableSubcategories
				});
			}

			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleSave, loading, error];
}

type UseDeleteCategoryType = [
	(id: string, establishmentId: string, onDone?: () => void) => void,
	boolean,
	FirebaseError | null
];

export const useDeleteCategory = (): UseDeleteCategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleDelete(id: string, establishmentId: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await deleteCategory(id, establishmentId);
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleDelete, loading, error];
}

type UseUpdateCategoryOrderType = [
	(
		establishmentId: string,
		id: string,
		dir: 'left' | 'right',
		neighborId: string,
		onDone?: () => void
	) => void,
	boolean,
	FirebaseError | null
];

export const useUpdateCategoryOrder = (): UseUpdateCategoryOrderType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleDelete(
		establishmentId: string,
		id: string,
		dir: 'left' | 'right',
		neighborId: string,
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await updateCategoryOrder(
				establishmentId,
				id,
				dir,
				neighborId
			);
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleDelete, loading, error];
}
