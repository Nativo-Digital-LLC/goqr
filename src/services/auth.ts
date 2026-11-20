import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	updateProfile,
	User
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { confirmPasswordReset } from 'firebase/auth';

import { auth, googleProvider, appleProvider, functions } from '../utils/firebase';
import { SessionProps } from '../types/Session';

export async function createAccount(name: string, email: string, password: string) {
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	if (name) {
		await updateProfile(user, { displayName: name });
	}
	// El correo de verificación lo envía el trigger onUserCreated.
	return user;
}

export async function login(email: string, password: string) {
	const { user } = await signInWithEmailAndPassword(auth, email, password);
	return user;
}

export async function authWithGoogle() {
	await signInWithPopup(auth, googleProvider);
}

export async function authWithApple() {
	await signInWithPopup(auth, appleProvider);
}

export async function logout() {
	await signOut(auth);
}

export async function sendVerificationEmail() {
	if (!auth.currentUser) {
		return;
	}

	await httpsCallable(functions, 'sendVerificationEmail')();
}

export function mapUserToSession(user: User): SessionProps {
	return {
		userId: user.uid,
		user: {
			uid: user.uid,
			displayName: user.displayName,
			email: user.email,
			emailVerified: user.emailVerified,
			photoURL: user.photoURL
		}
	};
}

export async function getCurrentSession(): Promise<SessionProps | null> {
	return new Promise((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			unsubscribe();
			if (!user) {
				resolve(null);
				return;
			}

			resolve(mapUserToSession(user));
		});
	});
}

export async function sendResetPasswordEmail(email: string) {
	await httpsCallable(functions, 'sendPasswordReset')({ email });
}

/**
 * Cambia la contraseña e inicia sesión.
 * Devuelve null si la contraseña cambió pero no se pudo iniciar sesión.
 */
export async function resetPasswordWithSecret(oobCode: string, email: string, newPassword: string): Promise<User | null> {
	await confirmPasswordReset(auth, oobCode, newPassword);
	let user: User;
	try {
		({ user } = await signInWithEmailAndPassword(auth, email, newPassword));
	} catch (error) {
		console.error('No se pudo iniciar sesión tras restablecer la contraseña', error);
		return null;
	}
	return user;
}
