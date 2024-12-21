export interface ProductProps {
	$id: string;
	es_name: string;
	en_name: string;
	es_description: string;
	en_description: string;
	prices: {
		label?: string;
		price: number;
	}[];
	order: number;
	establishmentId: string;
	categoryId: string;
	subcategoryId: string | null;
	photoUrl: string | null;
	status: ProductStatus;
	$createdAt: string;
	$updatedAt: string;
	deletedAt: string | null;
}

export enum ProductStatus {
	Visible = 'VISIBLE',
	Hidden = 'HIDDEN',
	NotAvailable = 'NOT_AVAILABLE'
}
