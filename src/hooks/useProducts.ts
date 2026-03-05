import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';

import { ProductProps } from '../types/Product';
import {
	changeProductOrder,
	createProduct,
	deleteProduct,
	getAllProducts,
	updateProduct
} from '../services/products';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';

type UseListenProductsType = [
	ProductProps[],
	boolean,
	FirebaseError | null
];

export const useListenProducts = (establishmentId?: string, categoryId?: string, subcategoryId?: string | null): UseListenProductsType => {
	const [products, setProducts] = useState<ProductProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	useEffect(() => {
		if (!establishmentId || !categoryId) {
			return;
		}

		let q = query(
			collection(
				db,
				'products'
			),
			where('establishmentId', '==', establishmentId),
			where('categoryId', '==', categoryId),
			where('deletedAt', '==', null)
		);

		if (subcategoryId) {
			q = query(q, where('subcategoryId', '==', subcategoryId));
		}

		q = query(q, orderBy('order', 'asc'));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const data = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id
				} as ProductProps));
				setProducts(data);
				setLoading(false);
			},
			setError
		);

		return () => unsubscribe();
	}, [establishmentId, categoryId, subcategoryId]);

	return [products, loading, error];
}

type UseGetAllProductsType = [
	ProductProps[],
	boolean,
	FirebaseError | null,
	(establishmentId: string) => void
];

export const useGetAllProducts = (establishmentId?: string): UseGetAllProductsType => {
	const [products, setProducts] = useState<ProductProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

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
			setError(error as FirebaseError);
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
	FirebaseError | null
];

export const useSaveProduct = (): UseSaveProductType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleSave(
		{ id, ...data }: Partial<ProductProps> & { photo?: File | null },
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			if (id) {
				await updateProduct(id, data);
			} else {
				await createProduct(data);
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

type UseChangeProductOrderType = [
	(
		id: string,
		dir: 'up' | 'down',
		neighborId: string,
		onDone?: () => void
	) => void,
	boolean,
	FirebaseError | null
];

export const useChangeProductOrder = (): UseChangeProductOrderType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleUpdate(
		id: string,
		dir: 'up' | 'down',
		neighborId: string,
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await changeProductOrder(
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

	return [handleUpdate, loading, error];
}

type UseDeleteProductType = [
	(id: string, onDone?: () => void) => void,
	boolean,
	FirebaseError | null
];

export const useDeleteProduct = (): UseDeleteProductType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleDelete(id: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await deleteProduct(id);
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleDelete, loading, error];
}
