import { useEffect, useState } from 'react';
import { AppwriteException } from 'appwrite';

import { ProductProps } from '../types/Product';
import { createProduct, getAllProducts, updateProduct } from '../services/products';

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
		data: Partial<ProductProps> & { photo: File },
		onDone?: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useSaveProduct = (): UseSaveProductType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleSave(
		{ $id, ...data }: Partial<ProductProps> & { photo: File },
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

export const useChangeProductOrder = () => {

}

export const useDeleteProduct = () => {

}
