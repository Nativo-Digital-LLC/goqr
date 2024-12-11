import { ID, Query } from 'appwrite';

import { db } from '../utils/appwrite';
import { Collection } from '../constants/Collections';
import {
	CreateEstablishmentParams,
	EstablishmentProps,
	TaxPayerProps
} from '../types/Establishment';
import { sendConversionEvent, uploadFile } from '../utils/helpers';

export async function createEstablishment(params: CreateEstablishmentParams) {
	const subcategoriesIds = [
		ID.unique(),
		ID.unique()
	];

	await Promise.all([
		db.createDocument(
			import.meta.env.VITE_APP_WRITE_DB_ID,
			Collection.Subcategories,
			subcategoriesIds[0],
			{
				es_name: 'Bebidas Calientes',
				order: 1,
				photoUrl: 'https://appwrite.nd.com.do/v1/storage/buckets/66f768f700019e95e2c8/files/6711133900038fe1c875/view?project=66f768e4001537551adf'
			}
		),
		db.createDocument(
			import.meta.env.VITE_APP_WRITE_DB_ID,
			Collection.Subcategories,
			subcategoriesIds[1],
			{
				es_name: 'Bebidas Frías',
				order: 2,
				photoUrl: 'https://appwrite.nd.com.do/v1/storage/buckets/66f768f700019e95e2c8/files/67111318000a6a9abd47/view?project=66f768e4001537551adf'
			}
		)
	]);

	const categories = await Promise.all([
		db.createDocument(
			import.meta.env.VITE_APP_WRITE_DB_ID,
			Collection.Categories,
			ID.unique(),
			{
				es_name: 'Bebidas',
				order: 1,
				subcategories: subcategoriesIds,
				enableSubcategories: true
			}
		),
		db.createDocument(
			import.meta.env.VITE_APP_WRITE_DB_ID,
			Collection.Categories,
			ID.unique(),
			{
				es_name: 'Desayunos',
				order: 2,
				enableSubcategories: false
			}
		)
	]);

	const bannerUrl = (params.banner)
		? await uploadFile(params.banner)
		: undefined;

	const logoUrl = (params.logo)
		? await uploadFile(params.logo)
		: undefined;

	await db.createDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Establishments,
		ID.unique(),
		{
			logoUrl,
			bannerUrl,
			userId: params.userId,
			name: params.name,
			description: params.description,
			address: params.address,
			domain: params.domain,
			addressLink: params.addressLink,
			phone: params.phone,
			whatsapp: params.whatsapp,
			mainHexColor: params.color,
			rnc: params.rnc,
			companyName: params.companyName,
			requiresTaxReceipt: params.requiresTaxReceipt,
			categories: categories.map(({ $id }) => $id)
		}
	);

	sendConversionEvent(params.paymentFrequency);
}

export async function updateEstablishment(id: string, { banner, logo, ...rest }: Partial<CreateEstablishmentParams>) {
	const bannerUrl = (banner)
		? await uploadFile(banner)
		: undefined;

	const logoUrl = (logo)
		? await uploadFile(logo)
		: undefined;

	await db.updateDocument(
		import.meta.env.VITE_APP_WRITE_DB_ID,
		Collection.Establishments,
		id,
		{
			logoUrl,
			bannerUrl,
			...rest
		}
	);
}

export async function getEstablishmentByDomain(domain: string) {
	const { total, documents } = await db
		.listDocuments(
			import.meta.env.VITE_APP_WRITE_DB_ID,
			Collection.Establishments,
			[
				Query.equal('domain', domain)
			]
		);

	if (total === 0) {
		return null;
	}

	const { categories, ...rest } = documents[0] as unknown as EstablishmentProps;

	return {
		categories: categories.sort((a, b) => a.order - b.order),
		...rest
	}
}

export async function getEstablishmentsByUserId(userId: string) {
	const { documents } = await db
		.listDocuments(
			import.meta.env.VITE_APP_WRITE_DB_ID,
			Collection.Establishments,
			[
				Query.equal('userId', userId)
			]
		);

	return documents as unknown as EstablishmentProps[];
}

export async function getTaxInformation(rnc: string) {
	const res = await fetch(`https://api.betapos.com.do/taxpayers/by-rnc/${rnc}`);
	const data = await res.json();
	if (!res.ok) {
		throw new Error(JSON.stringify(data));
	}

	return data as TaxPayerProps | null;
}
