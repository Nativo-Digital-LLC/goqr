import { Timestamp } from 'firebase/firestore';
import { PaymentFrequency, PaymentMethod } from './Bill';

export interface ScheduleProps {
	days: string;
	hours: string;
}

export interface SocialNetworkProps {
	platform: string;
	link: string;
	displayName?: string;
}

export interface EstablishmentProps {
	id: string;
	userId: string;
	name: string;
	description: string;
	logoUrl: string | null;
	bannerUrl: string | null;
	address: string;
	domain: string;
	addressLink: string | null;
	googlePlaceId: string | null;
	phone: string | null;
	whatsapp: string | null;
	mainHexColor: string;
	requiresTaxReceipt: boolean;
	rnc: string | null;
	companyName: string | null;
	paymentMethod: PaymentMethod;
	paymentFrequency: PaymentFrequency;
	showFoodAllergyAndRiskDisclaimer: boolean;
	enableMultiLanguage: boolean;
	isActive: boolean;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	deletedAt: Timestamp | null;
	schedules?: ScheduleProps[];
	socialNetworks?: SocialNetworkProps[];
}

export interface CreateEstablishmentParams {
	userId: string;
	mainHexColor: string;
	name: string;
	domain: string;
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
	paymentFrequency: PaymentFrequency;
	paymentMethod: PaymentMethod;
	schedules?: ScheduleProps[];
	socialNetworks?: SocialNetworkProps[];
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
