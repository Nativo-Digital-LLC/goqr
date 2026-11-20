import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { auth, storage } from './firebase';
import { PaymentFrequency } from '../types/Bill';

export async function uploadFile(file: File): Promise<string> {
	const uid = auth.currentUser?.uid;
	if (!uid)
		throw new Error('Debes iniciar sesión para subir archivos.');

	const fileExtension = file.name.split('.').pop();
	const fileName = `uploads/${uid}/${crypto.randomUUID()}.${fileExtension}`;
	const storageRef = ref(storage, fileName);

	await uploadBytes(storageRef, file);
	const url = await getDownloadURL(storageRef);

	return url;
}

export function sendConversionEvent(paymentFrequency: PaymentFrequency, attempt = 1) {
	if (attempt === 5) {
		return;
	}

	if (window.dataLayer === undefined) {
		return setTimeout(() => {
			sendConversionEvent(paymentFrequency, attempt + 1);
		}, 3000);
	}

	const value = {
		[PaymentFrequency.Annual]: 4800,
		[PaymentFrequency.Monthly]: 500,
		[PaymentFrequency.Never]: 11000
	};

	// eslint-disable-next-line prefer-rest-params
	function gtag() { window.dataLayer.push(arguments); }
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	gtag('event', 'conversion', {
		'send_to': 'AW-16641087460/Pl7cCMeyrt8ZEOSvi_89',
		'value': value[paymentFrequency],
		'currency': 'DOP',
		'transaction_id': ''
	});
}
