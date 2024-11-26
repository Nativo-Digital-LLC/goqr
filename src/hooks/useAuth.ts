import { useEffect, useState } from 'react';
import { AppwriteException } from 'appwrite';

import {
	authWithApple,
	authWithGoogle,
	createAccount,
	getCurrentSession,
	login,
	logout,
	// sendVerificationEmail
} from '../services/auth';
import { account } from '../utils/appwrite';
import { useSessionStore } from '../store/session';

type UseRegisterType = [
	(
		name: string,
		email: string,
		password: string,
		onDone?: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useRegister = (): UseRegisterType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);
	const setSession = useSessionStore(({ setSession }) => setSession);

	async function handleRegister(name: string, email: string, password: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await createAccount(
				name,
				email,
				password
			);
			const session = await login(
				email,
				password
			);
			const user = await account.get();
			setSession({
				...session,
				user
			});
			/**
			 * await sendVerificationEmail();
			 * Falla al enviar correo de confirmacion,
			 * {"message":"The current user session could not be found.","code":404,"type":"user_session_not_found","version":"1.5.11"}
			 */
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException)
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
	AppwriteException | null
];

export const useLogin = (): UseLoginType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);
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
				const session = await login(
					params!.email!,
					params!.password!
				);
				const user = await account.get();

				setSession({
					...session,
					user
				});
			}

			if (type === 'Google') {
				await authWithGoogle(params!.page);
			}

			if (type === 'Apple') {
				await authWithApple(params!.page);
			}

			onDone?.();
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleLogin, loading, type, error];
}

type UseHandleOAuth2SessionType = [
	boolean,
	AppwriteException | string | null
];

export const useHandleOAuth2Session = (status?: 'success' | 'failed'): UseHandleOAuth2SessionType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | string | null>(null);
	const setSession = useSessionStore(({ setSession }) => setSession);

	useEffect(() => {
		if (status) {
			handleChange(status);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	async function handleChange(status: 'success' | 'failed') {
		try {
			if (status === 'failed') {
				return setError('No se pudo iniciar sesion, por favor intentalo mas tarde');
			}

			setLoading(true);
			const session = await getCurrentSession();
			if (!session) {
				return;
			}

			setSession(session);
			location.href = '/dashboard';
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [loading, error];
}

type UseLogoutType = [
	(onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useLogout = (): UseLogoutType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);
	const setSession = useSessionStore(({ setSession }) => setSession);

	async function handleLogout(onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await logout();
			setSession(null);
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException)
		} finally {
			setLoading(false);
		}
	}

	return [handleLogout, loading, error];
}
