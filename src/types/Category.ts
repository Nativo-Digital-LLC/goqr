import { SubcategoryProps } from './Subcategory';

export interface CategoryProps {
	$id: string;
	es_name: string;
	en_name: string;
	order: number;
	enableSubcategories: boolean;
	subcategories: SubcategoryProps[];
	$createdAt: string;
	$updatedAt: string;
	deletedAt: string | null;
}
