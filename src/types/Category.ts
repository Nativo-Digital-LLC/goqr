import { Timestamp } from "firebase/firestore";

export interface CategoryProps {
	id: string;
	es_name: string;
	en_name: string;
	order: number;
	enableSubcategories: boolean;
	hidden?: boolean;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	deletedAt: Timestamp | null;
}
