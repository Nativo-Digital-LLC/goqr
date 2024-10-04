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
	name: string;
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
			if (params.id) {
				await updateSubcategory(params.id, params?.name, params?.photo);
			} else {
				await createSubcategory(
					params.categoryId,
					params.name,
					params.order!,
					params.photo!
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

type UseDeleteSubcategoryType = [
	(id: string, establishmentId: string, onDone?: () => void) => void,
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

	async function handleDelete(
		categoryd: string,
		id: string,
		dir: 'up' | 'down',
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await changeSubcategoryOrder(
				categoryd,
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