import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import * as Sentry from '@sentry/react';
import { useNavigate } from 'react-router-dom';
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
			await createAccount(
				name,
				email,
				password
			);
			const firebaseUser = await login(
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
			await sendVerificationEmail();
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

type UseHandleOAuth2SessionType = [
	boolean,
	FirebaseError | string | null
];

export const useHandleOAuth2Session = (status?: 'success' | 'failed'): UseHandleOAuth2SessionType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | string | null>(null);
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
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [loading, error];
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

type UseSendVerificationEmailType = [
	(
		onDone: () => void
	) => void,
	boolean,
	FirebaseError | null
];

export const useSendVerificationEmail = (): UseSendVerificationEmailType => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleRequest(
		onDone: () => void
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
			setError(error as FirebaseError);
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
	FirebaseError | null,
	(status: EmailVerificationStatus) => void
];

export const useVerifyEmail = (): UseVerifyEmailType => {

	const [status, setStatus] = useState<EmailVerificationStatus | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<FirebaseError | null>(null);

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function load() {
		try {
			// Con Firebase el enlace de verificación se maneja con action codes
			// directamente en el frontend; aquí sólo validamos que el usuario exista.
			const session = useSessionStore.getState().session;
			if (!session) {
				return setStatus('login-required');
			}

			setStatus('verified');
		} catch (error) {
			setError(error as FirebaseError);
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
		password: string,
		onDone?: () => void
	) => void,
	boolean,
	FirebaseError | null
];

export const useResetPasswordWithSecret = (): UseResetPasswordWithSecretType => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<FirebaseError | null>(null);

	async function handleReset(
		secret: string,
		password: string,
		onDone?: () => void
	) {
		try {
			setLoading(true);
			setError(null);
			await resetPasswordWithSecret(
				secret,
				password
			);
			onDone?.();
		} catch (error) {
			setError(error as FirebaseError);
		} finally {
			setLoading(false);
		}
	}

	return [handleReset, loading, error];
}
