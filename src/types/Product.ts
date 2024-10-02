export interface ProductProps {
	$id: string;
	name: string;
	description: string;
	prices: {
		label?: string;
		price: number;
	};
	order: number;
	$createdAt: string;
	$updatedAt: string;
	deletedAt: string | null;
}
