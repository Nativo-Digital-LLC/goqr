import { useState } from 'react';
import { AppwriteException } from 'appwrite';

import { createCategory, deleteCategory, updateCategoryName, updateCategoryOrder } from '../services/categories';

interface SaveCategoryParams {
	id?: string;
	establishmentId: string;
	name: string;
	order?: number;
}

type UseSaveCategoryType = [
	(params: SaveCategoryParams, onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useSaveCategory = (): UseSaveCategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleSave(params: SaveCategoryParams, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			if (params.id) {
				await updateCategoryName(params.id, params.name);
			} else {
				await createCategory(
					params.establishmentId,
					params.name,
					params.order!
				);
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

type UseDeleteCategoryType = [
	(id: string, onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useDeleteCategory = (): UseDeleteCategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleDelete(id: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await deleteCategory(id);
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException);
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
		onDone?: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useUpdateCategoryOrder = (): UseUpdateCategoryOrderType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleDelete(
		establishmentId: string,
		id: string,
		dir: 'left' | 'right',
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await updateCategoryOrder(
				establishmentId,
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

	return [handleDelete, loading, error];
}
