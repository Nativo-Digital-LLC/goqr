import { useEffect, useState } from 'react';
import { AppwriteException } from 'appwrite';
import dayjs from 'dayjs';
import * as Sentry from '@sentry/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
	authWithApple,
	authWithGoogle,
	createAccount,
	getCurrentSession,
	login,
	logout,
	resetPasswordWithSecret,
	sendResetPasswordEmail,
	sendVerificationEmail
} from '../services/auth';
import { account } from '../utils/appwrite';
import { useSessionStore } from '../store/session';
import { EmailVerificationStatus } from '../types/Auth';

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

type UseSendVerificationEmailType = [
	(
		onDone: () => void,
		alreadyVerified: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useSendVerificationEmail = (): UseSendVerificationEmailType => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleRequest(
		onDone: () => void,
		alreadyVerified: () => void
	) {
		try {
			const session = useSessionStore.getState().session;
			if (!session) {
				const { isConfirmed } = await Swal.fire({
					title: 'No Autenticado',
					text: 'No tienes ninguna sesión iniciada, se requiere iniciar sesión para verificar tu email.',
					icon: 'warning',
					confirmButtonText: 'Iniciar Sesión',
					showCancelButton: true,
					cancelButtonText: 'Cerrar',
					reverseButtons: true
				});

				if (isConfirmed) {
					navigate('/login');
				}

				return;
			}

			setLoading(true);
			setError(null);
			await sendVerificationEmail();
			onDone?.();
		} catch (error) {
			if ((error as AppwriteException).type === 'user_email_already_verified') {
				return alreadyVerified();
			}

			setError(error as AppwriteException);
			Sentry.captureException(error);
		} finally {
			setLoading(false);
		}
	}

	return [handleRequest, loading, error];
}

type UseVerifyEmailType = [
	EmailVerificationStatus | null,
	boolean,
	AppwriteException | null,
	(status: EmailVerificationStatus) => void
];

export const useVerifyEmail = (): UseVerifyEmailType => {
	const location = useLocation();
	const [status, setStatus] = useState<EmailVerificationStatus | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<AppwriteException | null>(null);

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function load() {
		try {
			const session = useSessionStore.getState().session;
			if (!session) {
				return setStatus('login-required');
			}

			const params = new URLSearchParams(location.search);
			const secret = params.get("secret");
			const userId = params.get("userId");
			const expireAt = params.get("expire");

			if (!secret || !userId) {
				return setStatus('error');
			}

			if (dayjs().isAfter(dayjs(expireAt))) {
				return setStatus('expired');
			}

			await account.updateVerification(userId, secret);
			setStatus('verified');
		} catch (error) {
			if ((error as AppwriteException).type === 'user_email_already_verified') {
				return setStatus('verified');
			}

			setError(error as AppwriteException);
			setStatus('error');
			Sentry.captureException(error);
		} finally {
			setLoading(false);
		}
	}

	return [status, loading, error, (status) => setStatus(status)];
}

type UseRequestResetPasswordEmailType = [
	(email: string, onDone?: () => void) => void,
	boolean,
	AppwriteException | null
];

export const useRequestResetPasswordEmail = (): UseRequestResetPasswordEmailType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleRequest(email: string, onDone?: () => void) {
		try {
			setLoading(true);
			setError(null);
			await sendResetPasswordEmail(email);
			onDone?.();
		} catch (error) {
			const { code } = error as AppwriteException;

			// Por seguridad, evita indicar al usuario cuando un correo no está registrado
			if (code === 404) {
				return onDone?.();
			}

			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleRequest, loading, error];
}

type UseResetPasswordWithSecretType = [
	(
		userId: string,
		secret: string,
		password: string,
		onDone?: () => void
	) => void,
	boolean,
	AppwriteException | null
];

export const useResetPasswordWithSecret = (): UseResetPasswordWithSecretType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AppwriteException | null>(null);

	async function handleReset(
		userId: string,
		secret: string,
		password: string,
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await resetPasswordWithSecret(
				userId,
				secret,
				password
			);
			onDone?.();
		} catch (error) {
			setError(error as AppwriteException);
		} finally {
			setLoading(false);
		}
	}

	return [handleReset, loading, error];
}
