import { Timestamp } from "firebase/firestore";

export interface SubcategoryProps {
	id: string;
	es_name: string;
	en_name: string;
	photoUrl: string | null;
	order: number;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	deletedAt: Timestamp | null;
}
