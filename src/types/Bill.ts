export enum PaymentMethod {
	CreditCard = 'Credit_Card',
	BankTransfer = 'Bank_Transfer'
}

export enum PaymentFrequency {
	Monthly = 'Monthly',
	Annual = 'Annual',
	Never = 'Never' // Cuando el cliente contrató un plan de por vida
}

export interface BillProps {
	id: string;
	userId: string;
	orderNumber: string;
	createdAt: string;
	updatedAt: string;
	payedAt: string;
	isPayed: boolean;
	amount: number;
	period: string;
	paymentUrl: string;
	billingPeriod: string;
}
