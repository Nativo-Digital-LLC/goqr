import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { account } from '../utils/appwrite';

export default function VerifyEmailPage() {
	const location = useLocation();
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const secret = params.get('secret');
		const userId = params.get('userId');

		if (!secret || !userId) {
			return alert('No se pudo verificar');
		}

		account
			.updateVerification(userId, secret)
			.then(() => alert('Cuenta verificada'))
			.catch(() => alert('No se pudo verificar'));
	}, []);

	return (
		<>

		</>
	);
}
