import { ID, OAuthProvider } from 'appwrite';

import { account } from '../utils/appwrite';
import { useSessionStore } from '../store/session';
import { SessionProps } from '../types/Session';

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

export async function authWithGoogle(path: 'login' | 'register') {
	const host = (import.meta.env.DEV)
		? 'http://localhost:5173'
		: 'https://goqr.com.do';

	await account.createOAuth2Session(
		OAuthProvider.Google,
		`${host}/${path}?status=success`,
		`${host}/${path}?status=failed`
	);
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

export async function getCurrentSession() {
	const { total, sessions } = await account.listSessions();
	if (total === 0) {
		return null;
	}

	const session = sessions.find(({ current }) => current);
	const user = await account.get();
	return {
		...session,
		user
	} as SessionProps;
}
