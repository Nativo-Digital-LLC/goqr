import { useState } from 'react';
import { AppwriteException } from 'appwrite';

import {
	createAccount,
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

type UseLoginType = [
	(
		email: string,
		password: string,
		onDone?: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useLogin = (): UseLoginType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);
	const setSession = useSessionStore(({ setSession }) => setSession);

	async function handleLogin(email: string, password: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			const session = await login(
				email,
				password
			);
			const user = await account.get();
			setSession({
				...session,
				user
			});
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException)
		} finally {
			setLoading(false);
		}
	}

	return [handleLogin, loading, error];
}

type UseLogoutType = [
	(onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useLogout = (): UseLogoutType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleLogout(onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await logout();
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException)
		} finally {
			setLoading(false);
		}
	}

	return [handleLogout, loading, error];
}
