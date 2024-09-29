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

