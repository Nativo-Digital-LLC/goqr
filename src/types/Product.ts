export interface ProductProps {
	$id: string;
	name: string;
	description: string;
	prices: {
		label?: string;
		price: number;
	}[];
	order: number;
	establishmentId: string;
	categoryId: string;
	subcategoryId: string | null;
	photoUrl: string;
	$createdAt: string;
	$updatedAt: string;
	deletedAt: string | null;
}
