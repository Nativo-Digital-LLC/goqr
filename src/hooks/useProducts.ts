import { useEffect, useState } from 'react';
import { AppwriteException } from 'appwrite';

import { ProductProps } from '../types/Product';
import {
	changeProductOrder,
	createProduct,
	deleteProduct,
	getAllProducts,
	updateProduct
} from '../services/products';

type UseGetAllProductsType = [
	ProductProps[],
	boolean,
	AppwriteException | null,
	(establishmentId: string) => void
];

export const useGetAllProducts = (establishmentId?: string): UseGetAllProductsType => {
	const [products, setProducts] = useState<ProductProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	useEffect(() => {
		if (establishmentId) {
			load(establishmentId);
		}

	}, [establishmentId]);

	async function load(establishmentId: string) {
		try {
			setLoading(true);
			setError(null);
			const data = await getAllProducts(establishmentId);
			setProducts(data);
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [products, loading, error, load];
}

type UseSaveProductType = [
	(
		data: Partial<ProductProps> & { photo?: File | null },
		onDone?: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useSaveProduct = (): UseSaveProductType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleSave(
		{ $id, ...data }: Partial<ProductProps> & { photo?: File | null },
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			if ($id) {
				await updateProduct($id, data);
			} else {
				await createProduct(data);
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

type UseChangeProductOrderType = [
	(
		subcategoryId: string,
		id: string,
		dir: 'up' | 'down',
		onDone?: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useChangeProductOrder = (): UseChangeProductOrderType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleUpdate(
		subcategoryId: string,
		id: string,
		dir: 'up' | 'down',
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await changeProductOrder(
				subcategoryId,
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

type UseDeleteProductType = [
	(id: string, onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useDeleteProduct = (): UseDeleteProductType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleDelete(id: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await deleteProduct(id);
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleDelete, loading, error];
}
