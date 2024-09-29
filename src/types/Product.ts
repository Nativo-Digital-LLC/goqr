export interface ProductProps {
	$id: string;
	name: string;
	description: string;
	price: number;
	$createdAt: string;
	$updatedAt: string;
	deletedAt: string | null;
}
