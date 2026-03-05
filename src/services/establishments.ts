import {
	collection,
	doc,
	setDoc,
	getDocs,
	updateDoc,
	query,
	where,
	addDoc
} from 'firebase/firestore';

import { db } from '../utils/firebase';
import { Collection } from '../constants/Collections';
import {
	CreateEstablishmentParams,
	EstablishmentProps,
	TaxPayerProps,
} from '../types/Establishment';
import { sendConversionEvent, uploadFile } from '../utils/helpers';

export async function createEstablishment(params: CreateEstablishmentParams) {
	const categoriesIds = [crypto.randomUUID(), crypto.randomUUID()];
	const subcategoriesIds = [crypto.randomUUID(), crypto.randomUUID()];

	const bannerUrl = (params.banner)
		? await uploadFile(params.banner)
		: null;

	const logoUrl = (params.logo)
		? await uploadFile(params.logo)
		: null;

	const { id: estabId } = await addDoc(collection(db, Collection.Establishments), {
		logoUrl,
		bannerUrl,
		userId: params.userId,
		name: params.name,
		description: params.description,
		address: params.address,
		domain: params.domain,
		addressLink: params.addressLink || null,
		phone: params.phone || null,
		whatsapp: params.whatsapp || null,
		mainHexColor: params.mainHexColor,
		rnc: params.rnc || null,
		companyName: params.companyName || null,
		requiresTaxReceipt: params.requiresTaxReceipt,
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	await Promise.all([
		setDoc(doc(db, Collection.Establishments, estabId, 'categories', categoriesIds[0]), {
			id: categoriesIds[0],
			es_name: 'Bebidas',
			order: 1,
			enableSubcategories: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}),
		setDoc(doc(db, Collection.Establishments, estabId, 'categories', categoriesIds[1]), {
			id: categoriesIds[1],
			es_name: 'Desayunos',
			order: 2,
			enableSubcategories: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		}),
		setDoc(doc(db, Collection.Establishments, estabId, 'categories', categoriesIds[0], 'subcategories', subcategoriesIds[0]), {
			id: subcategoriesIds[0],
			es_name: 'Bebidas Calientes',
			order: 1,
			photoUrl: 'https://appwrite.nd.com.do/v1/storage/buckets/66f768f700019e95e2c8/files/6711133900038fe1c875/view?project=66f768e4001537551adf',
			createdAt: new Date(),
			updatedAt: new Date(),
		}),
		setDoc(doc(db, Collection.Establishments, estabId, 'categories', categoriesIds[0], 'subcategories', subcategoriesIds[1]), {
			id: subcategoriesIds[1],
			es_name: 'Bebidas Frías',
			order: 2,
			photoUrl: 'https://appwrite.nd.com.do/v1/storage/buckets/66f768f700019e95e2c8/files/67111318000a6a9abd47/view?project=66f768e4001537551adf',
			createdAt: new Date(),
			updatedAt: new Date(),
		})
	]);

	sendConversionEvent(params.paymentFrequency);
}

export async function updateEstablishment(id: string, { banner, logo, ...rest }: Partial<CreateEstablishmentParams>) {
	const bannerUrl = (banner)
		? await uploadFile(banner)
		: null;

	const logoUrl = (logo)
		? await uploadFile(logo)
		: null;

	const updates: any = {
		...rest,
		updatedAt: new Date()
	};

	if (bannerUrl !== null) updates.bannerUrl = bannerUrl;
	if (logoUrl !== null) updates.logoUrl = logoUrl;

	await updateDoc(doc(db, Collection.Establishments, id), updates);
}

export async function getEstablishmentsByUserId(userId: string) {
	const q = query(
		collection(db, Collection.Establishments),
		where('userId', '==', userId)
	);

	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data() as EstablishmentProps);
}

export async function getTaxInformation(rnc: string) {
	const res = await fetch(`https://api.betapos.com.do/taxpayers/by-rnc/${rnc}`);
	const data = await res.json();
	if (!res.ok) {
		throw new Error(JSON.stringify(data));
	}

	return data as TaxPayerProps | null;
}
