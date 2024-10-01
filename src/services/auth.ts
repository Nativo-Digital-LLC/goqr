import { ID } from 'appwrite';

import { account } from '../utils/appwrite';
import { useSessionStore } from '../store/session';

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

export async function logout() {
	const session = useSessionStore.getState().session;
	if (session) {
		await account.deleteSession(session.$id);
	}
}

export async function sendVerificationEmail() {
	await account.createVerification(
		(import.meta.env.DEV)
			? 'http://localhost:5173/verify'
			: 'https://goqr.com.do/verify'
	);
}
