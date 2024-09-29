import { PaymentFrequency, PaymentMethod } from './Bill';
import { CategoryProps } from './Category';

export interface EstablishmentProps {
	$id: string;
	userId: string;
	name: string;
	description: string;
	logoUrl: string | null;
	bannerUrl: string | null;
	address: string;
	domain: string;
	addressLink: string | null;
	phone: string | null;
	whatsapp: string | null;
	mainHexColor: string;
	categories: CategoryProps[];
	requiresTaxReceipt: boolean;
	rnc: string | null;
	companyName: string | null;
	paymentMethod: PaymentMethod;
	paymentFrequency: PaymentFrequency;
	$createdAt: string;
	$updatedAt: string;
	deletedAt: string;
}

export interface CreateEstablishmentParams {
	userId: string;
	color: string;
	name: string;
	url: string;
	description: string;
	address: string;
	addressLink?: string;
	phone: string;
	whatsapp?: string;
	requiresTaxReceipt?: boolean;
	rnc?: string;
	companyName?: string;
	logo?: File;
	banner?: File;
}

export interface TaxPayerProps {
	rnc: string;
	name: string;
	statusId: string;
	createdAt: string;
	updatedAt: string;
	status: {
		id: string;
		name: TaxPayerStatusName;
		createdAt: string;
		updatedAt: string;
	}
}

export type TaxPayerStatusName =
	| 'ACTIVO'
	| 'DADO DE BAJA'
	| 'SUSPENDIDO'
	| 'ANULADO'
	| 'CESE TEMPORAL'
	| 'RECHAZADO'
	| 'NORMAL'
	| string;
