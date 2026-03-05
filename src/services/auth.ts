import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	sendEmailVerification,
	sendPasswordResetEmail,
	onAuthStateChanged,
	updateProfile,
	User
} from 'firebase/auth';

import { auth, googleProvider, appleProvider } from '../utils/firebase';
import { SessionProps } from '../types/Session';

export async function createAccount(name: string, email: string, password: string) {
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	if (name) {
		await updateProfile(user, { displayName: name });
	}
	await sendEmailVerification(user);
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

	await sendEmailVerification(auth.currentUser);
}

function mapUserToSession(user: User): SessionProps {
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
	await sendPasswordResetEmail(auth, email);
}

import { confirmPasswordReset } from 'firebase/auth';

export async function resetPasswordWithSecret(oobCode: string, newPassword: string) {
	await confirmPasswordReset(auth, oobCode, newPassword);
}
