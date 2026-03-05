import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";

import { BillProps } from "../types/Bill";
import { getBillsByUserId } from "../services/bills";

type UseGetBillsByUserIdType = [
	BillProps[],
	boolean,
	FirebaseError | null,
	(userId: string) => void
];

export const useGetBillsByUserId = (
	userId?: string
): UseGetBillsByUserIdType => {
	const [bills, setBills] = useState<BillProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<FirebaseError | null>(null);

	useEffect(() => {
		if (!userId) return;

		load(userId);
	}, [userId]);

	async function load(userId: string) {
		try {
			setError(null);
			const data = await getBillsByUserId(userId);
			setBills(data);
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [bills, loading, error, load];
};