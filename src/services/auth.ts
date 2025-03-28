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

export async function authWithApple(path: 'login' | 'register') {
	const host = (import.meta.env.DEV)
		? 'http://localhost:5173'
		: 'https://goqr.com.do';

	await account.createOAuth2Session(
		OAuthProvider.Apple,
		`${host}/${path}?status=success`,
		`${host}/${path}?status=failed`
	);
}

export async function logout() {
	const session = useSessionStore.getState().session;
	if (!session) {
		return;
	}

	const { total, sessions } = await account.listSessions();
	if (total === 0 || !sessions.find(({ $id }) => $id === session.$id)) {
		return;
	}

	await account.deleteSession(session.$id);
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

export async function sendResetPasswordEmail(email: string) {
	const url = (import.meta.env.DEV)
		? 'http://localhost:5173/change-password-after-request'
		: 'https://goqr.com.do/change-password-after-request';

	await account.createRecovery(email, url);
}

export async function resetPasswordWithSecret(
	userId: string,
	secret: string,
	password: string
) {
	await account.updateRecovery(
		userId,
		secret,
		password
	);
}
