import { useState } from 'react';
import { FirebaseError } from 'firebase/app';

import {
	authWithApple,
	authWithGoogle,
	createAccount,
	login,
	logout,
	mapUserToSession,
	resetPasswordWithSecret,
	sendResetPasswordEmail
} from '../services/auth';
import { auth } from '../utils/firebase';
import { useSessionStore } from '../store/session';

type UseRegisterType = [
	(
		name: string,
		email: string,
		password: string,
		onDone?: () => void
	) => void,
	boolean,
	FirebaseError | null
];

export const useRegister = (): UseRegisterType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);
	const setSession = useSessionStore(({ setSession }) => setSession);

	async function handleRegister(name: string, email: string, password: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			const firebaseUser = await createAccount(
				name,
				email,
				password
			);
			setSession({
				userId: firebaseUser.uid,
				user: {
					uid: firebaseUser.uid,
					displayName: firebaseUser.displayName,
					email: firebaseUser.email,
					emailVerified: firebaseUser.emailVerified,
					photoURL: firebaseUser.photoURL
				}
			});
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError)
		} finally {
			setLoading(false);
		}
	}

	return [handleRegister, loading, error];
}

type LoginType = 'Google' | 'Apple' | 'EmailAndPassword';
interface LoginParamsProps {
	email?: string;
	password?: string;
	page: 'login' | 'register';
}

type UseLoginType = [
	(
		type: LoginType,
		params?: LoginParamsProps,
		onDone?: () => void
	) => void,
	boolean,
	LoginType | null,
	FirebaseError | null
];

export const useLogin = (): UseLoginType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);
	const [type, setType] = useState<LoginType | null>(null);
	const setSession = useSessionStore(({ setSession }) => setSession);

	async function handleLogin(
		type: LoginType,
		params?: LoginParamsProps,
		onDone?: () => void
	) {
		try {
			setType(type);
			setLoading(true);
			setError(null);

			if (type === 'EmailAndPassword') {
				const user = await login(
					params!.email!,
					params!.password!
				);

				setSession({
					userId: user.uid,
					user: {
						uid: user.uid,
						displayName: user.displayName,
						email: user.email,
						emailVerified: user.emailVerified,
						photoURL: user.photoURL
					}
				});
			}

			if (type === 'Google') {
				await authWithGoogle();
				// authWithGoogle no escribe la sesión; el store solo se inicializa una vez.
				const user = auth.currentUser;
				if (user) {
					setSession({
						userId: user.uid,
						user: {
							uid: user.uid,
							displayName: user.displayName,
							email: user.email,
							emailVerified: user.emailVerified,
							photoURL: user.photoURL
						}
					});
				}
			}

			if (type === 'Apple') {
				await authWithApple();
			}

			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleLogin, loading, type, error];
}

type UseLogoutType = [
	(onDone?: () => void) => void,
	boolean,
	FirebaseError | null
];

export const useLogout = (): UseLogoutType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);
	const setSession = useSessionStore(({ setSession }) => setSession);

	async function handleLogout(onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await logout();
			setSession(null);
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError)
		} finally {
			setLoading(false);
		}
	}

	return [handleLogout, loading, error];
}

type UseRequestResetPasswordEmailType = [
	(email: string, onDone?: () => void) => void,
	boolean,
	FirebaseError | null
];

export const useRequestResetPasswordEmail = (): UseRequestResetPasswordEmailType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleRequest(email: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await sendResetPasswordEmail(email);
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleRequest, loading, error];
}

type UseResetPasswordWithSecretType = [
	(
		secret: string,
		email: string,
		password: string,
		onDone?: (signedIn: boolean) => void
	) => void,
	boolean,
	FirebaseError | null
];

export const useResetPasswordWithSecret = (): UseResetPasswordWithSecretType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);
	const setSession = useSessionStore(({ setSession }) => setSession);

	async function handleReset(
		secret: string,
		email: string,
		password: string,
		onDone?: (signedIn: boolean) => void
	) {
		try {
			setLoading(true);
			setError(null);
			const user = await resetPasswordWithSecret(secret, email, password);
			if (user) setSession(mapUserToSession(user));
			onDone?.(!!user);
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleReset, loading, error];
}
