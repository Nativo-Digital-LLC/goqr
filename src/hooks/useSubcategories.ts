import { useState } from 'react';
import { AppwriteException } from 'appwrite';

import {
	createSubcategory,
	updateSubcategory,
	changeSubcategoryOrder,
	deleteSubcategory
} from '../services/subcategories';

interface SaveSubcategoryParams {
	id?: string;
	categoryId: string;
	es_name: string;
	en_name?: string;
	photo?: File;
	order?: number;
}

type UseSaveSubcategoryType = [
	(params: SaveSubcategoryParams, onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useSaveSubcategory = (): UseSaveSubcategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleSave(params: SaveSubcategoryParams, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			const {
				categoryId,
				es_name,
				en_name,
				photo,
				order
			} = params;

			if (params?.id) {
				await updateSubcategory({
					id: params.id,
					es_name,
					en_name,
					photo
				});
			} else {
				await createSubcategory({
					categoryId,
					es_name,
					en_name,
					order: order!,
					photo: photo!
				});
			}

			onDone?.();
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleSave, loading, error];
}

type UseDeleteSubcategoryType = [
	(id: string, categoryId: string, onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useDeleteSubcategory = (): UseDeleteSubcategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleDelete(id: string, categoryId: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await deleteSubcategory(id, categoryId);
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleDelete, loading, error];
}

type UseChangeSubcategoryOrderType = [
	(
		categoryId: string,
		id: string,
		dir: 'up' | 'down',
		onDone?: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useUpdateSubcategoryOrder = (): UseChangeSubcategoryOrderType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleUpdate(
		categoryId: string,
		id: string,
		dir: 'up' | 'down',
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await changeSubcategoryOrder(
				categoryId,
				id,
				dir
			);
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleUpdate, loading, error];
}
