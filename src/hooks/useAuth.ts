import { useEffect, useState } from 'react';
import { AppwriteException, Models } from 'appwrite';

import { createAccount, login, sendVerificationEmail } from '../services/auth';
import { account } from '../utils/appwrite';

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

	async function handleRegister(name: string, email: string, password: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await createAccount(
				name,
				email,
				password
			);
			await login(
				email,
				password
			);
			await sendVerificationEmail();
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

	async function handleLogin(email: string, password: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await login(
				email,
				password
			);
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException)
		} finally {
			setLoading(false);
		}
	}

	return [handleLogin, loading, error];
}

type UseGetSessionType = [
	Models.User<Models.Preferences> | null,
	boolean,
	AppwriteException | null
];

export const useGetSession = (): UseGetSessionType => {
	const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	useEffect(() => {
		load();
	}, []);

	async function load() {
		try {
			// const { total, sessions } = await account.listSessions();
			// if (total === 0) {
			// 	return;
			// }

			// const session = sessions.find(({ current }) => current);
			// if (!session) {
			// 	return;
			// }
			setLoading(true);
			setError(null);
			const data = await account.get();
			setUser(data);
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [user, loading, error];
}
