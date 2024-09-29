import { ID } from 'appwrite';

import { account } from '../utils/appwrite';

export async function createAccount(name: string, email: string, password: string) {
	await account.create(
		ID.unique(),
		email,
		password,
		name
	);
}

export async function login(email: string, password: string) {
	const session = await account.createEmailPasswordSession(
		email,
		password
	);

	return session;
}

export async function sendVerificationEmail() {
	await account.createVerification(
		(import.meta.env.DEV)
			? 'http://localhost:5173/verify'
			: 'https://gustico.nd.com.do/verify'
	);
}
