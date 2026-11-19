import { Timestamp } from 'firebase/firestore';
import { PlanId } from '../constants/plans';

export interface TransferProps {
	id: string;
	establishmentId: string;
	userId: string;
	plan: PlanId;
	amount: number;
	currency: 'DOP' | 'USD';
	proofPath: string;
	declaredDate: Timestamp;
	reference: string;
	status: 'pending' | 'approved' | 'rejected';
	reason?: string;
	reviewedBy?: string;
	createdAt: Timestamp;
}
