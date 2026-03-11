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
	const categoriesIds = [
		crypto.randomUUID(),
		crypto.randomUUID()
	];
	const subcategoriesIds = [
		crypto.randomUUID(),
		crypto.randomUUID()
	];

	const bannerUrl = (params.banner)
		? await uploadFile(params.banner)
		: null;

	const logoUrl = (params.logo)
		? await uploadFile(params.logo)
		: null;

	const photoUrl = 'https://firebasestorage.googleapis.com/v0/b/goqr-914b1.firebasestorage.app/o/141d431b-a9bf-41f9-a0ff-6bff1569cdf2.png?alt=media&token=e4962afc-128e-41ce-8d36-1f6ddf0ec3ae';

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
		schedules: params.schedules || [],
		socialNetworks: params.socialNetworks || [],
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	await Promise.all([
		setDoc(doc(db, Collection.Establishments, estabId, 'categories', categoriesIds[0]), {
			id: categoriesIds[0],
			es_name: 'Bebidas',
			en_name: 'Drinks',
			order: 1,
			enableSubcategories: true,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		}),
		setDoc(doc(db, Collection.Establishments, estabId, 'categories', categoriesIds[1]), {
			id: categoriesIds[1],
			es_name: 'Postres',
			en_name: 'Desserts',
			order: 2,
			enableSubcategories: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		}),
		setDoc(doc(db, Collection.Establishments, estabId, 'categories', categoriesIds[0], 'subcategories', subcategoriesIds[0]), {
			id: subcategoriesIds[0],
			es_name: 'Bebidas Calientes',
			en_name: 'Hot Drinks',
			order: 1,
			photoUrl,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		}),
		setDoc(doc(db, Collection.Establishments, estabId, 'categories', categoriesIds[0], 'subcategories', subcategoriesIds[1]), {
			id: subcategoriesIds[1],
			es_name: 'Bebidas Frías',
			en_name: 'Cold Drinks',
			order: 2,
			photoUrl,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		}),
		// Products for subcategories
		addDoc(collection(db, Collection.Products), {
			establishmentId: estabId,
			categoryId: categoriesIds[0],
			subcategoryId: subcategoriesIds[0],
			es_name: 'Café Americano',
			en_name: 'Americano Coffee',
			es_description: 'Café negro recién colado.',
			en_description: 'Freshly brewed black coffee.',
			prices: [{ label: 'Regular', price: 95 }],
			order: 1,
			status: 'VISIBLE',
			bestSeller: false,
			photoUrl,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		}),
		addDoc(collection(db, Collection.Products), {
			establishmentId: estabId,
			categoryId: categoriesIds[0],
			subcategoryId: subcategoriesIds[1],
			es_name: 'Limonada Natural',
			en_name: 'Fresh Lemonade',
			es_description: 'Limonada fresca con menta.',
			en_description: 'Fresh lemonade with mint.',
			prices: [{ label: 'Grande', price: 150 }],
			order: 1,
			status: 'VISIBLE',
			bestSeller: true,
			photoUrl,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
		}),
		// Product for category without subcategories
		addDoc(collection(db, Collection.Products), {
			establishmentId: estabId,
			categoryId: categoriesIds[1],
			subcategoryId: null,
			es_name: 'Brownie con Helado',
			en_name: 'Brownie with Ice Cream',
			es_description: 'Brownie de chocolate caliente con helado de vainilla.',
			en_description: 'Warm chocolate brownie with vanilla ice cream.',
			prices: [{ price: 250 }],
			order: 1,
			status: 'VISIBLE',
			bestSeller: true,
			photoUrl,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null
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
