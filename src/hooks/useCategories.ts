import { useState } from 'react';
import { AppwriteException } from 'appwrite';

import {
	createCategory,
	deleteCategory,
	updateCategoryName,
	updateCategoryOrder
} from '../services/categories';

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
	AppwriteException | null
];

export const useSaveCategory = (): UseSaveCategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleSave(params: SaveCategoryParams, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);

			const {
				establishmentId,
				es_name,
				en_name,
				enableSubcategories,
				order
			} = params;

			if (params?.id) {
				await updateCategoryName({
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
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleSave, loading, error];
}

type UseDeleteCategoryType = [
	(id: string, establishmentId: string, onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useDeleteCategory = (): UseDeleteCategoryType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleDelete(id: string, establishmentId: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await deleteCategory(id, establishmentId);
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
