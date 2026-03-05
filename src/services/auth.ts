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
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

import { auth, googleProvider, appleProvider, db, functions } from '../utils/firebase';
import { SessionProps } from '../types/Session';

const APPWRITE_ENDPOINT = 'https://appwrite.nd.com.do/v1';
const APPWRITE_PROJECT_ID = '66f768e4001537551adf';

export async function createAccount(name: string, email: string, password: string) {
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	if (name) {
		await updateProfile(user, { displayName: name });
	}
	await sendEmailVerification(user);

	// Registrar como migrado para evitar el check de Appwrite
	const migrationDocRef = doc(db, 'migratedUsers', email.toLowerCase());
	await setDoc(migrationDocRef, {
		migratedAt: new Date().toISOString(),
		email: email.toLowerCase()
	});
}

export async function login(email: string, password: string) {
	const migrationDocRef = doc(db, 'migrated-users', email.toLowerCase());
	const migrationDoc = await getDoc(migrationDocRef);

	if (migrationDoc.exists()) {
		// Ya fue migrado o creado acá, inicia sesión directo con Firebase
		const { user } = await signInWithEmailAndPassword(auth, email, password);
		return user;
	}

	// No migrado, intentar con Appwrite
	await axios.post(
		`${APPWRITE_ENDPOINT}/account/sessions/email`,
		{ email, password },
		{
			headers: {
				'Content-Type': 'application/json',
				'X-Appwrite-Project': APPWRITE_PROJECT_ID,
			},
		}
	);

	// Si Appwrite acepta, migramos la contraseña en Firebase llamando a la Cloud Function
	const updateUserPassword = httpsCallable(functions, 'updateUserPassword');
	await updateUserPassword({ email, newPassword: password });

	// Iniciamos sesión con la nueva contraseña en Firebase
	const { user } = await signInWithEmailAndPassword(auth, email, password);

	// Lo marcamos como migrado
	await setDoc(migrationDocRef, {
		migratedAt: new Date().toISOString(),
		email: email.toLowerCase()
	});

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
import axios from 'axios';

export async function resetPasswordWithSecret(oobCode: string, newPassword: string) {
	await confirmPasswordReset(auth, oobCode, newPassword);
}
