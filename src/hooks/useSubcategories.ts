import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';

import {
	createSubcategory,
	updateSubcategory,
	changeSubcategoryOrder,
	deleteSubcategory
} from '../services/subcategories';
import { SubcategoryProps } from '../types/Subcategory';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';

type UseGetSubcategoriesType = [
	SubcategoryProps[],
	boolean,
	FirebaseError | null
];

export const useGetSubcategories = (establishmentId?: string, categoryId?: string): UseGetSubcategoriesType => {
	const [subcategories, setSubcategories] = useState<SubcategoryProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	useEffect(() => {
		if (!establishmentId || !categoryId) {
			return;
		}

		const ref = query(
			collection(
				db,
				"establishments",
				establishmentId,
				"categories",
				categoryId,
				"subcategories"
			),
			where("deletedAt", "==", null),
			orderBy("order", "asc")
		);
		const unsubscribe = onSnapshot(
			ref,
			(snapshot) => {
				setSubcategories(snapshot.docs.map((doc) => doc.data() as SubcategoryProps));
				setLoading(false);
			},
			setError
		);

		return () => unsubscribe();
	}, [establishmentId, categoryId]);

	return [subcategories, loading, error];
}

interface SaveSubcategoryParams {
	id?: string;
	categoryId: string;
	establishmentId: string;
	es_name: string;
	en_name?: string;
	photo?: File;
	order?: number;
}

type UseSaveSubcategoryType = [
	(params: SaveSubcategoryParams, onDone?: () => void) => void,
	boolean,
	FirebaseError | null
];

export const useSaveSubcategory = (): UseSaveSubcategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleSave(params: SaveSubcategoryParams, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			const {
				categoryId,
				establishmentId,
				es_name,
				en_name,
				photo,
				order
			} = params;

			if (params?.id) {
				await updateSubcategory({
					categoryId: params.categoryId,
					establishmentId: params.establishmentId,
					id: params.id,
					es_name,
					en_name,
					photo
				});
			} else {
				await createSubcategory({
					categoryId,
					establishmentId,
					es_name,
					en_name,
					order: order!,
					photo: photo!
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

type UseDeleteSubcategoryType = [
	(id: string, categoryId: string, establishmentId: string, onDone?: () => void) => void,
	boolean,
	FirebaseError | null
];

export const useDeleteSubcategory = (): UseDeleteSubcategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleDelete(id: string, categoryId: string, establishmentId: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await deleteSubcategory(id, categoryId, establishmentId);
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleDelete, loading, error];
}

type UseChangeSubcategoryOrderType = [
	(
		establishmentId: string,
		categoryId: string,
		id: string,
		dir: 'up' | 'down',
		onDone?: () => void
	) => void,
	boolean,
	FirebaseError | null
];

export const useUpdateSubcategoryOrder = (): UseChangeSubcategoryOrderType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleUpdate(
		establishmentId: string,
		categoryId: string,
		id: string,
		dir: 'up' | 'down',
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await changeSubcategoryOrder(
				establishmentId,
				categoryId,
				id,
				dir
			);
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleUpdate, loading, error];
}
